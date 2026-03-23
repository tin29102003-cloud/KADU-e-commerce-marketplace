"use client"

import React, { useState } from 'react'
import axiosClient from '@/lib/axiosClient'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const CreateVoucherForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Khởi tạo state
  const [formData, setFormData] = useState({
    ten_km: '',
    code: '',
    loai_km: "1",          // 1: Tiền cố định (đ), 2: Phần trăm (%)
    gia_tri_giam: '',
    gia_giam_toi_da: '0',
    gia_tri_don_min: '0',
    so_luong: '',
    gioi_han_user: '1',    
    ngay_bd: '',           
    ngay_kt: '',           
    trang_thai: "1",       
  })

  const handleTextChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Ép kiểu để kiểm tra logic
    const loai = Number(formData.loai_km) // 1: Tiền, 2: %
    const giaTri = Number(formData.gia_tri_giam)

    // KIỂM TRA: Nếu loại là 2 (%) thì giá trị phải < 100
    if (loai === 2 && giaTri >= 100) {
      toast.error('Loại giảm giá là %, giá trị giảm phải nhỏ hơn 100!')
      return
    }

    setLoading(true)

    try {
      const payload = {
        ten_km: formData.ten_km.trim(),
        code: formData.code.trim().toUpperCase(),
        // Chuyển sang Number để Backend không báo trống
        loai_km: loai, 
        gia_tri_giam: formData.gia_tri_giam.toString(),
        gia_giam_toi_da: formData.gia_giam_toi_da.toString() || "0",
        gia_tri_don_min: formData.gia_tri_don_min.toString() || "0",
        so_luong: formData.so_luong.toString(),
        gioi_han_user: formData.gioi_han_user.toString(),
        ngay_bd: formData.ngay_bd,
        ngay_kt: formData.ngay_kt,
        trang_thai: formData.trang_thai.toString()
      }

      console.log('Dữ liệu gửi đi (1:Tiền, 2:%):', payload)

      const response = await axiosClient.post('/admin/voucher', payload)

      if (response.data.success) {
        toast.success('Thêm voucher thành công!')
        router.push('/vouchers/list')
      } else {
        toast.error(response.data.thong_bao || 'Thêm thất bại')
      }
    } catch (error) {
      console.error('Lỗi API:', error.response?.data)
      const errorDetail = error.response?.data?.thong_bao || 'Lỗi dữ liệu (400)'
      toast.error(errorDetail)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#1f1f1f] p-6 rounded-lg shadow-lg max-w-4xl mx-auto text-white">
      <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-4 text-indigo-400">Tạo Voucher Khuyến Mãi</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tên và Mã Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tên khuyến mãi *</label>
            <input type="text" name="ten_km" value={formData.ten_km} onChange={handleTextChange} required 
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Mã Code *</label>
            <input type="text" name="code" value={formData.code} onChange={handleTextChange} required 
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded focus:border-indigo-500 outline-none" />
          </div>
        </div>

        {/* Loại KM và Giá trị giảm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Loại khuyến mãi</label>
            <select name="loai_km" value={formData.loai_km} onChange={handleTextChange} 
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded outline-none">
              <option value="1">1 - Tiền cố định (đ)</option>
              <option value="2">2 - Phần trăm (%)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Giá trị giảm *</label>
            <input type="number" name="gia_tri_giam" value={formData.gia_tri_giam} onChange={handleTextChange} required 
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded outline-none" 
              placeholder={formData.loai_km === "2" ? "Ví dụ: 10 (%)" : "Ví dụ: 50000 (đ)"} />
          </div>
        </div>

        {/* Giảm tối đa và Đơn tối thiểu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Giảm tối đa (đ)</label>
            <input type="number" name="gia_giam_toi_da" value={formData.gia_giam_toi_da} onChange={handleTextChange} 
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Giá trị đơn tối thiểu (đ)</label>
            <input type="number" name="gia_tri_don_min" value={formData.gia_tri_don_min} onChange={handleTextChange} 
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded outline-none" />
          </div>
        </div>

        {/* Số lượng và Giới hạn mỗi User */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tổng số lượng phát hành *</label>
            <input type="number" name="so_luong" value={formData.so_luong} onChange={handleTextChange} required 
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Số lần dùng tối đa / User *</label>
            <input type="number" name="gioi_han_user" value={formData.gioi_han_user} onChange={handleTextChange} required 
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded outline-none" />
          </div>
        </div>

        {/* Ngày tháng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Ngày bắt đầu *</label>
            <input type="date" name="ngay_bd" value={formData.ngay_bd} onChange={handleTextChange} required 
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Ngày kết thúc *</label>
            <input type="date" name="ngay_kt" value={formData.ngay_kt} onChange={handleTextChange} required 
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded outline-none" />
          </div>
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Trạng thái hoạt động</label>
          <select name="trang_thai" value={formData.trang_thai} onChange={handleTextChange} 
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded outline-none">
            <option value="1">Kích hoạt (Active)</option>
            <option value="0">Tạm dừng (Inactive)</option>
          </select>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
          <button type="button" onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors">Hủy bỏ</button>
          <button type="submit" disabled={loading} 
            className="px-8 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg">
            {loading ? 'Đang xử lý...' : 'Tạo Voucher'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateVoucherForm