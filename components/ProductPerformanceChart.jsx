"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axios from "axios";
import axiosClient from "@/lib/axiosClient";

const ProductPerformanceChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axiosClient.get(
          "http://localhost:5000/api/admin/thong-ke/doanh-thu-chart?type=&year=2025&month="
        );

        const backendData = res.data?.chart_data || [];

        // Map dữ liệu backend -> recharts
        const formattedData = backendData.map(item => ({
          name: item.label,      // Tháng 1, Tháng 2, ...
          Retention: item.value, // doanh thu
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu hiệu suất sản phẩm:", error);
      }
    };

    fetchChartData();
  }, []);

  return (
    <motion.div
      className="bg-[#1e1e1e] backdrop-blur-lg shadow-lg rounded-xl
      p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <h2 className="text-base md:text-xl font-semibold text-gray-100 mb-4 text-center md:text-left">
        Doanh thu theo tháng
      </h2>

      <div className="w-full h-64 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

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
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.9)",
                borderColor: "#4b5563",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#e5e7eb" }}
            />

            <Legend wrapperStyle={{ fontSize: 12 }} />

            <Bar
              dataKey="Retention"
              name="Doanh thu"
              fill="#ff7043"
              radius={[4, 4, 0, 0]}
              barSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ProductPerformanceChart;
