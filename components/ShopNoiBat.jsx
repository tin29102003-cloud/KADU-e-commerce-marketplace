"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axiosClient from "@/lib/axiosClient";

const ShopNoiBat = () => {
  const [shops, setShops] = useState([]);

  const fetchTopShops = async () => {
    try {
      const res = await axiosClient.get("/admin/thong-ke/top");
      console.log("Top shops API response:", res.data);

      // Lấy mảng top_shop
      const topShops = res.data?.data?.top_shop || [];

      // Lấy top 5 shop
      setShops(topShops.slice(0, 5));
    } catch (err) {
      console.error("Fetch top shops error:", err);
    }
  };

  useEffect(() => {
    fetchTopShops();
  }, []);

  return (
    <motion.div
      className="bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <h2 className="text-lg md:text-xl font-semibold text-gray-100 mb-6">
        Top 5 shop bán chạy
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {["Tên shop", "ID", "Số đơn hàng", "Tổng doanh thu"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {shops.length > 0 ? (
              shops.map((item) => {
                const shop = item.shop;
                return (
                  <tr key={item.id_shop}>
                    <td className="px-6 py-4 text-gray-100">{shop.ten_shop}</td>
                    <td className="px-6 py-4 text-gray-300">{shop.id}</td>
                    <td className="px-6 py-4 text-gray-300">{item.so_don_hang}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {parseInt(item.tong_doanh_thu)?.toLocaleString() || 0} ₫
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-gray-400 px-6 py-4 text-center">
                  Không có shop nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ShopNoiBat;
