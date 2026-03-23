"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Edit as EditIcon, Trash2, X as XIcon, ChevronLeft, ChevronRight } from "lucide-react"
import axiosClient from '@/lib/axiosClient'
import { toast } from 'react-hot-toast'

const VouchersTable = () => {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // Modal edit
  const [editingVoucher, setEditingVoucher] = useState(null)
  const [editForm, setEditForm] = useState({
    ten_km: '',
    so_luong: '',
    ngay_kt: '',
    gioi_han_user: '',
    trang_thai: "1", // Mặc định là string "1"
  })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Fetch voucher theo trang
  const fetchVouchers = async (page = 1) => {
    try {
      setLoading(true)
      const response = await axiosClient.get('/admin/voucher', {
        params: { page, limit: 5 }
      })

      if (response.data?.success && response.data?.result) {
        const { data, pagination } = response.data.result
        setVouchers(data)
        setCurrentPage(pagination.currentPage)
        setTotalPages(pagination.totalPages)
        setTotalItems(pagination.totalItem)
      } else {
        setError('Không lấy được dữ liệu voucher')
      }
    } catch (err) {
      console.error('Lỗi fetch vouchers:', err)
      setError('Lỗi khi tải danh sách voucher')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVouchers(currentPage)
  }, [currentPage])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const filteredVouchers = vouchers.filter(v =>
    (v.ten_km || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.code || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Mở modal chỉnh sửa
  const handleEdit = (voucher) => {
    setEditingVoucher(voucher)
    setEditForm({
      ten_km: voucher.ten_km || '',
      so_luong: voucher.so_luong?.toString() || '',
      ngay_kt: voucher.ngay_kt ? new Date(voucher.ngay_kt).toISOString().split('T')[0] : '',
      gioi_han_user: voucher.gioi_han_user?.toString() || '',
      trang_thai: voucher.trang_thai ? "1" : "0", // Convert boolean/number về string "1"/"0"
    })
    setIsEditModalOpen(true)
    document.body.classList.add('modal-open')
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingVoucher(null)
    document.body.classList.remove('modal-open')
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  // PUT cập nhật voucher
  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editingVoucher) return

    try {
      // CHUẨN HÓA DỮ LIỆU SANG STRING THEO YÊU CẦU BACKEND
      const payload = {
        ten_km: editForm.ten_km.trim(),
        so_luong: editForm.so_luong.toString(),
        ngay_kt: editForm.ngay_kt || null,
        gioi_han_user: editForm.gioi_han_user.toString(),
        trang_thai: editForm.trang_thai.toString(), // Gửi "1" hoặc "0"
      }

      const response = await axiosClient.put(
        `/admin/voucher/${editingVoucher.id}`,
        payload
      )

      if (response.data.success) {
        toast.success('Cập nhật voucher thành công!')

        // Cập nhật state hiển thị (convert ngược lại kiểu dữ liệu nếu Table cần render logic)
        setVouchers(prev =>
          prev.map(v =>
            v.id === editingVoucher.id
              ? { 
                  ...v, 
                  ...payload, 
                  so_luong: Number(payload.so_luong),
                  trang_thai: payload.trang_thai === "1" 
                }
              : v
          )
        )

        closeEditModal()
      } else {
        toast.error(response.data.thong_bao || 'Cập nhật thất bại')
      }
    } catch (err) {
      console.error('Lỗi update voucher:', err)
      toast.error(err.response?.data?.thong_bao || 'Lỗi khi cập nhật voucher')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa voucher này?")) return
    try {
      const response = await axiosClient.delete(`/admin/voucher/${id}`)
      if (response.data.success) {
        toast.success('Xóa voucher thành công!')
        setVouchers(prev => prev.filter(v => v.id !== id))
      }
    } catch (err) {
      toast.error('Lỗi khi xóa voucher')
    }
  }

  if (loading) return <div className="text-center py-10 text-gray-400">Đang tải danh sách voucher...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1e1e1e] shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f]"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-100">Danh sách voucher</h2>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#2f2f2f] text-white rounded-lg pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-gray-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="text-gray-400 text-xs uppercase">
                {["ID", "Tên KM", "Code", "Giá trị", "Số lượng", "Ngày kết thúc", "Trạng thái", "Hành động"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredVouchers.map((v) => (
                <tr key={v.id} className="hover:bg-[#2a2a2a] transition-colors text-sm text-gray-300">
                  <td className="px-4 py-4">{v.id}</td>
                  <td className="px-4 py-4 text-gray-100 font-medium">{v.ten_km}</td>
                  <td className="px-4 py-4">{v.code}</td>
                  <td className="px-4 py-4">{(v.gia_tri_giam || 0).toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-4">{v.so_luong}</td>
                  <td className="px-4 py-4">{v.ngay_kt ? new Date(v.ngay_kt).toLocaleDateString('vi-VN') : '---'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] ${v.trang_thai ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                      {v.trang_thai ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-3">
                      <button onClick={() => handleEdit(v)} className="text-indigo-400 hover:text-indigo-300"><EditIcon size={18} /></button>
                      <button onClick={() => handleDelete(v.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="flex justify-between items-center mt-6 text-gray-400 text-xs">
          <span>Hiển thị {filteredVouchers.length} / {totalItems}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1 bg-[#2f2f2f] rounded disabled:opacity-30"><ChevronLeft size={16} /></button>
            <span>Trang {currentPage}/{totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-1 bg-[#2f2f2f] rounded disabled:opacity-30"><ChevronRight size={16} /></button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4" onClick={closeEditModal}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#2f2f2f] rounded-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Chỉnh sửa voucher</h3>
                <button onClick={closeEditModal} className="text-gray-400"><XIcon size={20} /></button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Tên khuyến mãi</label>
                  <input type="text" name="ten_km" value={editForm.ten_km} onChange={handleFormChange} className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Số lượng</label>
                    <input type="number" name="so_luong" value={editForm.so_luong} onChange={handleFormChange} className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Giới hạn/User</label>
                    <input type="number" name="gioi_han_user" value={editForm.gioi_han_user} onChange={handleFormChange} className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Ngày kết thúc</label>
                  <input type="date" name="ngay_kt" value={editForm.ngay_kt} onChange={handleFormChange} className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Trạng thái</label>
                  <select name="trang_thai" value={editForm.trang_thai} onChange={handleFormChange} className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md outline-none">
                    <option value="1">Hoạt động (Active)</option>
                    <option value="0">Ngừng (Inactive)</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={closeEditModal} className="px-4 py-2 text-gray-400 hover:text-white">Hủy</button>
                  <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Lưu thay đổi</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default VouchersTable