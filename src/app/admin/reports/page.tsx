"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Printer,
  Mail,
  ChevronDown,
  Package,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";

interface Report {
  id: string;
  name: string;
  type: "sales" | "products" | "users" | "inventory";
  date: string;
  size: string;
  format: "PDF" | "Excel" | "CSV";
}

const reports: Report[] = [
  { id: "1", name: "Monthly Sales Report", type: "sales", date: "2024-03-01", size: "2.4 MB", format: "PDF" },
  { id: "2", name: "Top Products", type: "products", date: "2024-03-01", size: "1.2 MB", format: "Excel" },
  { id: "3", name: "User Activity", type: "users", date: "2024-02-28", size: "3.1 MB", format: "CSV" },
  { id: "4", name: "Inventory Status", type: "inventory", date: "2024-02-28", size: "1.8 MB", format: "PDF" },
  { id: "5", name: "Quarterly Revenue", type: "sales", date: "2024-02-25", size: "4.2 MB", format: "PDF" },
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState("all");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Generate and download reports</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <FileText className="w-4 h-4" />
          Generate New Report
        </button>
      </div>

      {/* Report Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sales Reports</p>
              <p className="text-lg font-semibold text-gray-800">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-green-500 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Product Reports</p>
              <p className="text-lg font-semibold text-gray-800">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-purple-500 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">User Reports</p>
              <p className="text-lg font-semibold text-gray-800">6</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-orange-500 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Analytics Reports</p>
              <p className="text-lg font-semibold text-gray-800">9</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Date range"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
          
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="all">All Types</option>
            <option value="sales">Sales</option>
            <option value="products">Products</option>
            <option value="users">Users</option>
            <option value="inventory">Inventory</option>
          </select>

          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name</option>
          </select>

          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Format</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-800">{report.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    report.type === "sales" ? "bg-blue-100 text-blue-700" :
                    report.type === "products" ? "bg-green-100 text-green-700" :
                    report.type === "users" ? "bg-purple-100 text-purple-700" :
                    "bg-orange-100 text-orange-700"
                  }`}>
                    {report.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{report.date}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{report.size}</td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-700">{report.format}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Printer className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1  sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <p className="text-blue-100 mb-2">Total Reports</p>
          <p className="text-3xl font-bold">24</p>
          <p className="text-blue-100 text-sm mt-2">Generated this month</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <p className="text-green-100 mb-2">Last Generated</p>
          <p className="text-3xl font-bold">Today</p>
          <p className="text-green-100 text-sm mt-2">Sales Report - March</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <p className="text-purple-100 mb-2">Storage Used</p>
          <p className="text-3xl font-bold">156 MB</p>
          <p className="text-purple-100 text-sm mt-2">of 1 GB total</p>
        </div>
      </div>
    </div>
  );
}