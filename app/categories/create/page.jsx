"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StatCard from '@/components/StatCard'
import { ChartBarStacked, DollarSign, ShoppingBag, SquareActivity } from 'lucide-react'
import CategoriesTable from '@/components/CategoriesTable'
import axiosClient from '@/lib/axiosClient'
import CreateCategoryForm from '@/components/CreateCategoryForm'

const ProductsPage = () => {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalParent: 0,
    totalChild: 0,
    hotCategories: 5, // Giả sử cố định 5, hoặc thay bằng logic từ backend
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        // Lấy toàn bộ danh mục để tính toán (nếu API có param all hoặc page=1&limit=1000)
        // Nếu backend có endpoint thống kê riêng, thay bằng endpoint đó
        const response = await axiosClient.get('/admin/danh-muc-sp', {
          params: { page: 1, limit: 1000 } // Lấy đủ dữ liệu để tính toán
        })

        if (response.data?.success && response.data?.result?.data) {
          const allCategories = response.data.result.data

          const total = response.data.result.paination?.totalItem || allCategories.length
          const parents = allCategories.filter(cat => cat.parent_id === null).length
          const children = total - parents

          setStats({
            totalCategories: total,
            totalParent: parents,
            totalChild: children,
            hotCategories: 5, // Cố định 5 như yêu cầu (hoặc lấy từ backend nếu có)
          })
        } else {
          setError('Không lấy được thống kê danh mục')
        }
      } catch (err) {
        console.error('Lỗi fetch thống kê danh mục:', err)
        setError('Lỗi khi tải thống kê danh mục')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Đang tải thống kê danh mục...
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
    <div className='flex-1 overflow-auto relative z-10'>
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard 
            name="Tổng số danh mục" 
            icon={ShoppingBag} 
            value={stats.totalCategories.toLocaleString('vi-VN')} 
          />
          <StatCard 
            name="Tổng danh mục cha" 
            icon={ChartBarStacked} 
            value={stats.totalParent.toLocaleString('vi-VN')} 
          />
          <StatCard 
            name="Tổng danh mục con" 
            icon={SquareActivity} 
            value={stats.totalChild.toLocaleString('vi-VN')} 
          />
          <StatCard 
            name="Số danh mục hot" 
            icon={DollarSign} 
            value={stats.hotCategories.toLocaleString('vi-VN')} 
          />
        </motion.div>

        <CreateCategoryForm/>
      </main>
    </div>
  )
}

export default ProductsPage