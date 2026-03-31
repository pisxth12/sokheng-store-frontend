import { UserStats } from "@/types/admin/user.type";
import { BadgeCheck, UserPlus, Users, TrendingUp} from "lucide-react";

interface UserStatsCardProps {
    stats: UserStats | null;
    loading: boolean;
}

export default function UserStatsCard({ stats, loading }: UserStatsCardProps) {
     const now = new Date();
  const dayPassed = now.getDate();

  const dasysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dailyAvg = stats?.newThisMonth ? (stats.newThisMonth / dayPassed).toFixed(1) : '0.0';
  const projected = stats?.newThisMonth ? Math.round((stats.newThisMonth / dayPassed) * 30) : 0;
  const growth = stats?.totalUsersGrowth || 0;
  const isPositive = growth >= 0;
  const conversion = stats?.totalUsers
  ? ((stats.usersWithOrders / stats.totalUsers) * 100).toFixed(0)
  : 0;

  const percentOfUsers = stats?.totalUsers
  ? ((stats.usersWithOrders / stats.totalUsers) * 100).toFixed(0)
  : 0;




  if (!stats) return null;

  return(
     <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  
  {/* Total Users - Add growth trend */}
  <div className="bg-white rounded-xl border p-6">
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-gray-500">Total Users</p>
        <p className="text-2xl font-semibold">{stats?.totalUsers || 0}</p>
        <div className="flex items-center gap-1 mt-1">
          <TrendingUp className="w-3 h-3 text-green-600" />
          <p className="text-xs text-green-600"> +{stats?.totalUsersGrowth || 0}% from last month</p>
        </div>
      </div>
      <Users className="w-6 h-6 text-gray-400" />
    </div>
    <div className="mt-3 pt-3 border-t">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">This week: {stats?.newThisWeek || 0}</span>
        <span className="text-gray-500">This month: {stats?.newThisMonth || 0}</span>
      </div>
    </div>
  </div>

  {/* New Users This Month - Add daily avg */}
  <div className="bg-white rounded-xl border p-6">
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-gray-500">New Users This Month</p>
        <p className="text-2xl font-semibold">{stats?.newUsersThisMonth || 0}</p>
        <p className={`text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? "↑" : "↓"} {Math.abs(growth)}% vs last month
      </p>
      </div>
      <UserPlus className="w-6 h-6 text-blue-500" />
    </div>
    <div className="mt-3 pt-3 border-t">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Daily avg: {dailyAvg}</span>
        <span className="text-gray-500">Projected: {projected}</span>
      </div>
    </div>
  </div>

  {/* Users with Orders - Keep as is, it's good */}
  <div className="bg-white rounded-xl border p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">Users with Orders</p>
        <p className="text-2xl font-semibold">{stats?.usersWithOrders || 0}</p>
        <p className="text-xs text-gray-500 mt-1">Avg. order value: ${stats?.avgOrderValue || 0}</p>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900">{conversion}%</div>
        <p className="text-xs text-gray-400">conversion</p>
      </div>
    </div>
    <div className="mt-3 pt-3 border-t">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">One-time: {stats?.oneTimeBuyers || 0}</span>
        <span className="text-gray-500">Repeat: {stats?.repeatCustomers  || 0}</span>
      </div>
    </div>
  </div>

  {/* Fully Verified - Fix the duplicate/incomplete info */}
  <div className="bg-white rounded-xl border p-6">
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-gray-500">Fully Verified</p>
        <p className="text-2xl font-semibold">{stats?.fullyVerified || 0}</p>
        <p className="text-xs text-green-600">{percentOfUsers}% of total users</p>
      </div>
      <BadgeCheck className="w-6 h-6 text-green-500" />
    </div>
    <div className="mt-3 pt-3 border-t">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Email: {stats?.emailVerified || 0} (80%)</span>
        <span className="text-gray-500">Phone: {stats?.phoneVerified || 0} (62%)</span>
      </div>
    </div>
  </div>

</div>
  )

}