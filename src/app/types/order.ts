import { TypeProduct } from "./type";
export interface TypeOrderItem {
  id: number;
  ma_dh: string;
  id_user: number;
  id_km: number;
  id_shop: number;
  id_pttt: number;
  ten_nguoi_nhan: string;
  dien_thoai: string;
  dia_chi_gh: string;
  tam_tinh: number;
  phi_vc: number;
  giam_gia: number;
  tong_tien: number;
  trang_thai_dh: number;
  trang_thai_thanh_toan: boolean;
  ghi_chu: string;
  ngay_hoan_thanh: string | null;
  ly_do_huy: string | null;
  createdAt: string;
  updatedAt: string;
  chi_tiet_dh: TypeProduct[];
  nguoi_mua: {
    ho_ten: string;
    id: number;
    hinh: string | null;
  };
  pttt: {
    ten_pt: string;
    code: string;
  };
}
