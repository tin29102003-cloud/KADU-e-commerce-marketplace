import { TypeProduct } from "./type";

export interface TypeProductCartItem extends TypeProduct {
  id_sp: number;
  cart_item_id: number;
  gia_goc: number;
  gia_hien_tai: number;
  gia_tong: number;
  tiet_kiem: number;
  id_bt: number | null;
}

export interface TypeCartItem {
  id_shop: number;
  ten_shop: string;
  hinh_shop: string;
  items: TypeProductCartItem[];
  success: boolean;
}
