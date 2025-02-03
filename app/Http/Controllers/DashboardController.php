<?php
namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Relative;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getDashboardData()
    {
        // Fetch today's birthdays from the 'customers' table and eager load related data
        $todaysBirthdays = Customer::whereDate('birthdate', Carbon::today())
            ->with('relatives') // Eager load relatives of the customer
            ->get();

        // Fetch today's birthdays from the 'relatives' table, and get the associated customers
        $todaysRelativeBirthdays = Relative::whereDate('birthdate', Carbon::today())
            ->with('customer') // Eager load the associated customer
            ->get();

        // Merge the data of customer birthdays and relative birthdays
        $todaysBirthdays = $todaysBirthdays->merge($todaysRelativeBirthdays->map(function($relative) {
            $relative->customer->is_relative = true; // Mark if it's a relative's birthday
            return $relative->customer;
        }));

        // Fetch upcoming birthdays (next 7 days) from the 'customers' table
        $upcomingBirthdays = Customer::whereDate('birthdate', '>', Carbon::today())
            ->whereDate('birthdate', '<', Carbon::today()->addDays(7))
            ->with('relatives') // Eager load relatives of the customer
            ->get();

        // Fetch upcoming birthdays from the 'relatives' table, and get the associated customers
        $upcomingRelativeBirthdays = Relative::whereDate('birthdate', '>', Carbon::today())
            ->whereDate('birthdate', '<', Carbon::today()->addDays(7))
            ->with('customer') // Eager load the associated customer
            ->get();

        // Merge the data of customer birthdays and relative birthdays
        $upcomingBirthdays = $upcomingBirthdays->merge($upcomingRelativeBirthdays->map(function($relative) {
            $relative->customer->is_relative = true; // Mark if it's a relative's birthday
            return $relative->customer;
        }));

        // Fetch today's anniversaries from the 'customers' table (based on anniversary_date)
        $todaysAnniversaries = Customer::whereDate('anniversary_date', Carbon::today())
            ->with('relatives') // Eager load relatives of the customer
            ->get();

        // Fetch upcoming anniversaries (next 7 days) from the 'customers' table (based on anniversary_date)
        $upcomingAnniversaries = Customer::whereDate('anniversary_date', '>', Carbon::today())
            ->whereDate('anniversary_date', '<', Carbon::today()->addDays(7))
            ->with('relatives') // Eager load relatives of the customer
            ->get();

        // Return the data in the expected structure
        return response()->json([
            'message' => 'Dashboard data retrieved successfully',
            'todays_birthdays' => $todaysBirthdays,
            'upcoming_birthdays' => $upcomingBirthdays,
            'todays_anniversaries' => $todaysAnniversaries,
            'upcoming_anniversaries' => $upcomingAnniversaries,
        ]);
    }
}
