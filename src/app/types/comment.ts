export interface TypeComment {
  id: number;
  id_sp: number;
  id_user: number;
  img_dg: [{ url: string }];
  ngay_dg: string;
  ngay_ph: string | null;
  nguoi_danh_gia: { ho_ten: string; hinh: string | null };
  noi_dung: string;
  phan_hoi: string | null;
  so_sao: number;
  tinh_nang: string;
  updatedAt: string;
  chat_luong: string;
  createdAt: string;
}
