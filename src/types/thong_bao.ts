import { ParsedQs } from "qs";
import { ParamsDictionary } from "express-serve-static-core";
export interface GetAllThongBao extends ParsedQs{
    page: string;
    limit: string;
    loai_thong_bao: 'DON_HANG' | 'KHUYEN_MAI' | 'HE_THONG' | 'VOUCHER'
}
export interface ThongBaoReadAll extends ParsedQs{
    loai_thong_bao: 'DON_HANG' | 'KHUYEN_MAI' | 'HE_THONG' | 'VOUCHER'
}
export interface ParamsThongBaoByID extends ParamsDictionary{
    id: string;
}