"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Eye, Edit as EditIcon, X as XIcon, ChevronLeft, ChevronRight } from "lucide-react"
import axiosClient from '@/lib/axiosClient'
import { toast } from 'react-hot-toast'

const OrdersTable = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [editingOrder, setEditingOrder] = useState(null)
  const [editForm, setEditForm] = useState({
    trang_thai_moi: "0",
    ly_do: '',
  })
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Fetch đơn hàng theo trang
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true)
      const response = await axiosClient.get('/admin/don-hang', {
        params: { page }
      })

      if (response.data?.success && response.data?.result) {
        const { data, pagination } = response.data.result
        setOrders(data)
        setCurrentPage(pagination.currentPage)
        setTotalPages(pagination.totalPages)
        setTotalItems(pagination.totalItem)
      } else {
        setError('Không lấy được dữ liệu đơn hàng')
      }
    } catch (err) {
      console.error('Lỗi fetch orders:', err)
      setError('Lỗi khi tải dữ liệu đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(currentPage)
  }, [currentPage])

  // Chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  // Lọc client-side
  const filteredOrders = orders.filter(order =>
    order.ma_dh.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.ten_nguoi_nhan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.ghi_chu || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Mapping trạng thái
  const getStatusText = (status) => {
    const map = {
      0: { text: "Chờ xác nhận", color: "bg-yellow-900/50 text-yellow-300" },
      1: { text: "Shop chuẩn bị hàng", color: "bg-blue-900/50 text-blue-300" },
      2: { text: "Đang giao", color: "bg-purple-900/50 text-purple-300" },
      3: { text: "Giao hàng thành công", color: "bg-green-900/50 text-green-300" },
      4: { text: "Đã hủy", color: "bg-red-900/50 text-red-300" },
    }
    return map[status] || { text: "Không xác định", color: "bg-gray-900/50 text-gray-300" }
  }

  const formatMoney = (amount) => amount.toLocaleString('vi-VN') + " đ"

  // Mở modal xem chi tiết
  const handleViewDetail = (order) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
    document.body.classList.add('modal-open') // Ngăn scroll nền
  }

  // Mở modal sửa trạng thái
  const handleEditStatus = (order) => {
    setEditingOrder(order)
    setEditForm({
      trang_thai_moi: order.trang_thai_dh.toString(),
      ly_do: order.ly_do_huy || '',
    })
    setIsEditModalOpen(true)
    document.body.classList.add('modal-open')
  }

  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    document.body.classList.remove('modal-open')
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    document.body.classList.remove('modal-open')
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  // PUT cập nhật trạng thái
  const handleSaveStatus = async (e) => {
    e.preventDefault()
    if (!editingOrder) return

    const newStatus = Number(editForm.trang_thai_moi)

    if (newStatus === 4 && !editForm.ly_do.trim()) {
      toast.error('Vui lòng nhập lý do hủy!')
      return
    }

    try {
      const payload = {
        trang_thai_moi: editForm.trang_thai_moi,
        ly_do: newStatus === 4 ? editForm.ly_do.trim() : ""
      }

      const response = await axiosClient.put(
        `/admin/don-hang/trang-thai/${editingOrder.id}`,
        payload
      )

      if (response.data.success) {
        toast.success('Cập nhật trạng thái thành công!')

        setOrders(prev =>
          prev.map(order =>
            order.id === editingOrder.id
              ? { 
                  ...order, 
                  trang_thai_dh: newStatus, 
                  ly_do_huy: payload.ly_do 
                }
              : order
          )
        )

        closeEditModal()
      } else {
        toast.error(response.data.thong_bao || 'Cập nhật thất bại')
      }
    } catch (err) {
      console.error('Lỗi PUT:', err.response?.data || err)
      toast.error(err.response?.data?.thong_bao || 'Lỗi cập nhật trạng thái')
    }
  }

  if (loading) return <div className="text-center py-10 text-gray-400">Đang tải đơn hàng...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <>
      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-[#1f1f1f] mx-2 md:mx-0"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-100">Danh sách đơn hàng</h2>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, người nhận, ghi chú"
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
                {["Mã đơn hàng", "Người nhận", "Tổng tiền", "Trạng thái", "Ghi chú", "Hành động"].map(header => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusText(order.trang_thai_dh)
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-[#2a2a2a] transition-colors"
                  >
                    <td className="px-4 py-4 text-sm text-gray-100">{order.ma_dh}</td>
                    <td className="px-4 py-4 text-sm text-gray-300">{order.ten_nguoi_nhan || 'Chưa có'}</td>
                    <td className="px-4 py-4 text-sm text-gray-100 font-medium">{formatMoney(order.tong_tien)}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-400">
                      {order.ghi_chu ? order.ghi_chu.substring(0, 50) + (order.ghi_chu.length > 50 ? '...' : '') : '—'}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleViewDetail(order)}
                          className="text-indigo-400 hover:text-indigo-300"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditStatus(order)}
                          className="text-green-400 hover:text-green-300"
                          title="Sửa trạng thái"
                        >
                          <EditIcon size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 text-gray-400 text-sm">
          <div>
            Hiển thị {filteredOrders.length} trong tổng {totalItems} đơn hàng
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded bg-[#2f2f2f] hover:bg-[#3f3f3f] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
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

      {/* Modal Xem chi tiết */}
      <AnimatePresence>
        {isDetailModalOpen && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4"
            onClick={closeDetailModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="bg-[#2f2f2f] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-[#2f2f2f] z-10">
                <h3 className="text-xl font-bold text-white">
                  Chi tiết đơn hàng {selectedOrder.ma_dh}
                </h3>
                <button onClick={closeDetailModal} className="text-gray-400 hover:text-white">
                  <XIcon size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-300">
                <div>
                  <p><strong>Người nhận:</strong> {selectedOrder.ten_nguoi_nhan}</p>
                  <p><strong>SĐT:</strong> {selectedOrder.dien_thoai}</p>
                  <p><strong>Địa chỉ:</strong> {selectedOrder.dia_chi_gh}</p>
                </div>
                <div>
                  <p><strong>Tổng tiền:</strong> {formatMoney(selectedOrder.tong_tien)}</p>
                  <p><strong>Trạng thái:</strong> {getStatusText(selectedOrder.trang_thai_dh).text}</p>
                  <p><strong>Ghi chú:</strong> {selectedOrder.ghi_chu || 'Không có'}</p>
                </div>
              </div>

              <h4 className="text-lg font-semibold text-white mb-4">Sản phẩm trong đơn hàng</h4>
              <div className="space-y-4">
                {selectedOrder.chi_tiet_dh.map((item, idx) => (
                  <div key={idx} className="bg-[#1e1e1e] p-4 rounded-lg flex items-center gap-4">
                    {item.img && (
                      <img
                        src={item.img}
                        alt={item.ten_sp}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.ten_sp}</p>
                      <p className="text-sm text-gray-400">Số lượng: {item.so_luong}</p>
                      <p className="text-sm text-gray-300">Giá: {formatMoney(item.gia)}</p>
                    </div>
                    <div className="text-right text-green-400 font-medium">
                      {formatMoney(item.thanh_tien)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Sửa trạng thái */}
      <AnimatePresence>
        {isEditModalOpen && editingOrder && (
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
              className="bg-[#2f2f2f] rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  Sửa trạng thái đơn hàng {editingOrder.ma_dh}
                </h3>
                <button onClick={closeEditModal} className="text-gray-400 hover:text-white">
                  <XIcon size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveStatus} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Trạng thái đơn hàng</label>
                  <select
                    name="trang_thai_moi"
                    value={editForm.trang_thai_moi}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="0">Chờ xác nhận</option>
                    <option value="1">Shop chuẩn bị hàng</option>
                    <option value="2">Đang giao</option>
                    <option value="3">Giao hàng thành công</option>
                    <option value="4">Đã hủy</option>
                  </select>
                </div>

                {editForm.trang_thai_moi === "4" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Lý do hủy (bắt buộc)</label>
                    <textarea
                      name="ly_do"
                      value={editForm.ly_do}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                      placeholder="Nhập lý do hủy đơn hàng..."
                      required
                    />
                  </div>
                )}

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeEditModal}
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
    </>
  )
}

export default OrdersTable