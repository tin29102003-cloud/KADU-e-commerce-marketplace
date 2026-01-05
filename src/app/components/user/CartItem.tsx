"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// icons
import { IoMdArrowDropdown } from "react-icons/io";
// import { CiShop, CiChat1 } from "react-icons/ci";

// components
import ImgLazy from "../shared/Imglazy";
import QuantityBox from "./Quantitybox";
import { TypeCartItem, TypeProductCartItem } from "@/app/types/cart";
import { ApiError, TypeProduct } from "@/app/types/type";
import { formatMoney } from "@/app/utils/helper";
import { toast } from "react-toastify";
import cartServices from "@/app/services/cartServices";

export default function CartItem({
  cartItem,
  onChangDelete,
  selectedIds,
  setSelectedIds,
  setListCartItem,
}: {
  cartItem: TypeProductCartItem;
  onChangDelete: (id: number) => void;
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  setListCartItem: React.Dispatch<React.SetStateAction<TypeCartItem[] | null>>;
}) {
  const [gia_tong, setGia_tong] = useState<number>(cartItem.gia_tong);
  const [quantity, setQuantity] = useState<number | string>(cartItem.so_luong);
  // handle delete cart item
  const handleDeleteCartItem = async (id: number) => {
    if (!id) {
      toast.error("Có lỗi xãy ra khi xóa!");
      return;
    }
    try {
      const res = await cartServices.delCartId(id);
      console.log(res);
      if (res.success) {
        onChangDelete(id);
        toast.success("Sản phẩm đã được xóa.");
      }
    } catch (err) {
      const error = err as ApiError;
      console.log(error.message);
    }
  };

  const updateCartItemQuantity = async (id: number, q: number) => {
    try {
      const res = await cartServices.updateCart(Number(id), Number(q));
      if (!res.success) return;
      setGia_tong(cartItem.gia_hien_tai * q);
      setListCartItem((prev) =>
        prev
          ? prev.map((shop) => ({
              ...shop,
              items: shop.items.map((item) =>
                item.cart_item_id === id
                  ? {
                      ...item,
                      so_luong: String(q),
                      gia_tong: item.gia_hien_tai * q,
                      // tiet_kiem:
                      //   Number(item.gia_goc) - Number(item.gia_hien_tai),
                    }
                  : item
              ),
            }))
          : null
      );
      setQuantity(q);
    } catch (err) {
      const error = err as ApiError;
      if (error.status === 400) {
        toast.error(error.message);
      } else {
        toast.error("Có lỗi xãy ra khi tăng số lượng.");
      }
    }
  };

  const handleCheckedChild = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };
  return (
    <li
      className="cart--prd row py-3 border-b border-bd-primary last:border-none"
      data-id={cartItem.cart_item_id}
    >
      <div className="left col-5 grid grid-cols-6 gap-3">
        <div className="col-span-4 flex-y-center gap-x-3">
          <input
            type="checkbox"
            className="w-[14px] h-[14px] border-[#E0E0E0] cursor-pointer"
            // data-prdCartId={i}
            checked={selectedIds.includes(cartItem.cart_item_id)}
            onChange={(e) =>
              handleCheckedChild(cartItem.cart_item_id, e.target.checked)
            }
          />
          <div className="cart--thumb flex-y-center gap-x-2">
            <div className="cart--thumb__img">
              <Link
                href="#!"
                className="block w-20 h-20 rounded-lg overflow-hidden "
              >
                <ImgLazy
                  src="./images/product/product-2.png"
                  alt="sản phẩm 1"
                  className="img-full"
                />
              </Link>
            </div>
            <div className="cart--thumb__name text-[15px] font-medium ">
              <Link href="#!" className="line-clamp-2">
                {cartItem.ten_sp}
              </Link>
            </div>
          </div>
        </div>
        <div className="cart--classify col-span-2 flex-center flex-col text-[13px] font-medium text-textGrayDark ">
          <div className="cart--classify__title flex-y-center gap-x-[6px] select-none cursor-pointer">
            Phân loại hàng
            <IoMdArrowDropdown className="text-base" />
          </div>
          <div className="cart--classify__content">Màu đỏ, Size xs</div>
        </div>
      </div>
      <div className="right col-7 ">
        <ul className="row h-full">
          <li className="cart--unitPrice col-3 flex-center">
            <div className="flex flex-wrap items-end gap-x-2">
              <span className="price--new text-sm font-semibold">
                {cartItem.gia_hien_tai
                  ? formatMoney(cartItem.gia_hien_tai)
                  : "???"}
              </span>
              <span className="price--old text-[13px] text-price-old font-medium line-through">
                {cartItem.gia_goc ? formatMoney(cartItem.gia_goc) : "???"}
              </span>
            </div>
          </li>
          <li className="cart--quantity col-3 flex-center">
            <QuantityBox
              className="w-[108px] h-[38px] text-sm"
              onUpdate={(quantity) =>
                updateCartItemQuantity(cartItem.cart_item_id, quantity)
              }
              defaultValue={Number(quantity)}
            />
          </li>
          <li className="cart--intoMoney col-3 flex-center">
            <span className="text-base text-accentColor font-semibold">
              {gia_tong ? formatMoney(gia_tong) : "???"}
            </span>
          </li>
          <li className="cart--action col-3 flex-center">
            <button
              className="text-sm text-[#EF4444] font-medium"
              onClick={() => handleDeleteCartItem(cartItem.cart_item_id)}
            >
              Xóa
            </button>
          </li>
        </ul>
      </div>
    </li>
  );
}
