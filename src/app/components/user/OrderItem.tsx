"use client";
import Image from "next/image";
import ImgLazy from "../shared/Imglazy";
import { CiChat1, CiShop } from "react-icons/ci";
import Link from "next/link";
import BtnPrimary from "./button/BtnPrimary";
import { TypeOrderItem } from "@/app/types/order";
import { formatDateVN, formatMoney, getStatusOrder } from "@/app/utils/helper";
import { toast } from "react-toastify";
import orderService from "@/app/services/orderServices";
import React from "react";

export default function OrderItem({
  order,
  setOrderListChange,
}: {
  order: TypeOrderItem;
  setOrderListChange: React.Dispatch<
    React.SetStateAction<TypeOrderItem[] | null>
  >;
}) {
  const handleDeleteOrder = async (id: number) => {
    if (!id) {
      toast.error("Có lỗi xảy ra khi xóa!");
      return;
    }
    try {
      const res = await orderService.deleteOrderItem(Number(id));
      if (!res.success) return;
      toast.success("Hủy đơn hàng thành công.");
      setOrderListChange((prev) => {
        if (!prev) return prev;
        return prev.filter((order) => order.id !== id);
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="order--item bg-white rounded-lg border border-bd-primary">
      {/* Header */}
      <div className="order--header flex justify-between items-center py-4 px-6 border-b border-bd-primary">
        <div className="flex items-center gap-x-2">
          {/* <span className="text-sm text-blue-500 cursor-pointer">
            Yêu thícht
          </span> */}
          <span className="order--name text-base font-semibold">
            {order.nguoi_mua.ho_ten}
          </span>
        </div>
        <div className="header--action flex items-center gap-x-3 text-sm text-neutral-600">
          {/* <button className="action--chat flex-y-center gap-x-1 text-sm text-textGrayDark px-2 py-1 rounded-[4px] border border-bd-primary hover:bg-primaryColor hover:text-accentColor transition-all-300-ease ">
            <CiChat1 className="text-base stroke-[1px]" />
            Chat
          </button> */}
          <Link
            href={`/shop/${order.nguoi_mua.id}`}
            className="action--viewShop flex-y-center gap-x-1 text-sm text-textGrayDark px-2 py-1 rounded-[4px] border border-bd-primary hover:bg-primaryColor hover:text-accentColor transition-all-300-ease "
          >
            <CiShop className="text-base stroke-[1px]" />
            Xem Shop
          </Link>
        </div>
      </div>

      {/* Status */}
      <div className="order--status flex justify-end bg-neutral-50/70 px-6 py-3.5">
        {/* <div className="location">
        Đơn hàng đã đến
       </div> */}
        <span className="text-sm font-medium text-accentColor font-medium uppercase">
          {getStatusOrder(order.trang_thai_dh)}
        </span>
      </div>

      {/* Product */}
      <Link href="#!">
        <ul className="orderPrd--list px-6">
          {order.chi_tiet_dh.map((prd) => (
            <li className="orderPrd--item flex gap-x-4 py-3 border-b border-bd-primary last:border-none">
              <div className="prd--thumb inline-block w-20 h-20 border rounded-md ratio-box">
                <ImgLazy
                  src={prd.img}
                  alt="sp-1"
                  className="ratio-img"
                  wrapperClassName="w-full h-full"
                  connectHost={true}
                />
              </div>
              <div className="flex-1">
                <div className="prd--name font-medium text-neutral-800 line-clamp-2">
                  {prd.ten_sp}
                </div>

                {/* <div className="prd--variant text-xs text-neutral-500 mt-1">
                  Phân loại hàng: 800ML (Mới 2025)
                </div> */}
                <div className="text-sm text-neutral-600 mt-1">
                  x{prd.so_luong}
                </div>
              </div>

              {/* Price */}
              <div className="prd--price text-right">
                {prd.gia_da_giam && (
                  <div className="price__old line-through text-sm text-neutral-400">
                    {formatMoney(prd.gia)}
                  </div>
                )}
                <div className="price__new  text-accentColor font-medium">
                  {prd.gia_da_giam
                    ? formatMoney(prd.gia_da_giam)
                    : formatMoney(prd.gia)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Link>

      {/* Footer */}
      <div className="order--footer">
        <div className="block--footerInfo flex-between-center gap-x-3 px-6 py-3.5 bg-neutral-50/70 border-y border-bd-primary">
          <div className="text-sm text-neutral-500">
            Nhận sản phẩm và thanh toán trước{" "}
            {formatDateVN(order.ngay_hoan_thanh!)}
          </div>
          <div className="total--amount flex-y-center gap-x-1 text-sm">
            Thành tiền:
            <span className="text-lg text-accentColor font-semibold ">
              {formatMoney(order.tam_tinh)}
            </span>
          </div>
        </div>
        <div className="blockBtn--contactSeller flex justify-end gap-x-3 px-6 py-3.5">
          {order.trang_thai_dh < 2 && (
            <BtnPrimary
              content="Hủy"
              className="!px-6 !py-2 !bg-red-400"
              onClick={() => handleDeleteOrder(order.id)}
            />
          )}
          <BtnPrimary content="Liên hệ người bán" className="!px-6 !py-2" />
        </div>
        {/* <div className="text-right">
          <div className="text-sm text-neutral-700">
            Thành tiền:{" "}
            <span className="text-blue-500 font-semibold text-base">
              15.000đ
            </span>
          </div>

          <button className="mt-2 px-4 py-2 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600 transition">
            Liên hệ người bán
          </button>
        </div> */}
      </div>
    </div>
  );
}
