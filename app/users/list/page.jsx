"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import StatCard from '@/components/StatCard'
import { RotateCcw, UserCheck, UserPlus, UsersIcon } from 'lucide-react'
import axiosClient from '@/lib/axiosClient' // ← điều chỉnh đường dẫn nếu cần
import UsersTable from '@/components/UsersTable'

const UsersPage = () => {
  const [totalUsers, setTotalUsers] = useState("0")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosClient.get('/admin/thong-ke/tong-quan')
        
        if (response.data.success && response.data.data) {
          setTotalUsers(response.data.data.tong_user.toLocaleString())
        }
      } catch (error) {
        console.error("Lỗi khi lấy thống kê tổng quan:", error)
        // Có thể set giá trị mặc định hoặc thông báo lỗi nếu muốn
        setTotalUsers("—")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
        >
          <StatCard 
            name="Tổng số người dùng" 
            icon={UsersIcon} 
            value={loading ? "..." : totalUsers}
          />
          <StatCard 
            name="Số người dùng mới" 
            icon={UserPlus} 
            value="-"
          />
          <StatCard 
            name="Người dùng đang hoạt động" 
            icon={UserCheck} 
            value="-"
          />
          <StatCard 
            name="Người dùng trở lại" 
            icon={RotateCcw} 
            value="-"
          />
        </motion.div>
        
        <UsersTable/>
      </main>
    </div>
  )
}

export default UsersPage