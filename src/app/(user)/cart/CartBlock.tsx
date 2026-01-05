"use client";
import Link from "next/link";
// import { useRef } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// icons
import { IoMdArrowDropdown } from "react-icons/io";
import { CiShop, CiChat1, CiDiscount1 } from "react-icons/ci";

// components
import ImgLazy from "../../components/shared/Imglazy";
import QuantityBox from "../../components/user/Quantitybox";
import CartItem from "../../components/user/CartItem";
// import CartCheckoutItem from "../../components/user/CartCheckoutItem";
import { TypeCartItem, TypeProductCartItem } from "@/app/types/cart";
import { TypeProduct } from "@/app/types/type";
import ErrorBlock from "@/app/components/user/ErrorBlock";
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import { formatMoney } from "@/app/utils/helper";
import cartServices from "@/app/services/cartServices";
import { toast } from "react-toastify";

export default function CartBlock({ cartList }: { cartList: TypeCartItem[] }) {
  const router = useRouter();
  const [listCartItem, setListCartItem] = useState<TypeCartItem[] | null>(
    cartList
  );

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [totalPrdSelect, setTotalPrdSelect] = useState<number>(0);
  const [totalSave, setTotalSave] = useState<number>(0);

  const allItemPrd = listCartItem
    ? listCartItem.flatMap((item) => item.items)
    : null;

  const countProduct = listCartItem
    ? listCartItem.reduce((acc, shop) => acc + shop.items.length, 0)
    : 0;
  const countPrdSelect = selectedIds.length;

  const changeArrCartItem = (id: number) => {
    setListCartItem(
      (prev) =>
        prev &&
        prev.map((shop) => ({
          ...shop,
          items: shop.items.filter((item) => item.cart_item_id !== id),
        }))
    );
  };

  const handleCheckBoxParent = (shopId: number, checked: boolean) => {
    const shop = cartList.find(
      (item) => Number(item.id_shop) === Number(shopId)
    );
    if (!shop) return;
    if (checked) {
      setSelectedIds(shop.items.map((item) => item.cart_item_id));
    } else {
      setSelectedIds([]);
    }
  };

  useEffect(() => {
    if (!allItemPrd) return;
    setTotalPrdSelect(
      allItemPrd.reduce((acc, prd) => {
        if (!selectedIds.includes(prd.cart_item_id)) return acc;
        return acc + prd.gia_tong;
      }, 0)
    );
    setTotalSave(
      allItemPrd.reduce((acc, prd) => {
        if (!selectedIds.includes(prd.cart_item_id)) return acc;
        return acc + Number(prd.gia_goc) - Number(prd.gia_hien_tai);
      }, 0)
    );
  }, [selectedIds, allItemPrd]);

  const handlePay = async () => {
    if (selectedIds.length === 0) {
      toast.warning("Vui lòng chọn sản phẩm khi thanh toán.");
      return;
    }
    try {
      // const res = await cartServices.cartToogle(selectedIds);
      // if (!res.success) return;
      //chuyển ctrang

      const dataSet =
        allItemPrd &&
        allItemPrd
          .filter((item) => selectedIds.includes(item.cart_item_id))
          .map((prd) => ({
            id_bt: prd.id_bt,
            so_luong: Number(prd.so_luong),
            id_sp: prd.id_sp,
          }));

      sessionStorage.setItem("dataPay", JSON.stringify(dataSet));
      setTimeout(() => {
        router.push("pay");
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error("Có lỗi xãy ra khi thanh toán!");
    }
  };
  return (
    <>
      {listCartItem ? (
        <ul className="itemCart--list flex flex-col gap-y-3 mt-3">
          <div className="cart--header p-[10px] rounded-lg shadow-[0_0_4px_1px_rgba(0,0,0,0.1)] mt-base">
            <div className="row items-center">
              <div className="cart--colDesc__left col-5">
                <div className="flex-y-center gap-x-2">
                  <input
                    type="checkbox"
                    id="select--allCart1"
                    className="w-[14px] h-[14px] border-[#E0E0E0] cursor-pointer"
                  />
                  <label
                    htmlFor="select--allCar1"
                    className="text-base text-textGrayDark font-medium select-none cursor-pointer"
                  >
                    Sản phẩm
                  </label>
                </div>
              </div>
              <div className="cart--colDesc__right col-7">
                <ul className="row">
                  <li className="text-base text-textGrayDark text-center font-medium col-3">
                    Đơn giá
                  </li>
                  <li className="text-base text-textGrayDark text-center font-medium col-3">
                    Số lượng
                  </li>
                  <li className="text-base text-textGrayDark text-center font-medium col-3">
                    Thành tiền
                  </li>
                  <li className="text-base text-textGrayDark text-center font-medium col-3">
                    Thao tác
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {listCartItem.map((cartItem) => (
            <li className="block--cart p-[10px] rounded-lg bg-[#f8f8f8]">
              <div className="cart--seller flex-y-center gap-x-2 py-3 border-b border-bd-primary">
                {
                  <input
                    type="checkbox"
                    className="w-[14px] h-[14px] border-[#E0E0E0] cursor-pointer status--checkbox"
                    checked={cartItem.items.every((item) =>
                      selectedIds.includes(item.cart_item_id)
                    )}
                    onChange={(e) =>
                      handleCheckBoxParent(cartItem.id_shop, e.target.checked)
                    }
                  />
                }
                <div className="flex-y-center gap-x-1">
                  <CiShop className="text-2xl" />
                  <div className="content flex-y-center">
                    <div className="text-[15px] flex-y-center after:content-[''] after:block after:h-4 after:border-r-[1.5px] after:border-bd-primary after:mx-[6px]">
                      {cartItem.ten_shop ? cartItem.ten_shop : "???"}
                    </div>
                    <div className="flex-y-center gap-x-1 text-sm text-accentColor select-none cursor-pointer">
                      <CiChat1 className="text-xl" />
                      Chat ngay
                    </div>
                  </div>
                </div>
              </div>
              <ul className="cart--list">
                {cartItem.items &&
                  cartItem.items.length > 0 &&
                  cartItem.items.map((item) => (
                    <CartItem
                      key={item.cart_item_id}
                      cartItem={item}
                      onChangDelete={changeArrCartItem}
                      selectedIds={selectedIds}
                      setSelectedIds={setSelectedIds}
                      setListCartItem={setListCartItem}
                    />
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <ErrorBlock
          desc="Đã xãy ra lỗi vui lòng thử lại "
          className="mt-base"
        />
      )}

      <div className="cartAction--fixed fixed bottom-0 left-0 z-10 w-full bg-white shadow-[0_-5px_6px_rgba(0,0,0,0.07)]">
        <div className="container">
          <div className="cartAction--discCode row">
            <div className="col-7"></div>
            <div className="col-5 flex-between-center py-3">
              <div className="flex-y-center gap-x-2">
                <CiDiscount1 className="text-2xl" />
                <span className="text-sm">DATN Voucher</span>
              </div>
              <span className="text-sm text-accentColor font-medium cursor-pointer select-none">
                Chọn hoặc nhập mã{" "}
              </span>
            </div>
          </div>
          <div className="cartAction--main flex-between-center">
            <div className="flex-y-center gap-x-5">
              <div className="flex-y-center gap-x-2">
                <input
                  type="checkbox"
                  id="select--allCart2"
                  className="w-[14px] h-[14px] border-[#E0E0E0]"
                />
                <label
                  htmlFor="select--allCart2"
                  className="text-base select-none cursor-pointer"
                >
                  Chọn tất cả{" "}
                  <span className="font-medium">({countProduct})</span>
                </label>
              </div>
              <span className="text-base text-[#EF4444] font-mediums">Xóa</span>
            </div>
            <div className="sumCart flex gap-x-5 items-start">
              <div className="flex gap-x-3">
                <div className="text-base">
                  Tổng cộng
                  <span className="font-medium ">
                    &nbsp;({countPrdSelect} sản phẩm)
                  </span>
                </div>
                <div className="sumCart--main">
                  <span className="sumCart--main__num text-lg text-accentColor font-semibold ">
                    {totalPrdSelect
                      ? formatMoney(totalPrdSelect)
                      : formatMoney(0)}
                  </span>
                  <div className="text-[13px] mt-2">
                    Tiết kiệm
                    <span className="text-accentColor font-medium ml-2">
                      {" "}
                      {totalSave ? formatMoney(totalSave) : formatMoney(0)}
                    </span>
                  </div>
                </div>
              </div>
              <BtnPrimary
                content="Thanh toán"
                className="p-[12px_60px]"
                onClick={handlePay}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
