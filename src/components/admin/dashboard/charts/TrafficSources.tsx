"use client";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { MoreVertical } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TrafficSources() {
  const data = {
    labels: ["Direct", "Organic", "Referral", "Social"],
    datasets: [
      {
        data: [42, 28, 18, 12],
        backgroundColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(139, 92, 246)",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "70%",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-800">Traffic Sources</h3>
        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      <div className="h-48 flex items-center justify-center">
        <Doughnut data={data} options={options} />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          <span className="text-xs text-gray-600">Direct 42%</span>
        </div>
        <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          <span className="text-xs text-gray-600">Organic 28%</span>
        </div>
        <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
          <span className="text-xs text-gray-600">Referral 18%</span>
        </div>
        <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
          <span className="text-xs text-gray-600">Social 12%</span>
        </div>
      </div>
    </div>
  );
}