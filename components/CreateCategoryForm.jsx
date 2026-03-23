"use client"

import React, { useState } from 'react'
import axiosClient from '@/lib/axiosClient'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const CreateCategoryForm = () => {
  const router = useRouter()

  const [formData, setFormData] = useState({
    ten_dm: '',
    parent_id: '', // để trống nếu là danh mục gốc
    an_hien: "1",  // 1: hiện, 0: ẩn
    slug: '',      // Có thể để trống
  })

  const [hinhDm, setHinhDm] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleTextChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setHinhDm(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate chỉ bắt buộc tên danh mục
    if (!formData.ten_dm.trim()) {
      toast.error('Vui lòng điền Tên danh mục!')
      return
    }

    setLoading(true)

    try {
      const data = new FormData()

      // Gửi đúng tên field backend mong đợi
      data.append('ten_dm', formData.ten_dm.trim())
      data.append('parent_id', formData.parent_id.trim() || '') // gửi rỗng nếu không có cha
      data.append('an_hien', formData.an_hien) // "0" hoặc "1"
      data.append('slug', formData.slug.trim()) // gửi rỗng nếu để trống

      if (hinhDm) {
        data.append('hinh_dm', hinhDm) // tên field ảnh
      }

      // Debug dữ liệu gửi
      console.log('Dữ liệu gửi lên backend:')
      for (let [key, value] of data.entries()) {
        console.log(`${key}: ${typeof value === 'object' ? '[File]' : value}`)
      }

      const response = await axiosClient.post('/admin/danh-muc-sp', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 20000,
      })

      if (response.data.success) {
        toast.success('Tạo danh mục thành công!')
        router.push('/categories/list') // chuyển về danh sách
      } else {
        toast.error(response.data.thong_bao || 'Tạo danh mục thất bại')
      }
    } catch (error) {
      console.error('Lỗi tạo danh mục:', error)
      if (error.response?.data) {
        console.log('Backend trả về:', error.response.data)
        toast.error(error.response.data.thong_bao || 'Lỗi server')
      } else {
        toast.error('Không kết nối được backend')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#1f1f1f] p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-white">Tạo danh mục sản phẩm mới</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tên danh mục & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ten_dm"
              value={formData.ten_dm}
              onChange={handleTextChange}
              className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Slug (có thể để trống)
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleTextChange}
              className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Parent ID & Ẩn/Hiện */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Parent ID (danh mục cha - để trống nếu là gốc)
            </label>
            <input
              type="text"
              name="parent_id"
              value={formData.parent_id}
              onChange={handleTextChange}
              className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Để trống nếu là danh mục gốc"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Trạng thái hiển thị</label>
            <select
              name="an_hien"
              value={formData.an_hien}
              onChange={handleTextChange}
              className="w-full px-4 py-2.5 bg-[#2f2f2f] text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 appearance-none cursor-pointer transition-all duration-200 hover:border-gray-500"
            >
              <option value="1">Hiện</option>
              <option value="0">Ẩn</option>
            </select>
          </div>
        </div>

        {/* Upload ảnh */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Hình danh mục</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-600 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-900 file:text-indigo-200 hover:file:bg-indigo-800"
          />

          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="h-28 w-28 object-cover rounded-full border-2 border-gray-600"
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
          >
            Hủy
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Đang tạo...' : 'Tạo danh mục'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateCategoryForm