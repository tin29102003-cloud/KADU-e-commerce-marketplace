"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

// icon
import { FaStar } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { LiaShippingFastSolid } from "react-icons/lia";
import { FaCheck } from "react-icons/fa6";

// type
import type { ProductDetail, TypeProduct } from "@/app/types/type";

// component
import Breadcrumb from "@/app/components/user/Breadcrumb";
import ImgLazy from "@/app/components/shared/Imglazy";
import BtnSecondary from "@/app/components/user/button/BtnSecondary";
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import QuantityBox from "@/app/components/user/Quantitybox";

// services
import BannerProductDetail from "@/app/components/user/SlideProductDetail";
import productServices from "@/app/services/productServices";

// helper
import { formatMoney } from "@/app/utils/helper";
import clsx from "clsx";
import { TypePostProduct } from "@/app/types/product";
import { toast } from "react-toastify";

import { ApiError } from "@/app/types/type";
import RenderStar from "../RenderStar";

export default function DetailProductMain({
  product,
}: {
  product: ProductDetail;
}) {
  const [idVariant, setIdVariant] = useState<number | null>(0);
  //   price
  const [gia, setGia] = useState<number>(0);
  const [gia_da_giam, setGia_da_giam] = useState<number>(0);
  const [ton_kho, setTon_kho] = useState<number>(1);
  const [da_ban, setDa_ban] = useState<Number>(0);
  //   quantity
  const [quantity, setQuantity] = useState<number>(1);
  console.log(product);
  useEffect(() => {
    if (product?.san_pham_bien_the?.length > 0) {
      setIdVariant(Number(product.san_pham_bien_the[0].id));
    } else {
      setIdVariant(null);
    }
  }, [product]);

  //   update price
  useEffect(() => {
    if (idVariant) {
      const objGia = product.san_pham_bien_the.find(
        (item) => Number(item.id) === Number(idVariant)
      );
      if (!objGia) return;
      setGia_da_giam(Number(objGia.gia_da_giam) * quantity);
      setGia(Number(objGia.gia) * quantity);
      setTon_kho(objGia.so_luong);
    } else {
      setGia_da_giam(Number(product.gia_da_giam) * quantity);
      setGia(Number(product.gia) * quantity);
      setTon_kho(Number(product.so_luong));
    }
  }, [quantity, idVariant]);

  //   handle get id and active variant
  const handleGetVariant = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.target as HTMLElement;
    const idVariant = el.dataset.idVariant;
    if (!idVariant) return;
    document.querySelectorAll(".variant--list__item").forEach((item) => {
      item.classList.remove("active");
    });
    el.classList.add("active");
    setIdVariant(Number(idVariant));
  };

  //   handle add to cart
  const handleAddTocart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const infoStr = localStorage.getItem("infoUser");
    const infoUser = infoStr ? JSON.parse(infoStr) : null;

    const id_sp = (e.target as HTMLButtonElement).dataset.id;
    if (!id_sp) {
      toast.error("Có lỗi xãy ra khi thêm!");
      return;
    }
    const dataPost: TypePostProduct = {
      id_sp,
      id_bt: idVariant,
      so_luong: quantity,
      ten_sp: product.ten_sp,
      gia_da_giam: product.gia_da_giam,
      gia: product.gia,
    };
    if (!infoUser) {
      addToCartLocal(dataPost);
      toast.success("Đã thêm vào giỏ hàng.");
      return;
    }
    // post
    try {
      const res = await productServices.addTocart(dataPost);
      if (res.status === 200 && res.success) {
        toast.success("Đã thêm vào giỏ hàng.");
      }
    } catch (err) {
      const error = err as ApiError;
      if (error.status === 401) {
        toast.error("Vui lòng đăng nhập trước khi thêm sản phẩm!");
        // addToCartLocal(dataPost);
        // toast.success("Đã thêm vào giỏ hàng.");
      } else if (error.status === 404) {
        toast.error("Sản phẩm hoặc biến thể không tồn tại!");
      } else if (error.status === 400) {
        toast.warning("Bạn chỉ có thể thêm tối đa 0 sản phẩm nữa!");
      } else toast.error("Lỗi không xác định!");
    }
  };

  const addToCartLocal = (dataPost: TypePostProduct) => {
    const cartLocalStr = localStorage.getItem("cartLocal");
    const cartLocal: TypePostProduct[] = cartLocalStr
      ? JSON.parse(cartLocalStr)
      : null;
    if (!cartLocal) {
      localStorage.setItem("cartLocal", JSON.stringify([dataPost]));
      toast.success("Đã thêm vào giỏ hàng.");
      return;
    }
    const ischeckCartExistence = cartLocal.some(
      (cartItem) =>
        cartItem.id_sp === dataPost.id_sp && cartItem.id_bt === dataPost.id_bt
    );
    if (ischeckCartExistence) {
      const updatedCart = cartLocal.map((item) =>
        item.id_sp === dataPost.id_sp && item.id_bt === dataPost.id_bt
          ? {
              ...item,
              so_luong: Number(item.so_luong) + Number(dataPost.so_luong),
            }
          : item
      );
      localStorage.setItem("cartLocal", JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cartLocal, dataPost];
      localStorage.setItem("cartLocal", JSON.stringify(updatedCart));
    }
  };
  //   render
  return (
    <>
      <section className="section--detailPrd section-py">
        <div className="container">
          <div className="detailPrd--main row">
            <div className="detailPrd--main__banner col-5">
              <BannerProductDetail listBanner={product.imgs} />
            </div>
            <div className="detailPrd--main__info col-7">
              <h1 className="detailPrd--name title-32 font-semibold">
                {product.ten_sp}
              </h1>
              <div className="detailPrd--meta flex items-center mt-3">
                <div className="detailPrd--meta__item rating flex items-center gap-x-1">
                  <span className="rating__count text-accentColor">
                    {product.diem_tb_dg}
                  </span>
                  <div className="rating__star flex items-center gap-x-1">
                    <RenderStar star={product.so_luong_dg} />
                  </div>
                </div>
                <div className="detailPrd--meta__item reviews flex items-center gap-x-1 ">
                  <span className="reviews__content text-sm text-neutral-500 ">
                    Đánh giá
                  </span>
                  <span className="reviews__count text-accentColor">
                    {product.so_luong_dg}
                  </span>
                </div>
                <div className="detailPrd--meta__item sold flex items-center gap-x-1 ">
                  <span className="sold__content text-sm text-neutral-500 ">
                    Đã bán
                  </span>
                  <span className="sold__count text-accentColor">
                    {product.da_ban}
                  </span>
                </div>
              </div>
              <div className="block--price p-[12px_16px] rounded-lg bg-primaryColor border border-bd-f5 mt-5">
                <div className="price flex items-end flex-wrap gap-3">
                  <span className="price__new title-32 font-semibold text-accentColor">
                    {gia_da_giam ? formatMoney(gia_da_giam) : formatMoney(gia)}
                  </span>
                  {gia_da_giam && (
                    <span className="price__old text-[15px] text-price-old font-medium line-through">
                      {formatMoney(gia)}
                    </span>
                  )}
                </div>
                <div className="price--saving mt-3 text-sm">
                  <span className="price--saving__content mr-[6px]">
                    Tiết kiệm:
                  </span>
                  <span className="price--saving__price text-[#DB4444]">
                    {formatMoney(gia - gia_da_giam)}
                  </span>
                </div>
              </div>
              {/* <div className="detailprd--ship text-sm flex items-center gap-x-4 mt-5">
              <span className="ship__title text-neutral-500">Vận chuyển</span>
              <div className="ship--main flex-y-center gap-x-2">
                <LiaShippingFastSolid className="w-5 h-5 fill-[#26AA99]" />
                <div className="flex-y-center gap-x-2">
                  <span>Nhận hàng 30 Th08 - 1 Th09</span>
                  <IoIosArrowForward className="w-4 h-4 mb-[2px] fill-[#4E4E4E]" />
                </div>
              </div>
            </div> */}
              {product.san_pham_bien_the &&
                product.san_pham_bien_the.length > 0 && (
                  <div className="blockVariant--list flex flex-col gap-y-3 mt-5">
                    <div className="blockVariant--list__item">
                      <div className="title font-medium capitalize">Màu</div>
                      <ul className="variant--list flex gap-x-2 mt-2">
                        {product.san_pham_bien_the.map((variant) => (
                          <li
                            className={clsx(
                              "variant--list__item relative overflow-hidden select-none p-[8px_24px] text-sm capitalize rounded-lg border border-gray-400 cursor-pointer",
                              variant.id === idVariant && "active"
                            )}
                            data-id-variant={variant.id}
                            onClick={(e) => handleGetVariant(e)}
                          >
                            {variant.ten_bien_the}
                            <div className="variant--tick absolute right-0 top-0 w-[13px] h-[10px] bg-accentColor rounded-bl-md flex-center ">
                              <FaCheck className="w-[6px] h-[6px] fill-white" />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

              {/* hành động */}
              <div className="detailPrd--action mt-6">
                <span className="title text-xs font-medium text-neutral-500">
                  Kho: {ton_kho}
                </span>
                <div className="flex gap-x-3">
                  <div className="block--quantity">
                    <QuantityBox
                      onUpdate={(quantity: number) => setQuantity(quantity)}
                    />
                  </div>
                  <div className="blockBtn--buy flex-grow flex gap-x-3">
                    <BtnPrimary
                      className="btn--buyNow flex-1"
                      content="Mua ngay"
                    />
                    <BtnSecondary
                      className="btn--addCart"
                      content="Thêm vào giỏ"
                      data-id={product.id}
                      onClick={(e) => handleAddTocart(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* action bottom */}
      <div className="detail--actionFixed fixed bottom-2 left-0 z-10 w-full">
        <div className="container">
          <div className="row justify-center">
            <div className="col-8">
              <div className="flex-between-center p-[12px_16px] bg-white shadow-[0_0_5px_1.5px_rgba(0,0,0,0.15)] rounded-lg">
                <div className="actionFixed--thumbName flex-y-center gap-x-3">
                  <div className="actionFixed--thumbName__thumb shrink-0 w-14 h-14 rounded-[4px] overflow-hidden">
                    <ImgLazy
                      src="./images/product/product-2.png"
                      alt="đây là hình test nè "
                      className="img-full"
                    />
                  </div>
                  <span className="actionFixed--thumbName__name text-sm font-medium line-clamp-2">
                    {product.ten_sp}
                  </span>
                </div>
                <div className="actionFixed--meta flex-y-center gap-x-3">
                  <div className="actionFixed--meta__price flex flex-col items-end">
                    <span className="price__new text-lg text-accentColor font-semibold">
                      {gia_da_giam
                        ? formatMoney(gia_da_giam)
                        : formatMoney(gia)}
                    </span>
                    {gia_da_giam && (
                      <span className="price__old line-through text-price-old">
                        {formatMoney(gia)}
                      </span>
                    )}
                  </div>
                  <BtnPrimary
                    content="Mua ngay"
                    className="!p-[6px_12px] font-medium text-sm whitespace-nowrap"
                  />
                  <BtnSecondary
                    content="Thêm vào giỏ"
                    className="p-[6px_12px] font-medium text-sm whitespace-nowrap"
                    data-id={product.id}
                    onClick={(e) => handleAddTocart(e)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
