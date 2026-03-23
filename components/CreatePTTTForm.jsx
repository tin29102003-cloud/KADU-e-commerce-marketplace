"use client"

import React, { useState } from 'react'
import axiosClient from '@/lib/axiosClient'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Upload, X, CreditCard } from 'lucide-react'

const CreatePTTTForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)

  const [formData, setFormData] = useState({
    ten_pt: '',
    code: '',
    an_hien: "1", // 1: Hiện, 0: Ẩn
  })
  const [hinhPttt, setHinhPttt] = useState(null)

  const handleTextChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setHinhPttt(file)
      // Tạo đường dẫn tạm thời để preview ảnh
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setHinhPttt(null)
    setPreviewImage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!hinhPttt) {
      toast.error('Vui lòng chọn hình ảnh phương thức!')
      return
    }

    setLoading(true)

    // Sử dụng FormData để gửi file
    const data = new FormData()
    data.append('ten_pt', formData.ten_pt.trim())
    data.append('code', formData.code.trim().toUpperCase())
    data.append('an_hien', formData.an_hien)
    data.append('hinh_pttt', hinhPttt) // Trường file

    try {
      const response = await axiosClient.post('/admin/pttt', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        toast.success('Thêm phương thức thanh toán thành công!')
        router.push('/payments/list') // Đường dẫn danh sách của bạn
      } else {
        toast.error(response.data.thong_bao || 'Thêm thất bại')
      }
    } catch (error) {
      console.error('Lỗi API:', error.response?.data)
      toast.error(error.response?.data?.thong_bao || 'Lỗi dữ liệu từ hệ thống')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#1f1f1f] p-6 rounded-lg shadow-lg max-w-2xl mx-auto text-white">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
        <CreditCard className="text-indigo-400" size={24} />
        <h2 className="text-xl font-bold text-indigo-400">Thêm Phương Thức Thanh Toán</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tên phương thức */}
        <div>
          <label className="block text-sm text-gray-400 mb-1 font-medium">Tên phương thức *</label>
          <input 
            type="text" 
            name="ten_pt" 
            value={formData.ten_pt} 
            onChange={handleTextChange} 
            required 
            placeholder="Ví dụ: Ví MoMo, Chuyển khoản ngân hàng..."
            className="w-full p-2.5 bg-gray-800 border border-gray-600 rounded-lg focus:border-indigo-500 outline-none transition-all" 
          />
        </div>

        {/* Mã Code */}
        <div>
          <label className="block text-sm text-gray-400 mb-1 font-medium">Mã định danh (Code) *</label>
          <input 
            type="text" 
            name="code" 
            value={formData.code} 
            onChange={handleTextChange} 
            required 
            placeholder="Ví dụ: MOMO, VNPAY, BANKING..."
            className="w-full p-2.5 bg-gray-800 border border-gray-600 rounded-lg focus:border-indigo-500 outline-none font-mono uppercase" 
          />
        </div>

        {/* Upload Hình ảnh */}
        <div>
          <label className="block text-sm text-gray-400 mb-2 font-medium">Hình ảnh phương thức *</label>
          <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-indigo-500 transition-colors bg-gray-800/50">
            {!previewImage ? (
              <label className="flex flex-col items-center justify-center cursor-pointer py-4">
                <Upload className="text-gray-400 mb-2" size={32} />
                <span className="text-sm text-gray-400">Nhấn để chọn ảnh hoặc kéo thả</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            ) : (
              <div className="relative w-32 h-32 mx-auto">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full h-full object-contain rounded-lg border border-gray-600" 
                />
                <button 
                  type="button" 
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block text-sm text-gray-400 mb-1 font-medium">Trạng thái hiển thị</label>
          <select 
            name="an_hien" 
            value={formData.an_hien} 
            onChange={handleTextChange} 
            className="w-full p-2.5 bg-gray-800 border border-gray-600 rounded-lg outline-none cursor-pointer"
          >
            <option value="1">Hiển thị trên ứng dụng</option>
            <option value="0">Tạm ẩn</option>
          </select>
        </div>

        {/* Nút thao tác */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-10 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg flex items-center gap-2"
          >
            {loading ? 'Đang lưu...' : 'Tạo Phương Thức'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePTTTForm