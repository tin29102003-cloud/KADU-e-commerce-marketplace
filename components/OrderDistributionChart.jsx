"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import axios from "axios";
import axiosClient from "@/lib/axiosClient";

const COLORS = ["#fbc02d", "#03a9f4", "#88c34a", "#ef4444", "#a855f7"];

const OrderDistributionChart = () => {
  const [orderStatusData, setOrderStatusData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosClient.get(
          "http://localhost:5000/api/admin/thong-ke/trang-thai-don-hang"
        );

        const data = res.data?.data;

        if (!data) return;

        const formattedData = [
          {
            name: "Chờ xác nhận",
            value: data.cho_xac_nhan?.phan_tram || 0,
          },
          {
            name: "Đã xác nhận",
            value: data.da_xac_nhan?.phan_tram || 0,
          },
          {
            name: "Đang giao",
            value: data.dang_giao?.phan_tram || 0,
          },
          {
            name: "Hoàn thành",
            value: data.thanh_cong?.phan_tram || 0,
          },
          {
            name: "Đã hủy",
            value: data.da_huy?.phan_tram || 0,
          },
        ].filter(item => item.value > 0); // ✅ CÁCH 1: loại bỏ trạng thái = 0%

        setOrderStatusData(formattedData);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu trạng thái đơn hàng:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.div
      className="bg-[#1e1e1e] backdrop-blur-md shadow-lg
      p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <h2 className="text-base md:text-xl font-semibold text-gray-100 mb-4 text-center md:text-left">
        Phân phối trạng thái đơn hàng
      </h2>

      <div className="w-full h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={orderStatusData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name} ${value}%`}
              labelLine
            >
              {orderStatusData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.9)",
                borderColor: "#4b5563",
                borderRadius: "8px",
                padding: "8px",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#e5e7eb" }}
            />

            <Legend
              iconType="circle"
              layout="horizontal"
              align="center"
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default OrderDistributionChart;
