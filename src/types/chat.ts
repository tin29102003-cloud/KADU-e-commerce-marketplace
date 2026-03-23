import { ParsedQs } from "qs";
import { LOAI_HOI_THOAI, VAI_TRO_USER } from "../constants/chat";

export interface GetAllChatQuery extends ParsedQs{
    limit: string;
    cursor: string;
}
export interface GetAllConVerStation extends ParsedQs{
    cursor_time: string;
    cursor_id: string;
    limit: string;
}
export interface ListInbox1To1{
    id: number;
    loai_hoi_thoai: LOAI_HOI_THOAI.ONE | LOAI_HOI_THOAI.GROUP,
    tin_nhan_cuoi: string;
    thoi_gian_cap_nhat: string;
    thanh_vien: [{
        id_user: number;
        vai_tro: VAI_TRO_USER.SHOP |VAI_TRO_USER.ADMIN | VAI_TRO_USER.USER,
        nguoi_nhan: {
            id:number;
            ho_ten: string | null;
            hinh: string | null;
            tai_khoan: string;
            ten_shop: string | null
        }
    }] 
}
export interface TimKiemGoiYHoiThoai extends ParsedQs{
    keyword: string|"";
    limit : string;
}
export interface TimKiemGoiYTinNhan extends ParsedQs{
    keyword: string|"";
    limit : string;
    id_hoi_thoai: string;
}
export interface ChatMessage {
    id: number;
    noi_dung: string;
    createdAt: Date | string;
    nguoi_gui: {
        id: number;
        ten_shop: string;
        ho_ten: string;
        hinh: string | null;
        tai_khoan: string;
        vai_tro: VAI_TRO_USER.SHOP |VAI_TRO_USER.ADMIN | VAI_TRO_USER.USER,
    };
}