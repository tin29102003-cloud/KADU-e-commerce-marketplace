"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axiosClient from "@/lib/axiosClient";
import { Switch } from "@headlessui/react";
import { Trash2 } from "lucide-react";

const PAGE_SIZE = 5;

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products từ backend (có search và page)
  const fetchProducts = async (pageNumber = 1, keyword = "") => {
    try {
      const url = keyword
        ? "/admin/san-pham/tim-kiem"
        : "/admin/san-pham";

      const res = await axiosClient.get(url, {
        params: { page: pageNumber, limit: PAGE_SIZE, keyword },
      });

      const { data, pagination } = res.data.result;

      setProducts(data);
      setPage(pagination?.currentPage || 1);
      setTotalPages(pagination?.totalPages || 1);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  // Search
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchProducts(1, search);
    }
  };

  // Fetch lần đầu
  useEffect(() => {
    fetchProducts(page, search);
  }, []);

  // Prev/Next page
  const handlePageChange = (newPage) => {
    fetchProducts(newPage, search);
  };

  // Toggle noi_bat / khoa
  const handleToggle = async (id, field, value) => {
    try {
      const body =
        field === "noi_bat"
          ? { noi_bat: value ? 1 : 0, khoa: undefined }
          : { noi_bat: undefined, khoa: value ? 1 : 0 };

      await axiosClient.patch(`/admin/san-pham/${id}/quick-update`, body);

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      );
    } catch (err) {
      console.error(`Update ${field} failed:`, err);
    }
  };

  // Xóa sản phẩm
  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await axiosClient.delete(`/admin/san-pham/${id}`);
      fetchProducts(page, search);
    } catch (err) {
      console.error("Delete product failed:", err);
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
          Danh sách sản phẩm
        </h2>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="px-3 py-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {["Tên sản phẩm", "ID", "Giá", "Nổi bật", "Khóa", "Hành động"].map(
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
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Image
                      src={product.img}
                      alt={product.ten_sp}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                    <span className="text-gray-100">{product.ten_sp}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{product.id}</td>
                  <td className="px-6 py-4 text-gray-300">
                    {product.gia.toLocaleString()} ₫
                  </td>
                  <td className="px-6 py-4">
                    <Switch
                      checked={product.noi_bat}
                      onChange={(checked) =>
                        handleToggle(product.id, "noi_bat", checked)
                      }
                      className={`${
                        product.noi_bat ? "bg-green-500" : "bg-gray-700"
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                    >
                      <span
                        className={`${
                          product.noi_bat ? "translate-x-6" : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </td>
                  <td className="px-6 py-4">
                    <Switch
                      checked={product.khoa}
                      onChange={(checked) =>
                        handleToggle(product.id, "khoa", checked)
                      }
                      className={`${
                        product.khoa ? "bg-red-500" : "bg-gray-700"
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                    >
                      <span
                        className={`${
                          product.khoa ? "translate-x-6" : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-gray-400 px-6 py-4 text-center">
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
            onClick={() => handlePageChange(page - 1)}
            className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-300">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ProductsTable;
