<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Customer;
use App\Models\JarTracker;
use App\Models\PaymentTracker;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
    protected $user;

    public function __construct()
    {
        $this->user = Auth::user();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $companyId = $user->company_id;
        $userType = $user->type;

        if ($userType == 0) {
            return Customer::all();
        } else {
            return Customer::where('company_id', $companyId)->get();
        }
    }

    public function search(Request $request)
    {
        $request->validate([
            'searchQuery' => 'required|string',
        ]);

        $user = Auth::user();
        $companyId = $user->company_id;
        $userType = $user->type;
        $searchQuery = $request->query('searchQuery');

        if ($userType == 0) {
            return Customer::where('name', 'LIKE', '%' . $searchQuery . '%')->get();
        } else {
            return Customer::where('company_id', $companyId)
                ->where(function ($query) use ($searchQuery) {
                    $query->where('name', 'LIKE', '%' . $searchQuery . '%')
                        ->orWhere('mobile', 'LIKE', '%' . $searchQuery . '%');
                })
                ->get();
        }
    }

    public function history(Request $request)
    {
        $request->validate([
            'id' => 'required|string',
        ]);

        $id = $request->query('id');
        $returnEmptyProducts = JarTracker::where('customer_id', $id)->get();
        $paymentTrackerSum = PaymentTracker::where('customer_id', $id)->sum('amount');

        return response()->json([
            'returnEmptyProducts' => $returnEmptyProducts,
            'pendingPayment' => $paymentTrackerSum * -1,
        ]);
    }

    public function creditReport(Request $request)
    {
        $user = Auth::user();
        $companyId = $user->company_id;

        $customers = Customer::with(['paymentTracker', 'jarTrackers'])
            ->where('company_id', $companyId)
            ->get();

        $creditReports = [];

        foreach ($customers as $customer) {
            if ($customer->paymentTracker) {
                $creditReports[] = [
                    'name' => $customer->name,
                    'mobile' => $customer->mobile,
                    'birthdate' => $customer->birthdate,
                    'anniversary_date' => $customer->anniversary_date,
                    'totalPayment' => $customer->paymentTracker->amount,
                    'customerId' => $customer->id,
                    'items' => $customer->jarTrackers,
                ];
            }
        }

        return response()->json($creditReports);
    }

    public function resetAllPayments()
    {
        $user = Auth::user();
        $distinctCustomerIds = PaymentTracker::distinct('customer_id')->pluck('customer_id');
        $newPayments = [];

        foreach ($distinctCustomerIds as $customerId) {
            $paymentSum = PaymentTracker::where('customer_id', $customerId)->sum('amount');
            $newPayments[] = [
                'customer_id' => $customerId,
                'amount' => $paymentSum,
                'isCredit' => ($paymentSum < 0),
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ];
        }

        PaymentTracker::truncate();
        PaymentTracker::insert($newPayments);

        return response()->json([
            'message' => 'All entries deleted and new entries added with the sums for each customer.',
            'new_payments' => $newPayments,
        ]);
    }

    public function booking(Request $request)
    {
        $request->validate([
            'id' => 'required|string',
        ]);

        $id = $request->query('id');
        $user = Auth::user();

        $orders = Order::with(['items'])
            ->where('company_id', $user->company_id)
            ->where('invoiceType', 2)
            ->where('orderStatus', 2)
            ->where('customer_id', $id)
            ->get();

        return $orders;
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'mobile' => [
                'required',
                'string',
                Rule::unique('customers')->where('company_id', $request->company_id),
            ],
            'birthdate' => 'nullable|date',
            'anniversary_date' => 'nullable|date',
            'show' => 'required',
            'company_id' => 'required',
        ]);

        return Customer::create($request->all());
    }

    public function show($id)
    {
        $user = Auth::user();
        $companyId = $user->company_id;
        $userType = $user->type;

        if ($userType == 0) {
            return Customer::find($id);
        } else {
            return Customer::where('company_id', $companyId)->find($id);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'mobile' => 'required|string',
            'birthdate' => 'nullable|date',
            'anniversary_date' => 'nullable|date',
            'show' => 'required',
            'company_id' => 'required',
        ]);

        $user = Auth::user();
        $companyId = $user->company_id;
        $userType = $user->type;

        if ($userType == 0) {
            $customer = Customer::find($id);
        } else {
            $customer = Customer::where('company_id', $companyId)->find($id);
        }

        if ($customer) {
            $customer->update($request->all());
        }

        return $customer;
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $companyId = $user->company_id;
        $userType = $user->type;

        if ($userType == 0) {
            return Customer::destroy($id);
        } else {
            return Customer::where('company_id', $companyId)->where('id', $id)->delete();
        }
    }
}
