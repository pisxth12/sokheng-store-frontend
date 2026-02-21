// components/admin/RecentActivity.tsx
import React from "react";

interface Activity {
  user: string;
  action: string;
  date: string;
  status: "Completed" | "Processing" | "Pending";
}

const activities: Activity[] = [
  { user: "Alice Chen", action: "Created invoice", date: "2 min ago", status: "Completed" },
  { user: "Bob Smith", action: "Updated profile", date: "15 min ago", status: "Processing" },
  { user: "Carol White", action: "Deleted file", date: "1 hour ago", status: "Completed" },
  { user: "David Lee", action: "Added team member", date: "3 hours ago", status: "Pending" },
];

export default function RecentActivity() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3 font-medium">User</th>
              <th className="pb-3 font-medium">Action</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {activities.map((item, idx) => (
              <tr key={idx} className="border-b last:border-0">
                <td className="py-3">{item.user}</td>
                <td className="py-3">{item.action}</td>
                <td className="py-3">{item.date}</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Processing"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}