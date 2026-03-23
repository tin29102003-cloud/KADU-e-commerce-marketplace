"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Ban, CheckCircle, Clock, ShoppingBag } from 'lucide-react'
import StatCard from '@/components/StatCard'
import OrdersTable from '@/components/OrdersTable'
import axiosClient from '@/lib/axiosClient' // điều chỉnh đường dẫn nếu cần

/* ===== MAP ICON ===== */
const iconMap = {
  ShoppingBag,
  CheckCircle,
  Clock,
  Ban,
}

const OrderPage = () => {
  const [orderStats, setOrderStats] = useState([
    { name: "Tổng đơn hàng", value: 0, icon: "ShoppingBag" },
    { name: "Đã hoàn thành", value: 0, icon: "CheckCircle" },
    { name: "Đang giao", value: 0, icon: "Clock" },
    { name: "Đã hủy", value: 0, icon: "Ban" },
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch thống kê trạng thái đơn hàng
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get('/admin/thong-ke/trang-thai-don-hang')

        if (response.data?.success && response.data?.data) {
          const data = response.data.data

          setOrderStats([
            { name: "Tổng đơn hàng", value: data.tong_cong || 0, icon: "ShoppingBag" },
            { name: "Đã hoàn thành", value: data.thanh_cong?.so_luong || 0, icon: "CheckCircle" },
            { name: "Đang giao", value: data.dang_giao?.so_luong || 0, icon: "Clock" },
            { name: "Đã hủy", value: data.da_huy?.so_luong || 0, icon: "Ban" },
          ])
        } else {
          setError('Không lấy được thống kê đơn hàng')
        }
      } catch (err) {
        console.error('Lỗi fetch thống kê:', err)
        setError('Lỗi khi tải thống kê đơn hàng')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Đang tải thống kê đơn hàng...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="flex-1 relative overflow-auto z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          {orderStats.map(({ name, value, icon }) => {
            const IconComponent = iconMap[icon]

            return (
              <StatCard
                key={name}
                name={name}
                icon={IconComponent}
                value={value.toLocaleString('vi-VN')} // format số đẹp hơn
              />
            )
          })}
        </motion.div>

        <OrdersTable />
      </main>
    </div>
  )
}

export default OrderPage