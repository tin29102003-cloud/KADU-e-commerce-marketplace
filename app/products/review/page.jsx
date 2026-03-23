"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import { ChartBarStacked, DollarSign, ShoppingBag, SquareActivity } from "lucide-react";
import ProductsReview from "@/components/ProductsReview";
import axiosClient from "@/lib/axiosClient";
import { StatsProvider, useStats } from "@/context/StatsContext";

const ProductsStats = () => {
  const { stats } = useStats();
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <StatCard
        name="Tổng số sản phẩm"
        icon={ShoppingBag}
        value={stats.totalProducts.toLocaleString()}
      />
      <StatCard
        name="Tổng hàng tồn kho"
        icon={SquareActivity}
        value={stats.totalStock.toLocaleString()}
      />
      <StatCard
        name="Tổng hàng đã bán"
        icon={DollarSign}
        value={stats.totalSold.toLocaleString()}
      />
      <StatCard
        name="Sản phẩm nổi bật"
        icon={ChartBarStacked}
        value={stats.totalFeatured.toLocaleString()}
      />
    </motion.div>
  );
};

const ProductsPage = () => {
  const { setProducts } = useStats();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get("/admin/san-pham", {
          params: { page: 1, limit: 10000 },
        });
        setProducts(res.data.result.data);
      } catch (err) {
        console.error("Fetch products error:", err);
      }
    };
    fetchProducts();
  }, [setProducts]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <ProductsStats />
        <ProductsReview />
      </main>
    </div>
  );
};

export default function PageWrapper() {
  return (
    <StatsProvider>
      <ProductsPage />
    </StatsProvider>
  );
}
