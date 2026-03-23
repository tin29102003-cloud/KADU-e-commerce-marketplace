"use client";
import { TypeProduct } from "@/app/types/type";
import ImgLazy from "../../shared/Imglazy";
import { formatMoney } from "@/app/utils/helper";
import RenderStar from "../RenderStar";
import { toast } from "react-toastify";
import productServices from "@/app/services/productServices";
import React from "react";

export default function ProductSellerItem({
  product,
  setProductSellerChange,
}: {
  product: TypeProduct;
  setProductSellerChange: React.Dispatch<
    React.SetStateAction<TypeProduct[] | null>
  >;
}) {
  const handleDeletePrdSeller = async (id: number) => {
    if (!id) {
      toast.error("Có lỗi khi xóa!");
      return;
    }
    try {
      const res = await productServices.deleteProductSeller(id);
      if (!res.success) return;
      toast.success("Xóa sản phẩm thành công.");
      setProductSellerChange((prev) => {
        if (!prev) return prev;
        return prev.filter((prd) => prd.id !== id);
      });
    } catch (err) {
      console.log(err);
      toast.error("Có lỗi khi xóa!");
    }
  };

  return (
    <div className="productSeller--item grid grid-cols-[80px_1.5fr_1fr_1fr_1fr_1fr_1fr] items-center border-b px-4 py-4 hover:bg-gray-50">
      {/* Checkbox */}

      {/* Image */}
      <div className="h-16 w-16 overflow-hidden rounded border ratio-box">
        <ImgLazy
          src={product.img}
          connectHost={true}
          alt=""
          className="ratio-img"
          wrapperClassName="block w-full h-full"
        />
      </div>

      {/* Name */}
      <div className="product--header flex flex-col gap-y-2">
        <p className="line-clamp-2 font-medium">{product.ten_sp}</p>
        <div className="flex gap-2 text-xs">
          <span className="rounded bg-accentColor/50 px-1.5 py-0.5 text-white">
            -{product.sale}%
          </span>
          {product.noi_bat && (
            <span className="rounded bg-accentColor px-1.5 py-0.5 text-white">
              Nổi bật
            </span>
          )}
        </div>
        <div className="wrap--star flex gap-x-1">
          <div className="product--star flex-y-center gap-x-0.5">
            <RenderStar
              star={Number(product.diem_tb_dg)}
              widthStar="16px"
              heightStar="16px"
            />
          </div>
          <span className="diemtb text-xs text-neutral-500">
            {product.so_luong_dg}
          </span>
        </div>
      </div>

      {/* Code */}
      <div className="product--code text-gray-600">{product.code}</div>

      {/* Old price */}
      <div className="product--price flex flex-col gap-y-1">
        <div className="price__new font-semibold text-accentColor text-base">
          {/* tạm đóng  */}
          {/* {product.gia} */}
          {product.gia_da_giam
            ? formatMoney(product.gia_da_giam)
            : formatMoney(product.gia)}
        </div>
        {product.gia_da_giam && (
          <div className="price__old text-price-old line-through text-sm">
            {formatMoney(product.gia)}
          </div>
        )}
      </div>
      <div className="product--quantity">
        {product.so_luong}
        <div className="daban mt-1 text-xs text-neutral-500">
          Đã bán: {product.da_ban}
        </div>
      </div>
      {/* New price */}

      {/* Status */}
      <div>
        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-600">
          Hiển thị
        </span>
      </div>

      {/* Actions */}
      <div className="product--action flex flex-col items-end gap-2">
        <button
          className="block text-accentColor hover:underline"
          onClick={() => handleDeletePrdSeller(product.id)}
        >
          Xóa
        </button>
        {/* <button className="block text-gray-500 hover:underline">Khóa</button> */}
      </div>
    </div>
  );
}
