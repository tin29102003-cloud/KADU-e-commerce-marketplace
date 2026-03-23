"use client";
import Link from "next/link";
import clsx from "clsx";

// icons
import { CiHeart, CiLocationOn } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
// type
import type { TypeProduct } from "@/app/types/type";

// components
import ImgLazy from "../../shared/Imglazy";
import React from "react";

import productServices from "@/app/services/productServices";
import { TypePostProduct } from "@/app/types/product";
import { toast } from "react-toastify";
import { ApiError } from "@/app/types/type";

import { formatMoney } from "@/app/utils/helper";

export default function Product({
  product,
  className,
  sale,
}: {
  product: TypeProduct;
  className?: string;
  sale?: boolean;
}) {
  const handleLoveProduct = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const id_sp = Number(btn.dataset.id);
    if (!id_sp) {
      toast.error("Có lỗi xảy ra thêm!");
      return;
    }
    try {
      const res = await productServices.loveProduct({ id_sp });
      if (res.success) {
        toast.success("Đã thêm vào yêu thích.");
        btn.classList.toggle("active");
      }
    } catch (err) {
      const error = err as ApiError;
      if (error.status === 401) {
        toast.error("Vui lòng đăng nhập khi yêu thích!");
      }
    }
  };
  return (
    <li
      className={clsx(
        "product relative group p-[10px] h-full flex flex-col justify-between gap-y-3 border border-bd-primary transition-all-300-ease hover:border-accentColor rounded-lg bg-white",
        className
      )}
    >
      {/* <div
        className="product-addtoCart absolute top-12 right-[10px] z-[2] flex-center w-[30px] h-[30px] rounded-full bg-accentColor select-none cursor-pointer"
        // onClick={(e) => addTocart(e)}
      >
        <CiShoppingCart className="text-xl text-white" />
      </div> */}
      {/* <div className="product--decorate absolute right-0 top-0 w-[22px] h-[22px] bg-[#b5e9ff] clip-triangle before:content-[''] before:absolute before:right-1 before:top-1 before:block before:w-[5px] before:h-[5px] before:rounded-full before:bg-white "></div> */}
      {/* product info main */}
      <div className="product__infoMain">
        <div
          className={clsx(
            "product--action flex items-center",
            product.sale > 0 ? "justify-between" : "justify-end"
          )}
        >
          {product.sale > 0 && (
            <div className="product--active__discount p-[2.5px_5px] bg-accentColor text-[11px] font-medium text-white rounded-[4px]">
              -{product.sale}%
            </div>
          )}
          <button
            className={clsx("product--active__btnWishlist")}
            data-id={product.id}
            onClick={(e) => handleLoveProduct(e)}
          >
            <IoHeartOutline className="heart-outline w-7 h-7 stroke-[0.2px] text-accentColor" />
            <IoHeartSharp className="heart-sharp w-7 h-7 stroke-[0.2px] text-accentColor" />
          </button>
        </div>
        {/* img */}
        <div className="product--thumb overflow-hidden mt-2">
          <Link
            href={product.slug ? `/${product.slug}` : "#!"}
            className="block ratio-box ratio-1_1"
          >
            <div className="ratio-box-img transition-all-300-ease group-hover:scale-105">
              <ImgLazy
                src={product.img}
                connectHost={true}
                alt="Sản phẩm 1"
                className="ratio-img"
                wrapperClassName="w-full h-full"
              />
            </div>
          </Link>
        </div>
        {/* info */}

        {/* product info main==== */}
        <div className="content--main mt-2">
          <h3 className="name">
            <Link
              href={product.slug ? `/${product.slug}` : "#!"}
              className="line-clamp-2 leading-[1.5] text-base font-medium h-[calc(1em*1.5*2)] transition-all-300-ease hover:text-accentColor"
            >
              {product.ten_sp}
            </Link>
          </h3>
          <div className="price mt-[6px] flex items-end gap-x-[10px] flex-wrap">
            <div className="price__new text-base text-accentColor font-semibold">
              {/* tạm đóng  */}
              {/* {product.gia} */}
              {product.gia_da_giam
                ? formatMoney(product.gia_da_giam)
                : formatMoney(product.gia)}
            </div>
            {product.gia_da_giam && (
              <div className="price__old text-[13px] text-price-old font-medium line-through">
                {formatMoney(product.gia)}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* product info secondary === */}
      <div className="product__infoBottom">
        {sale && (
          <div className="sale--progress">
            <div className="sale--progress__info flex items-end justify-between">
              <div className="sold-count text-xs font-medium text-[#5F5F5F]">
                Đã bán:
              </div>
              <div className="percentage text-xs font-medium">55%</div>
            </div>
            {/* thanh line */}
            <div className="sale--progress__line w-full h-[6px] flex justify-start mt-[2px] bg-[#eef8ff] rounded-full">
              <div className="relative h-full w-[39%] bg-accentColor rounded-full before:content-[''] before:block before:w-[4px] before:h-[4px] before:rounded-full before:bg-accentColor before:absolute before:right-[1px] before:top-1/2 before:-translate-y-1/2 before:animate-effectScale"></div>
            </div>
          </div>
        )}

        {/* rating */}
        <div className="rating flex items-center justify-between gap-x-2 gap-y-2 mt-3 flex-wrap">
          <div className="flex items-center gap-x-3 flex-wrap">
            <div className="rating--scoreBox inline-flex items-center gap-x-1 p-[3px] rounded-[6px] border border-[#FFF1C5] bg-[#FFF8E4]">
              <FaStar className="w-[14px] h-[14px] fill-[#FFC205]" />
              <span className="text-xs text-[#5F5F5F] font-medium ">
                {product.diem_tb_dg}
              </span>
            </div>
            <span className="rating--count text-xs text-[#949494]">
              ({product.so_luong_dg} đánh giá)
            </span>
          </div>
          {/*  */}
          <span className="sold text-xs text-textGrayDark font-medium">
            Đã bán: {product.da_ban}
          </span>
        </div>

        {/* hiện khi sp chưa bán======= */}
        {/* <div className="not--sold flex items-center justify-between gap-x-2 mt-3">
          <span className="not--rating text-xs text-accentColor font-medium ">
            Chưa đánh giá
          </span>
          <span className="text-xs text-[#5F5F5F] font-medium">Chưa bán</span>
        </div> */}

        {/* location */}
        {/* <div className="location flex items-center gap-x-[6px] mt-3 ml-[-3px]">
          <CiLocationOn className="w-[18px] h-[18px] fill-[#949494]" />
          <span className="text-xs text-[#949494] capitalize">tây ninh</span>
        </div> */}
      </div>
    </li>
  );
}
