"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axiosClient from "@/lib/axiosClient";

const SPNoiBat = () => {
  const [products, setProducts] = useState([]);

  const fetchTopProducts = async () => {
    try {
      const res = await axiosClient.get("/admin/thong-ke/top");
      console.log("Top products API response:", res.data);

      // Lấy mảng top_san_pham
      const topProducts = res.data?.data?.top_san_pham || [];

      // Lấy top 5 sản phẩm
      setProducts(topProducts.slice(0, 5));
    } catch (err) {
      console.error("Fetch top products error:", err);
    }
  };

  useEffect(() => {
    fetchTopProducts();
  }, []);

  return (
    <motion.div
      className="bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <h2 className="text-lg md:text-xl font-semibold text-gray-100 mb-6">
        Top 5 sản phẩm bán chạy
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {["Tên sản phẩm", "ID", "Giá", "Đã bán"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {products.length > 0 ? (
              products.map((item) => {
                const product = item.san_pham;
                return (
                  <tr key={item.id_sp}>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Image
                        src={product.img || "/placeholder.png"}
                        alt={product.ten_sp}
                        width={40}
                        height={40}
                        className="rounded"
                      />
                      <span className="text-gray-100">{product.ten_sp}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{product.id}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {product.gia?.toLocaleString() || 0} ₫
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {item.tong_da_ban || 0}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-gray-400 px-6 py-4 text-center">
                  Không có sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default SPNoiBat;
