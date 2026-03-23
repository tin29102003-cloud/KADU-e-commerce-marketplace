import Link from "next/link";
// import { useRef } from "react";

// icons
import { IoMdArrowDropdown } from "react-icons/io";
import { CiShop, CiChat1 } from "react-icons/ci";

// components
import ImgLazy from "../shared/Imglazy";
import { TypeItemCheckout, TypeProduct } from "@/app/types/type";
import { formatMoney } from "@/app/utils/helper";

export default function CartCheckoutItem({
  product,
}: {
  product: TypeItemCheckout;
}) {
  return (
    <li className="cart--prd flex gap-x-3 py-3 border-b border-bd-primary last:border-none">
      <div className="cart--thumb">
        <Link href="#!" className="block w-20 h-20 rounded-lg overflow-hidden ">
          <ImgLazy
            src={product.img}
            alt="sản phẩm 1"
            className="img-full"
            connectHost={true}
          />
        </Link>
      </div>
      <div className="cart--info flex flex-col">
        <div className="cart--info__name">
          <div className="cart--name text-[15px] font-medium line-clamp-2">
            <Link href="#!">{product.ten_sp}</Link>
          </div>
        </div>
        {/* <span className="cart--classify mt-1 text-xs font-medium text-textGrayDark">
        </span> */}
        <div className="cart--quantity mt-2 text-sm font-medium ">
          <span className="text-textGrayDark">Số lượng: </span>
          <span>{product.so_luong}</span>
        </div>
        <span className="cart--price mt-1 text-base text-accentColor font-semibold ">
          {product.thanh_tien ? formatMoney(product.thanh_tien) : "???"}
        </span>
      </div>
    </li>
  );
}
