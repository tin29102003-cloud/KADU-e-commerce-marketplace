"use client"

import React, { useState, useEffect } from 'react'
import StatCard from '@/components/StatCard'
import { DollarSign, ShoppingBag, SquareActivity, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import SalesOverviewChart from '@/components/SalesOverviewChart'
import CategoryDistributionChart from '@/components/CategoryDistributionChart'
import OrderDistributionChart from '@/components/OrderDistributionChart'
import ProductPerformanceChart from '@/components/ProductPerformanceChart'
import SPNoiBat from '@/components/SPNoiBat'
import ShopNoiBat from '@/components/ShopNoiBat'
import axiosClient from '@/lib/axiosClient'

const OverviewPage = () => {
  const [overview, setOverview] = useState({
    doanh_thu: 0,
    tong_user: 0,
    don_hang_thanh_toan: 0,
    tong_shop: 0
  })

  const fetchOverview = async () => {
    try {
      const res = await axiosClient.get('/admin/thong-ke/tong-quan')
      const data = res.data?.data

      setOverview({
        doanh_thu: data?.doanh_thu || 0,
        tong_user: data?.tong_user || 0,
        don_hang_thanh_toan: data?.don_hang_thanh_toan || 0,
        tong_shop: data?.tong_shop || 0
      })
    } catch (err) {
      console.error("Fetch overview data error:", err)
    }
  }

  useEffect(() => {
    fetchOverview()
  }, [])

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <main className='max-w-7xl mx-auto py-4 px-4 lg:px-8'>
        <motion.div 
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard 
            name="Tổng doanh thu" 
            icon={DollarSign} 
            value={parseInt(overview.doanh_thu).toLocaleString() + " ₫"} 
          />
          <StatCard 
            name="Tổng số người dùng" 
            icon={Users} 
            value={parseInt(overview.tong_user).toLocaleString()} 
          />
          <StatCard 
            name="Đơn hàng đã thanh toán" 
            icon={ShoppingBag} 
            value={parseInt(overview.don_hang_thanh_toan).toLocaleString()} 
          />
          <StatCard 
            name="Tổng số shop" 
            icon={SquareActivity} 
            value={parseInt(overview.tong_shop).toLocaleString()} 
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <SalesOverviewChart/>
          <CategoryDistributionChart/>
          <OrderDistributionChart/>
          <ProductPerformanceChart/>
        </div>

        <SPNoiBat className="mb-10"/>
        <ShopNoiBat/>
      </main>
    </div>
  )
}

export default OverviewPage
