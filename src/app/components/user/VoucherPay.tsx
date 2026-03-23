"use client";
import Link from "next/link";
import BtnPrimary from "./button/BtnPrimary";

// type
import type { TypeCodeItem } from "@/app/types/type";
import { TypePromoCode } from "@/app/types/promoCode";
import { formatDateVN } from "@/app/utils/helper";
import React from "react";

// thay đổi bắt buojc khi có data
export default function VoucherPayItem({
  code,
  setGiam_gia_voucher,
  setId_km,
}: {
  code: TypePromoCode;
  setGiam_gia_voucher: React.Dispatch<React.SetStateAction<number>>;
  setId_km: React.Dispatch<React.SetStateAction<number>>;
}) {
  const handleSetPriceVoucher = (gia_giam: number, id: number) => {
    setGiam_gia_voucher(gia_giam);
    setId_km(id);
  };
  return (
    <div className="item p-[10px] rounded-lg border-[1.2px] border-accentColor ">
      <div className="name text-[15px] text-textGrayDark font-medium ">
        {code.ten_km}
      </div>
      <div className="code mt-2 text-sm font-medium text-accentColor">
        Mã: <span className="uppercase ">{code.code}</span>
      </div>
      <div className="date--btn flex-between-center gap-x-2 mt-3">
        <span className="text-xs text-textGrayDark">
          HSD: {formatDateVN(code.ngay_kt)}
        </span>
        <BtnPrimary
          content="Áp dụng"
          className="p-[6px_16px]"
          onClick={() => handleSetPriceVoucher(code.gia_tri_giam, code.id)}
        />
      </div>
    </div>
  );
}
