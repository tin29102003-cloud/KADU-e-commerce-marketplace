import type { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ReactNode, ButtonHTMLAttributes } from "react";
import type { AutoScrollType } from "embla-carousel-auto-scroll";

export interface TypeImageCarousel {
  id: number;
  urlImg: string;
  href: string;
  alt: string;
}

export type ErrorRes = {
  status: number;
  message: string;
};

export interface ProductDetail extends TypeProduct {
  shop: {
    ten_shop: string;
    id: 1;
    hinh: string;
  };
  so_luong_dg: number;
}

export type TypeReason = {
  status: number;
  message: string;
};

export type BtnPrimaryProps = {
  className?: string;
  content?: string;
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export interface TypeProduct {
  id: number;
  id_dm: number;
  id_th: number;
  id_user: number;
  an_hien: boolean;
  createdAt: string;
  da_ban: number;
  dvctn: string;
  dvt: string;
  gia: number;
  gia_da_giam: number;
  gia_giam: number;
  giam_gia: number;
  img: string;
  imgs: [{ url: string }];
  luot_xem: number;
  mo_ta: string;
  noi_bat: boolean;
  sale: number;
  thanh_tien: number;
  is_active: boolean;
  code: string;
  san_pham_bien_the: [
    {
      id: number;
      id_sp: number;
      code: string;
      ten_bien_the: string;
      gia: number;
      gia_da_giam: number;
      img: string;
      so_luong: number;
    }
  ];
  slug: string;
  so_luong: string;
  ten_sp: string;
  thuoctinhsp: [{ id: number; gia_tri: string }];
  thuong_hieu: { ten_th: string };
  updatedAt: string;
  xuat_xu: string;
  diem_tb_dg: number;
  so_luong_dg: number;
}

export interface PropsEmbla {
  onInit?: (emblaApi: ReturnType<typeof useEmblaCarousel>[1]) => void;
  options?: EmblaOptionsType;
  plugin?: AutoScrollType[];
  children: ReactNode;
  containerClassName?: string;
  viewportClassName?: string;
  navigation?: boolean;
  selectedIndex?: number;
}

export interface TypeCategory {
  id: number;
  ten_dm: string;
  img: string;
  stt: number;
  parent_id: number;
  an_hien: 0 | 1;
  slug: string;
}

export interface TypeCodeItem {
  id: number;
  ten_km: string;
  loai_km: string;
  gia_toi_thieu: number;
  kieu_giam_gia: string;
  gia_tri_giam: number;
  gia_giam_toi_da: number;
  so_luong_mua_min: number;
  so_luong_mua_max: number;
  code: string;
  is_code_required: string;
  ngay_bd: string;
  ngay_kt: string;
}

export interface ApiError {
  status: number;
  message: string;
}

export interface TypeItemCheckout {
  id_sp: number;
  id_bt: number | null;
  ten_sp: string;
  img: string;
  so_luong: number;
  gia_da_giam: number;
  gia_goc: number;
  sale: number;
  thanh_tien: number;
  hang_co_sang: number;
}

export interface CheckoutResponse {
  success: boolean;
  data: {
    shops: {
      shop_info: {
        id: number;
        ten_shop: string;
        hinh_shop: string | null;
      };
      items: TypeItemCheckout[];
      tam_tinh: number;
      phi_ship: number;
      giam_gia_khuyen_mai: number;
      final_total: number;
    }[];

    tom_tat_don_hang: {
      total_tien_hang: number;
      total_tien_ship: number;
      total_giam_gia_voucher: number;
      grandTotal: number;
    };

    voucher_info: {
      applied: boolean;
      code: string | null;
      error: string | null;
    };
  };
}

export interface TypeAddressItem {
  id?: number;
  ho_ten: string;
  dien_thoai: string;
  dia_chi: string;
  tinh: string;
  quan: string;
  phuong: string;
  mac_dinh: boolean;
}

export interface TypeMethodPayItem {
  id: number;
  ten_pt: string;
  code: string;
  img: string;
  an_hien: boolean;
}

//giỏ hàng item bỏ update_at
// thiếu giá cũ -> bảng sản phẩm
//thêm bảng img cho 1 sản phẩm có nhiều ảnh để lấy làm slider chi tiết sản phẩm

//bảng yêu thích nên chia nhiều bảng vd yêu thích sản phẩm, yêu thích tin tức ko
// thì khó join bảng ->nên chia 2 bảng

// nối dây bảng sản phẩm với sản phẩm thuộc tính sai
// xem lại dây nối bảng user với phản hồi tin tức
// sai dây nối ở giỏ hàng và user 1-1

export interface TypeOrderDetail {
  id: number;
  ma_dh: string;
  id_user: number;
  id_shop: number;
  id_km: number | null;
  id_pttt: number;
  gia: number;
  giam_gia: number;
  phi_vc: number;
  tam_tinh: number;
  tong_tien: number;
  trang_thai_dh: number;
  trang_thai_thanh_toan: boolean;
  ghi_chu: string;
  dia_chi_gh: string;
  dien_thoai: string;
  ten_nguoi_nhan: string;
  ly_do_huy: string | null;
  ngay_hoan_thanh: string | null;
  createdAt: string;
  updatedAt: string;

  chi_tiet_dh: {
    id: number;
    ten_sp: string;
  }[];

  pttt: {
    code: string;
    ten_pt: string;
  };

  shop: {
    id: number;
    ten_shop: string;
    hinh: string | null;
  };

  voucher: {
    code: string;
    gia_tri_giam: number;
    loai_km: number;
    ten_km: string;
  };
}
