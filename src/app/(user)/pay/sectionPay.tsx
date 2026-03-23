"use client";
import ImgLazy from "@/app/components/shared/Imglazy";
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import BtnSecondary from "@/app/components/user/button/BtnSecondary";
import CartCheckoutItem from "@/app/components/user/CartCheckoutItem";
import ErrorBlock from "@/app/components/user/ErrorBlock";
import MessageBlock from "@/app/components/user/MessageBlock";
import PromoCodeItem from "@/app/components/user/PromoCodeItem";
import VoucherPayItem from "@/app/components/user/VoucherPay";
import payServices from "@/app/services/payServices";
import { TypePromoCode } from "@/app/types/promoCode";
import { useSearchParams } from "next/navigation";
import {
  ApiError,
  CheckoutResponse,
  TypeAddressItem,
  TypeMethodPayItem,
} from "@/app/types/type";
import { formatMoney } from "@/app/utils/helper";
import axios from "axios";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";

// icons
import { CiDiscount1, CiLocationOn, CiShop, CiChat1 } from "react-icons/ci";
import { LiaShippingFastSolid } from "react-icons/lia";
import { MdPayment } from "react-icons/md";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
const BASE_URL_PAYMENT = process.env.NEXT_PUBLIC_PAYMENT;

export default function SectionPay({
  dataAddress,
  voucherList,
  listMethodPay,
}: {
  dataAddress: TypeAddressItem;
  voucherList: TypePromoCode[];
  listMethodPay: TypeMethodPayItem[];
}) {
  const router = useRouter();
  const [dataPay, setDataPay] =
    useState<{ id_sp: string; so_luong: number; id_bt: number }[]>();
  const [defaultDataPay, setDeffaultDataPay] = useState<CheckoutResponse>();
  const [openPopupVoucher, setOpenPopupVoucher] = useState<boolean>(false);
  const [notePay, setNotePay] = useState<string>("");
  const [idMethodPay, setIdMethodPay] = useState<number>();
  const [giam_gia_voucher, setGiam_gia_voucher] = useState<number>(0);
  const [tong_tien, setTong_tien] = useState<number | undefined>(0);
  const [id_km, setId_km] = useState<number>(0);

  useEffect(() => {
    const dataPayStr = sessionStorage.getItem("dataPay");
    const dataPay = dataPayStr ? JSON.parse(dataPayStr) : null;
    if (!dataPay) return;
    setDataPay(dataPay);
    (async () => {
      try {
        const res = await payServices.getAllProductPay({ items: dataPay });
        if (!res.success) return;
        setTong_tien(res.data.data.tom_tat_don_hang.grandTotal);
        setDeffaultDataPay(res.data);
      } catch (err) {
        console.log(err);
        //
      }
    })();
  }, []);

  useEffect(() => {
    setTong_tien((prev) => Number(prev) - giam_gia_voucher);
  }, [giam_gia_voucher]);

  const handleSubmitPay = async () => {
    if (!dataPay) return;
    const dataPost: {
      items: { id_sp: string; so_luong: number; id_bt: number }[];
      id_km: number;
      id_dia_chi: number;
      id_pttt: number;
      ghi_chu: string;
    } = {
      items: [...dataPay],
      id_km: Number(id_km),
      id_dia_chi: dataAddress.id!,
      //  dataAddress[0].id
      id_pttt: Number(idMethodPay),
      ghi_chu: notePay,
    };
    // console.log(dataPost);
    // try {
    //   console.log(BASE_URL_PAYMENT);
    //   const res = await axios.post(BASE_URL_PAYMENT!, dataPost, {
    //     withCredentials: true,
    //   });
    //   console.log(res);
    //   // if (!res.success) return;
    //   // toast.success("Đặt hàng thành công.");
    //   // const idDh = res.data.data.list_don_hang[0];
    //   //   try {
    //   //     console.log(idDh);
    //   //     const res = await payServices.payment(Number(idDh));
    //   //     if (!res.success) return;
    //   //     console.log(res);
    //   //   } catch (err) {
    //   //     console.log(err);
    //   //   }
    // } catch (err) {
    //   console.log(err);
    // }

    try {
      const res = await payServices.newDonHang(dataPost);
      if (!res.success) return;
      const idDh = res.data.data.list_don_hang[0];
      if (idMethodPay === 1) {
        toast.success("Đặt hàng thành công.");
        router.push(`/checkout/success/?id_dh=${idDh}`);
        return;
      }
      try {
        const res = await payServices.payment(Number(idDh));
        if (!res.success) return;
        if (res.data.url) router.push(res.data.url);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      const error = err as ApiError;
      if (error.status === 400) {
        toast.error(error.message);
      } else {
        toast.error("Lỗi không xác định!");
      }
    }
  };
  console.log(voucherList);
  return (
    <section className="section--pay section-py">
      <div className="container">
        <div className="pay">
          {/* pay address */}
          {dataAddress && (
            <div className="pay--addressUser p-[14px_12px] rounded-lg bg-white shadow-[0_0_5px_1px_rgba(0,0,0,0.1)]">
              <div className="pay--addressUser__title flex-y-center gap-x-1">
                <CiLocationOn className="text-2xl text-accentColor" />
                <span className="text-lg text-accentColor font-medium">
                  Địa chỉ nhận hàng
                </span>
              </div>
              <div className="pay--addressUser__main mt-4">
                {/*address name and phone */}
                <div>
                  <span className="address__name text-base font-medium">
                    {dataAddress.ho_ten}
                  </span>
                  <span className="address__phone ml-3 text-base text-textGrayDark">
                    {dataAddress.dien_thoai}
                  </span>
                </div>
                {/*address content  */}
                <div className="flex-y-center gap-x-4 mt-1">
                  <span className="text-base text-textGrayDark">
                    {dataAddress.dia_chi}
                  </span>
                  <div className="address--action flex-y-center gap-x-2">
                    <BtnSecondary
                      content="Mặc định"
                      className="p-[3px_6px] !text-[11px] !font-normal rounded-[5px]"
                    />
                    {/* <span className="text-sm text-accentColor select-none cursor-pointer">
                    Thay đổi
                  </span> */}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* pay main */}
          <div className="pay--main mt-base row">
            <div className="col-6">
              {defaultDataPay && (
                <ul className="checkout--list flex flex-col gap-y-5">
                  {defaultDataPay.data.shops.map((shop, i) => (
                    <li key={i} className="checkout--item">
                      <div className="cart--seller flex-y-center gap-x-2 py-3 border-b border-bd-primary">
                        <div className="flex-y-center gap-x-1">
                          <CiShop className="text-2xl" />
                          <div className="content flex-y-center">
                            <div className="text-[15px] flex-y-center ">
                              {shop.shop_info.ten_shop}
                            </div>
                          </div>
                        </div>
                      </div>
                      <ul className="productCheckout--list">
                        {shop.items.length > 0 &&
                          shop.items.map((prd) => {
                            return <CartCheckoutItem product={prd} />;
                          })}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/*  */}
            <div className="col-6">
              <div className="sticky top-0 flex flex-col gap-y-3">
                {/* discount shop */}
                <div
                  className="checkout--discountShop flex-between-center p-[14px_12px] rounded-lg border border-neutral-100 cursor-pointer"
                  onClick={() => setOpenPopupVoucher((prev) => !prev)}
                >
                  <div className="flex-y-center gap-x-2">
                    <CiDiscount1 className="text-2xl" />
                    <span className="text-base font-medium">
                      Voucher của Shop
                    </span>
                  </div>
                  <span className="text-sm text-accentColor select-none cursor-pointer">
                    Chọn Voucher
                  </span>
                </div>
                {/* checkout shipping method */}
                {/* <div className="checkout--shippingMethod flex gap-x-[6px] p-[14px_12px] rounded-lg bg-primaryColor border border-bd-f5">
                  <LiaShippingFastSolid className="text-2xl" />
                  <div className="shippingMethod--main grow">
                    <div className="flex-between gap-x-2">
                      <div className="shippingMethod--main__name">
                        <div>
                          <span className="text-base font-medium">
                            Phương thức vận chuyển:{" "}
                          </span>
                          <span>Nhanh</span>
                        </div>
                        <span className="block mt-1 text-sm text-textGrayDark">
                          Đảm bảo nhận hàng từ 3 Tháng 9 - 8 Tháng 9
                        </span>
                      </div>
                      <div className="">
                        <span className="text-sm text-accentColor select-none cursor-pointer">
                          Thay đổi{" "}
                        </span>
                        <span className="text-base font-medium ml-1">
                          16.500đ
                        </span>
                      </div>
                    </div>
                    <div className="shippingMethod--main__total flex-between-center mt-3">
                      <span className="text-base ">Tổng tiền (1 sản phẩm)</span>
                      <span className="text-base text-accentColor font-medium">
                        68.500đ
                      </span>
                    </div>
                  </div>
                </div> */}
                {/*  discountDATN*/}
                {/* <div className="checkout--discountDATN flex-between-center p-[14px_12px] rounded-lg bg-primaryColor border border-bd-f5">
                  <div className="flex-y-center gap-x-2">
                    <CiDiscount1 className="text-2xl" />
                    <span className="text-base font-medium">DATN Voucher</span>
                  </div>
                  <span className="text-sm text-accentColor select-none cursor-pointer">
                    Chọn Voucher
                  </span>
                </div> */}
                {/* pay method  */}

                <div className="note--pay">
                  <textarea
                    name=""
                    id=""
                    className="w-full min-h-[100px] rounded-md border border-neutral-200 outline-none p-3"
                    placeholder="Ghi chú đơn hàng"
                    onChange={(e) => setNotePay(e.target.value)}
                  ></textarea>
                </div>
                <div className="checkout--payMethod ">
                  <div className="checkout--payMethod__main ">
                    <div className="header flex-between-center pb-3 border-b border-bd-primary p-[14px_12px] rounded-lg bg-primaryColor border border-bd-f5">
                      <div className="flex-y-center gap-x-[6px]">
                        <MdPayment className="text-2xl" />
                        <span className="text-base font-medium">
                          Phương thức thanh toán
                        </span>
                      </div>
                      {/* <div className="">
                        <span className="text-sm">
                          Thanh toán khi nhận hàng
                        </span>
                      </div> */}
                    </div>
                    {/*  */}
                    <div className="list--methodPay flex flex-col gap-y-3 mt-3 pb-2 border-b border-bd-primary">
                      {listMethodPay &&
                        listMethodPay.length > 0 &&
                        listMethodPay.map((item, i) => (
                          <div className="item flex-y-center gap-x-4">
                            <div className="img--method w-20 h-20 rounded-md overflow-hidden ">
                              <ImgLazy
                                src={item.img}
                                wrapperClassName="inline-block w-full h-full ratio-box"
                                className=" ratio-img"
                                alt=""
                                connectHost={true}
                              />
                            </div>
                            <div className="block--select flex-y-center gap-x-3">
                              <input
                                type="radio"
                                name="methodPay"
                                id={`method-pay-${i}`}
                                className="w-4 h-4"
                                onChange={(e) => setIdMethodPay(item.id)}
                              />
                              <label
                                htmlFor={`method-pay-${i}`}
                                className="text-sm cursor-pointer"
                              >
                                {item.ten_pt}
                              </label>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <ul className="checkout--payMethod__total flex flex-col gap-y-3 mt-3">
                    <li className="item flex-between-center">
                      <span className="text-base text-textGrayDark">
                        Tạm tính
                      </span>
                      <span className="text-base ">
                        {defaultDataPay
                          ? formatMoney(
                              defaultDataPay.data.tom_tat_don_hang
                                .total_tien_hang
                            )
                          : formatMoney(0)}
                      </span>
                    </li>
                    <li className="item flex-between-center">
                      <span className="text-base text-textGrayDark">
                        Tổng tiền vận chuyển
                      </span>
                      <span className="text-base ">
                        {defaultDataPay
                          ? formatMoney(
                              defaultDataPay.data.tom_tat_don_hang
                                .total_tien_ship
                            )
                          : formatMoney(0)}
                      </span>
                    </li>
                    <li className="item flex-between-center">
                      <span className="text-base text-textGrayDark">
                        Giảm giá Voucher
                      </span>
                      <span className="text-base ">
                        {formatMoney(giam_gia_voucher)}
                        {/* {defaultDataPay
                          ? formatMoney(
                              defaultDataPay.data.tom_tat_don_hang
                                .total_giam_gia_voucher
                            )
                          : formatMoney(0)} */}
                      </span>
                    </li>
                    <li className="item flex-between-center">
                      <span className="text-base text-textGrayDark">
                        Tiền vận chuyển
                      </span>
                      <span className="text-base ">
                        {defaultDataPay
                          ? formatMoney(
                              defaultDataPay.data.tom_tat_don_hang
                                .total_tien_ship
                            )
                          : formatMoney(0)}
                      </span>
                    </li>
                    <li className="item flex-between-center">
                      <span className="text-base font-medium">
                        Tổng thanh toán
                      </span>
                      <span className="title-24 text-accentColor font-medium">
                        {tong_tien ? formatMoney(tong_tien) : formatMoney(0)}
                      </span>
                    </li>
                  </ul>
                  {/* act payment */}
                  <BtnPrimary
                    content="Đặt hàng"
                    className="btnPay--order mt-3 float-right "
                    onClick={handleSubmitPay}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div
        className={clsx(
          "popup--voucherFixed fixed inset-0 z-[100] flex-center bg-black/30 transition-all-300-ease",
          openPopupVoucher && "opacity-0 invisible"
        )}
        onClick={() => setOpenPopupVoucher((prev) => !prev)}
      >
        <div
          className="popup--voucherMain w-[50%] min-w-[700px] p-7 rounded-md bg-white h-[400px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="scroll overflow-y-auto h-full">
            {voucherList && (
              <ul className="list--voucher grid grid-cols-3 gap-base">
                {voucherList.map((code) => (
                  <PromoCodeItem code={code} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div> */}
      {/* news popup  */}
      <div
        className={clsx(
          "voucher--popup fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-all-300-ease",
          !openPopupVoucher ? "opacity-0 invisible" : ""
        )}
        onClick={() => setOpenPopupVoucher((prev) => !prev)}
      >
        <div
          className="bg-white rounded-lg w-[90%] max-h-[95vh]  max-w-lg p-6 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="title text-lg">Chọn voucher</div>
          <div className="voucher--list mt-5 flex flex-col gap-y-3">
            {voucherList === null && <ErrorBlock />}
            {voucherList !== null && voucherList.length === 0 && (
              <MessageBlock content="Hiện không có voucher" />
            )}
            {voucherList !== null &&
              voucherList.length > 0 &&
              voucherList.map((vc) => (
                <VoucherPayItem
                  code={vc}
                  setGiam_gia_voucher={setGiam_gia_voucher}
                  setId_km={setId_km}
                />
              ))}
          </div>
        </div>
      </div>
      ;
    </section>
  );

  // overflow-y-auto style-scroll-1
}
