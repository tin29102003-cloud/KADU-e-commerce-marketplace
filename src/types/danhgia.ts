import { ParsedQs } from "qs";
import {ParamsDictionary} from 'express-serve-static-core'
export interface GetAllDanhGia extends ParsedQs{
    page: string;
    limit: string;
    sao: string;
    hinh: string
}
export interface ParamsDanhGiaBySlug extends ParamsDictionary{
    slug: string;
}
export interface ParamsDanhGiaById extends ParamsDictionary{
    id: string;
}
export type RatingAggregateResult = {
  ratingAvg: string;
  ratingCount: string;
};
export interface ThongKeSaoResult  {
    so_sao: string,
    so_luong: number
}