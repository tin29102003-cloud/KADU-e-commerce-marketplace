export interface TypeUserInfo {
  id: number;
  ho_ten: string;
  hinh: string;
  dien_thoai: number;
  createdAt: string;
  email: string;
}

export interface TypeUserInfoLocal {
  ho_ten: string;
  tai_khoan: string;
  vai_tro: string | number;
  email: string;
  hinh: string;
}
