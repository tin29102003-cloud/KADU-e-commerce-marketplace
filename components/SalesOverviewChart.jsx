"use client";

import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import axiosClient from "@/lib/axiosClient";

const SalesOverviewChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchRevenueChart = async () => {
    try {
      const res = await axiosClient.get(
        "/admin/thong-ke/doanh-thu-chart",
        {
          params: {
            type: "day",
            year: 2025,
            month: 12,
          },
        }
      );

      const chartData = res.data?.chart_data || [];

      // map đúng format cho recharts
      const formattedData = chartData.map((item) => ({
        name: item.label,
        sales: item.value,
      }));

      setSalesData(formattedData);
      setTotal(res.data?.summary?.total || 0);
    } catch (error) {
      console.error("Fetch revenue chart error:", error);
    }
  };

  useEffect(() => {
    fetchRevenueChart();
  }, []);

  return (
    <motion.div
      className="bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <h2 className="text-base md:text-lg font-medium mb-1 text-gray-100">
        Tổng doanh thu
      </h2>

      <p className="text-sm text-gray-400 mb-4">
        Tổng: {total.toLocaleString()} ₫
      </p>

      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />

            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              width={60}
              tickFormatter={(value) =>
                `${(value / 1_000_000).toFixed(1)}M`
              }
            />

            <Tooltip
              formatter={(value) =>
                `${value.toLocaleString()} ₫`
              }
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.9)",
                borderColor: "#4b5563",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#e5e7eb" }}
            />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="#9c27b0"
              strokeWidth={3}
              dot={{ fill: "#9c27b0", r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesOverviewChart;
