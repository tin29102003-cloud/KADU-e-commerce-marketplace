"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axiosClient from "@/lib/axiosClient";
import { Switch } from "@headlessui/react";

const PAGE_SIZE = 5;

const ProductsReview = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products chưa kích hoạt từ backend
  const fetchProducts = async (pageNumber = 1, keyword = "") => {
    try {
      const params = { page: pageNumber, limit: PAGE_SIZE };
      if (keyword) params.keyword = keyword;

      const res = await axiosClient.get("/admin/san-pham/kich-hoat", { params });
      const { data, pagination } = res.data.result;
      setProducts(data);
      setPage(pagination?.currentPage || 1);
      setTotalPages(pagination?.totalPages || 1);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  // Gọi lại khi page hoặc search thay đổi (search realtime)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts(1, search);
    }, 300); // debounce 300ms
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchProducts(page, search);
  }, [page]);

  // Duyệt sản phẩm
  const handleApprove = async (id, value) => {
    try {
      await axiosClient.patch(`/admin/san-pham/kich-hoat/${id}`, {
        is_active: value ? 1 : 0,
      });
      // loại bỏ sản phẩm đã duyệt khỏi bảng
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Approve product failed:", err);
    }
  };

  return (
    <motion.div
      className="bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-100">
          Duyệt sản phẩm
        </h2>
        {/* <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="px-3 py-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        /> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {["Tên sản phẩm", "ID", "Danh mục", "Duyệt"].map((header) => (
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
              products.map((product) => (
                <tr key={product.id}>
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
                    {product.danh_muc?.ten_dm || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <Switch
                      checked={false} // chưa duyệt
                      onChange={(checked) => handleApprove(product.id, checked)}
                      className="bg-gray-700 relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                    >
                      <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                    </Switch>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-gray-400 px-6 py-4 text-center">
                  Không tìm thấy sản phẩm
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-300">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ProductsReview;
