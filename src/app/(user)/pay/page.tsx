import Link from "next/link";

// icons
import { CiDiscount1, CiLocationOn } from "react-icons/ci";
import { LiaShippingFastSolid } from "react-icons/lia";
import { MdPayment } from "react-icons/md";

// components
// import CartBlock from "@/app/components/user/CartBlock";
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import BtnSecondary from "@/app/components/user/button/BtnSecondary";
import SectionPay from "./sectionPay";
import addressServicesServer from "@/app/services/addressServices-server";
import { TypeAddressItem, TypeMethodPayItem } from "@/app/types/type";
import voucherServcesServer from "@/app/services/voucherServices-server";
import { TypePromoCode } from "@/app/types/promoCode";
import payServices from "@/app/services/payServices";
import payServicesServer from "@/app/services/payServices-server";

export default async function Pay() {
  const result = await Promise.allSettled([
    addressServicesServer.getAddressDefault(),
    voucherServcesServer.getAll(),
    payServicesServer.getAllMethodPay(),
  ]);

  const [defaultDataAddress, voucherListRes, listMethodPayRes] = result;
  const addressDefault =
    defaultDataAddress.status === "fulfilled"
      ? defaultDataAddress.value.data.data
      : null;
  const voucherList: TypePromoCode[] =
    voucherListRes.status === "fulfilled"
      ? voucherListRes.value.data.data
      : null;

  const listMethodPay: TypeMethodPayItem[] =
    listMethodPayRes.status === "fulfilled"
      ? listMethodPayRes.value.data.data
      : null;
  return (
    <SectionPay
      dataAddress={addressDefault}
      voucherList={voucherList}
      listMethodPay={listMethodPay}
    />
  );
}
