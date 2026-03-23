"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit, Search, Trash2, Save, X } from 'lucide-react'
import axiosClient from '@/lib/axiosClient'
import { toast } from 'react-hot-toast' // Đảm bảo import toast

const UsersTable = () => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    ho_ten: '',
    mat_khau: '',
    mat_khau_nhap_lai: '',
    vai_tro: "0",
    khoa: "0",
  })

  // Fetch danh sách users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get('/admin/user')
        if (response.data?.result?.data) {
          setClients(response.data.result.data)
        } else {
          setError('Không lấy được dữ liệu')
        }
      } catch (err) {
        console.error('Lỗi fetch users:', err)
        setError('Lỗi khi tải dữ liệu người dùng')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Lọc tìm kiếm
  const filteredClients = clients.filter(
    (client) =>
      (client.ho_ten || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Mở modal edit
  const handleEdit = (client) => {
    setSelectedUser(client)
    setFormData({
      ho_ten: client.ho_ten || '',
      mat_khau: '',
      mat_khau_nhap_lai: '',
      vai_tro: client.vai_tro.toString(),
      khoa: client.khoa.toString(),
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Cập nhật user (PUT) - không reload trang
  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!selectedUser) return

    if (formData.mat_khau.trim() && formData.mat_khau !== formData.mat_khau_nhap_lai) {
      toast.error('Mật khẩu nhập lại không khớp!')
      return
    }

    try {
      const payload = {
        ho_ten: formData.ho_ten.trim(),
        vai_tro: Number(formData.vai_tro),
        khoa: Number(formData.khoa),
      }

      // Chỉ gửi mật khẩu nếu người dùng nhập mới
      if (formData.mat_khau.trim()) {
        payload.mat_khau = formData.mat_khau.trim()
      }

      const response = await axiosClient.put(`/admin/user/${selectedUser.id}`, payload)

      if (response.data.success) {
        toast.success('Cập nhật thành công!')

        // Cập nhật state ngay lập tức (optimistic update)
        setClients(prev =>
          prev.map(user =>
            user.id === selectedUser.id
              ? { ...user, ho_ten: payload.ho_ten, vai_tro: payload.vai_tro, khoa: payload.khoa }
              : user
          )
        )

        closeModal()
      } else {
        toast.error(response.data.thong_bao || 'Cập nhật thất bại')
      }
    } catch (err) {
      console.error('Lỗi update:', err)
      toast.error(err.response?.data?.thong_bao || 'Lỗi khi cập nhật')
    }
  }

  // Xóa user (DELETE) - không reload trang
  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return

    try {
      const response = await axiosClient.delete(`/admin/user/${id}`)

      if (response.data.success) {
        toast.success('Xóa thành công!')
        // Xóa khỏi state ngay lập tức
        setClients(prev => prev.filter(user => user.id !== id))
      } else {
        toast.error(response.data.thong_bao || 'Xóa thất bại')
      }
    } catch (err) {
      console.error('Lỗi xóa:', err)
      toast.error(err.response?.data?.thong_bao || 'Lỗi khi xóa')
    }
  }

  const getRoleText = (vai_tro) => (vai_tro === 1 ? 'Quản trị viên' : 'Người dùng')
  const getLockedText = (khoa) => (khoa === 1 ? 'Đã khóa' : 'Chưa khóa')

  if (loading) return <div className="text-center py-10 text-gray-400">Đang tải...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className='bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-6 border border-[#1f1f1f] mx-2 sm:mx-0'
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className='text-lg sm:text-xl font-semibold text-gray-100'>Người dùng</h2>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#2f2f2f] text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className='min-w-full divide-y divide-gray-700'>
          <thead>
            <tr>
              {["Tên người dùng", "Email", "Vai trò", "Khóa", "Hành động"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-700'>
            {filteredClients.map((client, index) => (
              <motion.tr
                key={client.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="px-6 py-4 text-gray-100">{client.ho_ten || 'Chưa có tên'}</td>
                <td className="px-6 py-4 text-gray-300">{client.email || 'Chưa có email'}</td>
                <td className="px-6 py-4 text-gray-300">{getRoleText(client.vai_tro)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    client.khoa === 1 ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'
                  }`}>
                    {getLockedText(client.khoa)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(client)} className="text-indigo-400 hover:text-indigo-300">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(client.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-10 text-gray-400">Không tìm thấy người dùng</div>
      )}

      {/* Modal Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#2f2f2f] rounded-xl p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Chỉnh sửa người dùng</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-5">
                {/* Họ tên */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    name="ho_ten"
                    value={formData.ho_ten}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Mật khẩu mới */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Mật khẩu mới (để trống nếu không đổi)</label>
                  <input
                    type="password"
                    name="mat_khau"
                    value={formData.mat_khau}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Để trống nếu không thay đổi"
                  />
                </div>

                {/* Nhập lại mật khẩu */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nhập lại mật khẩu</label>
                  <input
                    type="password"
                    name="mat_khau_nhap_lai"
                    value={formData.mat_khau_nhap_lai}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Nhập lại để xác nhận"
                  />
                </div>

                {/* Vai trò & Khóa */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Vai trò</label>
                    <select
                      name="vai_tro"
                      value={formData.vai_tro}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="0">Người dùng</option>
                      <option value="1">Quản trị viên</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Trạng thái khóa</label>
                    <select
                      name="khoa"
                      value={formData.khoa}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="0">Chưa khóa</option>
                      <option value="1">Đã khóa</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default UsersTable