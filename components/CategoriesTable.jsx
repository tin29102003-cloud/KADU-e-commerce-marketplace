"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Edit as EditIcon, Trash2, X as XIcon, ChevronLeft, ChevronRight } from "lucide-react"
import axiosClient from '@/lib/axiosClient'
import { toast } from 'react-hot-toast'

const CategoriesTable = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // Modal edit
  const [editingCategory, setEditingCategory] = useState(null)
  const [editForm, setEditForm] = useState({
    ten_dm: '',
    parent_id: '',
    an_hien: "1", // 1: hiện, 0: ẩn
    slug: '',
    hinh_dm: null,
  })
  const [previewImage, setPreviewImage] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Fetch danh mục theo trang (mỗi trang 5 dòng)
  const fetchCategories = async (page = 1) => {
    try {
      setLoading(true)
      const response = await axiosClient.get('/admin/danh-muc-sp', {
        params: { page, limit: 5 } // Giới hạn 5 dòng/trang
      })

      if (response.data?.success && response.data?.result) {
        const { data, paination } = response.data.result // backend trả "paination"
        setCategories(data)
        setCurrentPage(paination.currentPage)
        setTotalPages(paination.totalPages)
        setTotalItems(paination.totalItem)
      } else {
        setError('Không lấy được dữ liệu danh mục')
      }
    } catch (err) {
      console.error('Lỗi fetch categories:', err)
      setError('Lỗi khi tải danh mục sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories(currentPage)
  }, [currentPage])

  // Chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  // Lọc client-side
  const filteredCategories = categories.filter(cat =>
    cat.ten_dm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.slug || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Mở modal chỉnh sửa (ngăn scroll nền)
  const handleEdit = (category) => {
    setEditingCategory(category)
    setEditForm({
      ten_dm: category.ten_dm || '',
      parent_id: category.parent_id || '',
      an_hien: category.an_hien ? "1" : "0",
      slug: category.slug || '',
      hinh_dm: null,
    })
    setPreviewImage(category.img || null)
    setIsEditModalOpen(true)
    document.body.classList.add('modal-open') // Ngăn scroll nền
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingCategory(null)
    setPreviewImage(null)
    document.body.classList.remove('modal-open')
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditForm(prev => ({ ...prev, hinh_dm: file }))
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  // PUT cập nhật danh mục
  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editingCategory) return

    try {
      const formData = new FormData()
      formData.append('ten_dm', editForm.ten_dm.trim())
      formData.append('parent_id', editForm.parent_id || '')
      formData.append('an_hien', editForm.an_hien)
      formData.append('slug', editForm.slug.trim())
      if (editForm.hinh_dm) formData.append('hinh_dm', editForm.hinh_dm)

      const response = await axiosClient.put(
        `/admin/danh-muc-sp/${editingCategory.id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      if (response.data.success) {
        toast.success('Cập nhật danh mục thành công!')
        setCategories(prev =>
          prev.map(cat =>
            cat.id === editingCategory.id
              ? {
                  ...cat,
                  ten_dm: editForm.ten_dm.trim(),
                  parent_id: editForm.parent_id || null,
                  an_hien: editForm.an_hien === "1",
                  slug: editForm.slug.trim(),
                  img: response.data?.updated?.img || cat.img
                }
              : cat
          )
        )
        closeEditModal()
      } else {
        toast.error(response.data.thong_bao || 'Cập nhật thất bại')
      }
    } catch (err) {
      console.error('Lỗi update danh mục:', err)
      toast.error(err.response?.data?.thong_bao || 'Lỗi khi cập nhật danh mục')
    }
  }

  // Xóa danh mục
  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return
    try {
      const response = await axiosClient.delete(`/admin/danh-muc-sp/${id}`)
      if (response.data.success) {
        toast.success('Xóa danh mục thành công!')
        setCategories(prev => prev.filter(cat => cat.id !== id))
      } else {
        toast.error(response.data.thong_bao || 'Xóa thất bại')
      }
    } catch (err) {
      console.error('Lỗi xóa danh mục:', err)
      toast.error(err.response?.data?.thong_bao || 'Lỗi khi xóa danh mục')
    }
  }

  if (loading) return <div className="text-center py-10 text-gray-400">Đang tải danh mục sản phẩm...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-100">Danh mục sản phẩm</h2>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc slug"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#2f2f2f] text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                {["ID", "Tên danh mục", "Parent ID", "Ẩn/Hiện", "Slug", "Hình danh mục", "Hành động"].map(header => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredCategories.map((cat) => (
                <motion.tr
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-[#2a2a2a] transition-colors"
                >
                  <td className="px-4 py-4 text-sm text-gray-100">{cat.id}</td>
                  <td className="px-4 py-4 text-sm text-gray-300">{cat.ten_dm}</td>
                  <td className="px-4 py-4 text-sm text-gray-300">{cat.parent_id || '—'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${cat.an_hien ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                      {cat.an_hien ? 'Hiện' : 'Ẩn'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-300">{cat.slug}</td>
                  <td className="px-4 py-4">
                    {cat.img ? <img src={cat.img} alt={cat.ten_dm} className="w-12 h-12 object-cover rounded" /> : '—'}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center gap-4">
                      <button onClick={() => handleEdit(cat)} className="text-indigo-400 hover:text-indigo-300" title="Chỉnh sửa">
                        <EditIcon size={18} />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-300" title="Xóa">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 text-gray-400 text-sm">
          <div>Hiển thị {filteredCategories.length} trong tổng {totalItems} danh mục</div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded bg-[#2f2f2f] hover:bg-[#3f3f3f] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <span>Trang {currentPage} / {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded bg-[#2f2f2f] hover:bg-[#3f3f3f] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal Chỉnh sửa danh mục - nằm giữa màn hình */}
      <AnimatePresence>
        {isEditModalOpen && editingCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4"
            onClick={closeEditModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="bg-[#2f2f2f] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-[#2f2f2f] z-10">
                <h3 className="text-xl font-bold text-white">
                  Chỉnh sửa danh mục {editingCategory.ten_dm}
                </h3>
                <button onClick={closeEditModal} className="text-gray-400 hover:text-white">
                  <XIcon size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tên danh mục</label>
                  <input type="text" name="ten_dm" value={editForm.ten_dm} onChange={handleFormChange} className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Parent ID (danh mục cha)</label>
                  <input type="text" name="parent_id" value={editForm.parent_id} onChange={handleFormChange} className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Để trống nếu là danh mục gốc" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Trạng thái hiển thị</label>
                  <select name="an_hien" value={editForm.an_hien} onChange={handleFormChange} className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="1">Hiện</option>
                    <option value="0">Ẩn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
                  <input type="text" name="slug" value={editForm.slug} onChange={handleFormChange} className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Hình danh mục</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md" />
                  {previewImage && <div className="mt-4"><img src={previewImage} alt="Preview" className="w-32 h-32 object-cover rounded" /></div>}
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button type="button" onClick={closeEditModal} className="px-5 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700">Hủy</button>
                  <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Cập nhật</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CategoriesTable