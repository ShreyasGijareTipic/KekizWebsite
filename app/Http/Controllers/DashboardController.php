<?php
namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Relative;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getDashboardData()
    {
        $today = Carbon::today();
        $nextFifteenDays = Carbon::today()->addDays(15);

        // Today's Birthdays
        $todaysBirthdays = Customer::select('name', 'mobile', 'birthdate')
            ->whereRaw("DATE_FORMAT(birthdate, '%m-%d') = ?", [$today->format('m-d')])
            ->get();

        // Today's Relatives' Birthdays
        $todaysRelativeBirthdays = Relative::select('name', 'birthdate', 'customer_id')
            ->whereRaw("DATE_FORMAT(birthdate, '%m-%d') = ?", [$today->format('m-d')])
            ->with('customer:id,name,mobile')  // Fetch associated customer details
            ->get();

        // Today's Anniversaries
        $todaysAnniversaries = Customer::select('name', 'mobile', 'anniversary_date')
            ->whereRaw("DATE_FORMAT(anniversary_date, '%m-%d') = ?", [$today->format('m-d')])
            ->get();

        // Upcoming Birthdays
        $upcomingBirthdays = Customer::select('name', 'mobile', 'birthdate')
            ->whereRaw("DATE_FORMAT(birthdate, '%m-%d') BETWEEN ? AND ?", [
                $today->addDay()->format('m-d'),
                $nextFifteenDays->format('m-d')
            ])
            ->get();

        // Upcoming Relatives' Birthdays
        $upcomingRelativeBirthdays = Relative::select('name', 'birthdate', 'customer_id')
            ->whereRaw("DATE_FORMAT(birthdate, '%m-%d') BETWEEN ? AND ?", [
                $today->addDay()->format('m-d'),
                $nextFifteenDays->format('m-d')
            ])
            ->with('customer:id,name,mobile')  // Fetch associated customer details
            ->get();

        // Upcoming Anniversaries
        $upcomingAnniversaries = Customer::select('name', 'mobile', 'anniversary_date')
            ->whereRaw("DATE_FORMAT(anniversary_date, '%m-%d') BETWEEN ? AND ?", [
                $today->addDay()->format('m-d'),
                $nextFifteenDays->format('m-d')
            ])
            ->get();

        return response()->json([
            'message' => 'Dashboard data retrieved successfully',
            'todays_birthdays' => [
                'customers' => $todaysBirthdays->map(function ($customer) {
                    $customer->birthdate = Carbon::parse($customer->birthdate)->format('Y-m-d');
                    return $customer;
                }),
                'relatives' => $todaysRelativeBirthdays->map(function ($relative) {
                    $relative->birthdate = Carbon::parse($relative->birthdate)->format('Y-m-d');
                    $relative->customer = $relative->customer ? $relative->customer : null;
                    return $relative;
                })
            ],
            'todays_anniversaries' => $todaysAnniversaries->map(function ($anniversary) {
                $anniversary->anniversary_date = Carbon::parse($anniversary->anniversary_date)->format('Y-m-d');
                return $anniversary;
            }),
            'upcoming_birthdays' => [
                'customers' => $upcomingBirthdays->map(function ($customer) {
                    $customer->birthdate = Carbon::parse($customer->birthdate)->format('Y-m-d');
                    return $customer;
                }),
                'relatives' => $upcomingRelativeBirthdays->map(function ($relative) {
                    $relative->birthdate = Carbon::parse($relative->birthdate)->format('Y-m-d');
                    $relative->customer = $relative->customer ? $relative->customer : null;
                    return $relative;
                })
            ],
            'upcoming_anniversaries' => $upcomingAnniversaries->map(function ($anniversary) {
                $anniversary->anniversary_date = Carbon::parse($anniversary->anniversary_date)->format('Y-m-d');
                return $anniversary;
            }),
        ]);
    }
}
