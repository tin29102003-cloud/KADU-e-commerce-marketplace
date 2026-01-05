import Image from "next/image";
import ImgLazy from "../shared/Imglazy";
import { CiChat1, CiShop } from "react-icons/ci";
import Link from "next/link";
import BtnPrimary from "./button/BtnPrimary";

export default function OrderItem() {
  return (
    <div className="order--item bg-white rounded-lg border border-bd-primary">
      {/* Header */}
      <div className="order--header flex justify-between items-center py-4 px-6 border-b border-bd-primary">
        <div className="flex items-center gap-x-2">
          {/* <span className="text-sm text-blue-500 cursor-pointer">
            Yêu thích
          </span> */}
          <span className="order--name text-base font-semibold">
            Dầu nhớt Sài Gòn
          </span>
        </div>
        <div className="header--action flex items-center gap-x-3 text-sm text-neutral-600">
          <button className="action--chat flex-y-center gap-x-1 text-sm text-textGrayDark px-2 py-1 rounded-[4px] border border-bd-primary hover:bg-primaryColor hover:text-accentColor transition-all-300-ease ">
            <CiChat1 className="text-base stroke-[1px]" />
            Chat
          </button>
          <Link
            href="/shop/"
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
          CHỜ GIAO HÀNG
        </span>
      </div>

      {/* Product */}
      <ul className="orderPrd--list">
        <li className="orderPrd--item flex gap-x-4">
          <div className="w-20 h-20 border rounded-md overflow-hidden">
            <ImgLazy src="/product/product-1.png" alt="sp-1" />
          </div>

          <div className="flex-1">
            <div className="font-medium text-neutral-800">
              Nhớt tổng hợp 100% xe tay ga MOTUL đổ vào là bốc xe
            </div>
            <div className="text-sm text-neutral-500 mt-1">
              Phân loại hàng: 800ML (Mới 2025)
            </div>
            <div className="text-sm text-neutral-600 mt-1">x1</div>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="line-through text-sm text-neutral-400">50.000đ</div>
            <div className="text-blue-500 font-medium">30.000đ</div>
          </div>
        </li>
      </ul>

      {/* Footer */}
      <div className="order--footer">
        <div className="block--footerInfo flex-between-center gap-x-3 px-6 py-3.5 bg-neutral-50/70 border-y border-bd-primary">
          <div className="text-sm text-neutral-500">
            Nhận sản phẩm và thanh toán trước (29/09/2025)
          </div>
          <div className="total--amount flex-y-center gap-x-1 text-sm">
            Thành tiền:
            <span className="text-lg text-accentColor font-semibold ">
              15.000đ
            </span>
          </div>
        </div>
        <div className="blockBtn--contactSeller flex justify-end px-6 py-3.5">
          <BtnPrimary content="Liên hệ người bán" className="px-6 py-2" />
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
