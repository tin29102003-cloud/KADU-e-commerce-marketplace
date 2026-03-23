"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Edit as EditIcon, Trash2, X as XIcon, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react"
import axiosClient from '@/lib/axiosClient'
import { toast } from 'react-hot-toast'

const PTTTTable = () => {
  const [methods, setMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // Modal edit
  const [editingMethod, setEditingMethod] = useState(null)
  const [editForm, setEditForm] = useState({
    ten_pt: '',
    code: '',
    an_hien: "1", // Backend thường nhận string "1"/"0" hoặc boolean
  })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Base URL cho hình ảnh (điều chỉnh theo thực tế backend của bạn)
  const IMAGE_BASE_URL = "http://localhost:5000"

  const fetchMethods = async (page = 1) => {
    try {
      setLoading(true)
      const response = await axiosClient.get('/admin/pttt', {
        params: { page, limit: 10 }
      })

      if (response.data?.success && response.data?.result) {
        const { data, pagination } = response.data.result
        setMethods(data)
        setCurrentPage(pagination.currentPage)
        setTotalPages(pagination.totalPages)
        setTotalItems(pagination.totalItem)
      } else {
        setError('Không lấy được dữ liệu phương thức thanh toán')
      }
    } catch (err) {
      console.error('Lỗi fetch PTTT:', err)
      setError('Lỗi khi tải danh sách phương thức thanh toán')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMethods(currentPage)
  }, [currentPage])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const filteredMethods = methods.filter(m =>
    (m.ten_pt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.code || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (method) => {
    setEditingMethod(method)
    setEditForm({
      ten_pt: method.ten_pt || '',
      code: method.code || '',
      an_hien: method.an_hien ? "1" : "0",
    })
    setIsEditModalOpen(true)
    document.body.classList.add('modal-open')
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingMethod(null)
    document.body.classList.remove('modal-open')
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editingMethod) return

    try {
      const payload = {
        ten_pt: editForm.ten_pt.trim(),
        code: editForm.code.trim().toUpperCase(),
        an_hien: editForm.an_hien === "1",
      }

      const response = await axiosClient.put(`/admin/pttt/${editingMethod.id}`, payload)

      if (response.data.success) {
        toast.success('Cập nhật phương thức thành công!')
        setMethods(prev =>
          prev.map(m => (m.id === editingMethod.id ? { ...m, ...payload } : m))
        )
        closeEditModal()
      } else {
        toast.error(response.data.thong_bao || 'Cập nhật thất bại')
      }
    } catch (err) {
      toast.error(err.response?.data?.thong_bao || 'Lỗi khi cập nhật')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa phương thức này?")) return
    try {
      const response = await axiosClient.delete(`/admin/pttt/${id}`)
      if (response.data.success) {
        toast.success('Xóa thành công!')
        setMethods(prev => prev.filter(m => m.id !== id))
      }
    } catch (err) {
      toast.error('Lỗi khi xóa phương thức')
    }
  }

  if (loading) return <div className="text-center py-10 text-gray-400 italic">Đang tải phương thức thanh toán...</div>
  if (error) return <div className="text-center py-10 text-red-500 font-medium">{error}</div>

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1e1e1e] shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f]"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-100">Phương thức thanh toán</h2>
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
              <tr className="text-gray-400 text-xs uppercase tracking-wider">
                {["ID", "Hình ảnh", "Tên phương thức", "Code", "Trạng thái", "Hành động"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredMethods.map((m) => (
                <tr key={m.id} className="hover:bg-[#2a2a2a] transition-colors text-sm text-gray-300">
                  <td className="px-4 py-4 font-mono text-gray-500">#{m.id}</td>
                  <td className="px-4 py-4">
                    <div className="w-12 h-12 rounded bg-[#2f2f2f] flex items-center justify-center overflow-hidden border border-gray-700">
                      {m.img ? (
                        <img 
                          src={`${IMAGE_BASE_URL}${m.img}`} 
                          alt={m.ten_pt} 
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/50" }} 
                        />
                      ) : (
                        <ImageIcon size={20} className="text-gray-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-100 font-medium">{m.ten_pt}</td>
                  <td className="px-4 py-4">
                    <span className="bg-gray-800 px-2 py-1 rounded text-xs font-mono text-gray-400">
                        {m.code}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] ${m.an_hien ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                      {m.an_hien ? 'Hiển thị' : 'Đang ẩn'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-3">
                      <button onClick={() => handleEdit(m)} className="text-indigo-400 hover:text-indigo-300"><EditIcon size={18} /></button>
                      <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="flex justify-between items-center mt-6 text-gray-400 text-xs">
          <span>Tổng số: {totalItems} phương thức</span>
          <div className="flex items-center gap-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1 bg-[#2f2f2f] rounded disabled:opacity-30"><ChevronLeft size={16} /></button>
            <span className="font-medium">Trang {currentPage} / {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-1 bg-[#2f2f2f] rounded disabled:opacity-30"><ChevronRight size={16} /></button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4" onClick={closeEditModal}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#2f2f2f] rounded-xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <h3 className="text-lg font-bold text-white">Chỉnh sửa phương thức</h3>
                <button onClick={closeEditModal} className="text-gray-400 hover:text-white"><XIcon size={20} /></button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-5">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Tên phương thức</label>
                  <input type="text" name="ten_pt" value={editForm.ten_pt} onChange={handleFormChange} className="w-full px-4 py-2.5 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Nhập tên phương thức..." />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Mã định danh (Code)</label>
                  <input type="text" name="code" value={editForm.code} onChange={handleFormChange} className="w-full px-4 py-2.5 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono" placeholder="Ví dụ: MOMO, BANKING..." />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">Trạng thái hiển thị</label>
                  <select name="an_hien" value={editForm.an_hien} onChange={handleFormChange} className="w-full px-4 py-2.5 bg-gray-800 text-white border border-gray-600 rounded-lg outline-none cursor-pointer">
                    <option value="1">Hiển thị cho người dùng</option>
                    <option value="0">Tạm ẩn</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <button type="button" onClick={closeEditModal} className="px-5 py-2.5 text-gray-400 hover:text-white font-medium">Đóng</button>
                  <button type="submit" className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-bold shadow-lg">Lưu cập nhật</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PTTTTable