import { ParsedQs } from "qs";
import { ParamsDictionary } from "express-serve-static-core";
export interface createThuocTinhSp{
    id_sp?: number;
    id_tt: number;
    value: string;
}
// export interface DataThuocTinhSp{
//     id_sp: number;
//     id_tt: number;
//     value: string
// }
export interface createBienTheSp{
    ten_bien_the: string;
    code?: string|undefined;
    gia: number;
    so_luong: number;
}
export interface GetALLSanPHam extends ParsedQs{
    page: string;
    limit: string
}
export interface ThuocTinhMap{
    id_tt: number;
    gia_tri: string;
    ten_thuoc_tinh: {
        ten_thuoc_tinh: string
    }
}
export interface ImgBienThe {
    img: string| undefined
}
export interface ImgSP {
    url: string;
}
export interface ParamsSanPhamBySlug extends ParamsDictionary{
    slug: string;
}
export interface allowedUpdateSanPham{
    ten_sp?: string;
    code?: string;
    slug?: string;
    img?: string| null;
    sale?: number;
    gia?: number;
    so_luong?: number;
    xuat_xu?: string;
    dvctn?: string;
    dvt?: string;
    mo_ta?: string;
    an_hien?: number;
    id_dm?: number|null;
    id_th?: number|null;
}
export interface ParamTimKiemSanPham extends ParsedQs{
    page: string;
    limit: string;
    keyword: string|"";
}
export interface TimKiemGoiYSP extends ParsedQs{
    keyword: string|"";
}
export interface SanPhamItemFormatted{
    id_sp: number;
    id_bt: number| null;
    ten_sp: string;
    slug: string;
    ten_bien_the: string | null;
    img: string;
    gia_goc: number;
    gia_hien_tai: number;
    gia_tong: number;
    sale: number;
    so_luong: number;
    max_so_luong: number;
    is_active: boolean;
}

export interface ShopInfo{
    id: number;
    ten_shop: string;
    hinh: string | null;
}
export interface SanPhamItemWithShop extends SanPhamItemFormatted{
    shop_info: ShopInfo;
}
export interface GetSanPhamItem{

    id_sp: number;
    id_bt?: number;
    so_luong: number;
    da_chon: number;
    bien_the: {
        id: number;
        ten_bien_the: string;
        img?: string;
        gia: number;
        so_luong: number;
    };
    san_pham: {
        ten_sp: string;
        img: string;
        sale: number;
        gia: number;
        so_luong: number;
        slug: string;
        an_hien: number;
        shop: ShopInfo
    }
}