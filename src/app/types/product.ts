export interface TypePostProduct {
  id_sp: string | number;
  id_bt: number | null;
  so_luong: number;
  ten_sp: string;
  gia: number;
  gia_da_giam: number;
  da_chon?: number;
}

export interface TypeProductVariant {
  id: number;
  id_sp: number;
  code: string;
  ten_bien_the: string;
  gia: number;
  gia_da_giam: number;
  img: string;
  so_luong: number;
}

export interface TypePagination {
  currentPage: number;
  limit: number;
  totalItem: number;
  totalPages: number;
}

export interface TypeTrademark {
  id: number;
  ten_th: string;
}
