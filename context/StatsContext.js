"use client";

import React, { createContext, useContext, useState } from "react";

const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalSold: 0,
    totalFeatured: 0,
  });

  const updateProducts = (newProducts) => {
    setProducts(newProducts);

    // tính lại stats
    const totalProducts = newProducts.length;
    const totalStock = newProducts.reduce((acc, p) => acc + (p.so_luong || 0), 0);
    const totalSold = newProducts.reduce((acc, p) => acc + (p.da_ban || 0), 0);
    const totalFeatured = newProducts.filter(
      (p) => p.noi_bat === 1 || p.noi_bat === true
    ).length;

    setStats({ totalProducts, totalStock, totalSold, totalFeatured });
  };

  return (
    <StatsContext.Provider value={{ products, stats, setProducts: updateProducts }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => useContext(StatsContext);
