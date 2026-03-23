"use client"

import React, { useState } from 'react'
import axiosClient from '@/lib/axiosClient'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const CreateUserForm = () => {
  const router = useRouter()

  const [formData, setFormData] = useState({
    tai_khoan: '',
    email: '',
    mat_khau: '',
    mat_khau_nhap_lai: '',
    ho_ten: '',
    vai_tro: "0",  // "0": người dùng, "1": quản trị viên
    dien_thoai: '',
    khoa: "0",     // "0": mặc định không khóa, "1": khóa
  })

  const [hinhUser, setHinhUser] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleTextChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setHinhUser(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  // Validate client-side (giữ nguyên + thêm mat_khau_nhap_lai)
  if (formData.mat_khau !== formData.mat_khau_nhap_lai) {
    toast.error('Mật khẩu nhập lại không khớp!')
    return
  }

  if (!formData.tai_khoan.trim() || !formData.email.trim() || 
      !formData.mat_khau.trim() || !formData.mat_khau_nhap_lai.trim() || 
      !formData.ho_ten.trim()) {
    toast.error('Vui lòng điền đầy đủ các trường bắt buộc!')
    return
  }

  setLoading(true)

  try {
    const data = new FormData()

    // Gửi ĐÚNG tên field backend yêu cầu
    data.append('tai_khoan', formData.tai_khoan.trim())
    data.append('email', formData.email.trim())
    data.append('mat_khau', formData.mat_khau.trim())
    data.append('mat_khau_nhap_lai', formData.mat_khau_nhap_lai.trim())  // ← BẮT BUỘC gửi trường này!
    data.append('ho_ten', formData.ho_ten.trim())
    data.append('vai_tro', formData.vai_tro)  // "0" hoặc "1"
    data.append('dien_thoai', formData.dien_thoai.trim() || '')
    data.append('khoa', formData.khoa)        // "0" hoặc "1"

    if (hinhUser) {
      data.append('hinh_user', hinhUser)      // tên field ảnh PHẢI là 'hinh_user'
    }

    // Debug
    console.log('Dữ liệu gửi lên backend (đã khớp backend):')
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${typeof value === 'object' ? '[File]' : value}`)
    }

    const response = await axiosClient.post('/admin/user', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 20000,
    })

    if (response.data.success) {
      toast.success('Tạo người dùng thành công!')
      router.push('/users/list')
    } else {
      toast.error(response.data.thong_bao || 'Tạo người dùng thất bại')
    }
  } catch (error) {
    console.error('Lỗi tạo user:', error)
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
      <h2 className="text-xl font-bold mb-6 text-white">Tạo người dùng mới</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tài khoản & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tên tài khoản <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="tai_khoan"
              value={formData.tai_khoan}
              onChange={handleTextChange}
              className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleTextChange}
              className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        {/* Mật khẩu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="mat_khau"
              value={formData.mat_khau}
              onChange={handleTextChange}
              className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nhập lại mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="mat_khau_nhap_lai"
              value={formData.mat_khau_nhap_lai}
              onChange={handleTextChange}
              className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        {/* Họ tên & Vai trò */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ho_ten"
              value={formData.ho_ten}
              onChange={handleTextChange}
              className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Vai trò</label>
            <select
              name="vai_tro"
              value={formData.vai_tro}
              onChange={handleTextChange}
              className="w-full px-4 py-2.5 bg-[#2f2f2f] text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 appearance-none cursor-pointer transition-all duration-200 hover:border-gray-500"
            >
              <option value="0">Người dùng</option>
              <option value="1">Quản trị viên</option>
            </select>
          </div>
        </div>

        {/* Điện thoại & Khóa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Điện thoại</label>
            <input
              type="text"
              name="dien_thoai"
              value={formData.dien_thoai}
              onChange={handleTextChange}
              className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center mt-8">
            <input
              type="checkbox"
              id="khoa"
              checked={formData.khoa === "1"}
              onChange={(e) => setFormData((prev) => ({ ...prev, khoa: e.target.checked ? "1" : "0" }))}
              className="h-4 w-4 text-indigo-600 border-gray-600 rounded bg-gray-800"
            />
            <label htmlFor="khoa" className="ml-2 block text-sm text-gray-300">
              Khóa tài khoản ngay (mặc định không khóa)
            </label>
          </div>
        </div>

        {/* Upload ảnh */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Ảnh đại diện</label>
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
            {loading ? 'Đang tạo...' : 'Tạo người dùng'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateUserForm