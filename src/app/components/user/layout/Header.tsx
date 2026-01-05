import Link from "next/link";

// icon
import {
  CiBellOn,
  CiHeadphones,
  CiGlobe,
  CiSearch,
  CiUser,
  CiHeart,
  CiShoppingCart,
} from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";

// components
import ImgLazy from "../../shared/Imglazy";
import { ApiError } from "@/app/types/type";
import cartServices from "@/app/services/cartServices";
import HeaderSearch from "../search/HeaderSearch";
// import { useState } from "react";

export default function Header() {
  // const [countCart, setCountCart] = useState<number>(0);
  // const handleCountCart = async () => {
  //   const cartLocalStr = localStorage.getItem("cartLocal");
  //   const cartLocal = cartLocalStr ? JSON.parse(cartLocalStr) : null;
  //   if (!cartLocal) {
  //     setCountCart(cartLocal.length);
  //     return;
  //   }
  //   try {
  //     const res = await cartServices.getAll();
  //     console.log(res);
  //   } catch (err) {
  //     const error = err as ApiError;
  //     if (error.status === 401) {
  //       setCountCart(cartLocal.length);
  //     }
  //     console.log(err);
  //   }
  // };
  // handleCountCart();

  return (
    <header className="header">
      <div className="container">
        {/* top */}
        <div className="header--top flex items-center justify-between py-[10px] border-b border-borderDeffault">
          {/* seller nav   */}
          <ul className="seller flex items-center gap-x-1.5">
            <li className="text-sm ">
              <Link href="#!" className="text-[#6B7280] font-medium">
                Kênh người bán
              </Link>
            </li>
            <li className="h-4 border-l border-borderDeffault "></li>
            <li className="text-sm text-[#6B7280]">
              <Link href="#!" className="text-accentColor font-medium">
                Trở thành người bán
              </Link>
            </li>
          </ul>

          {/* header action */}
          <ul className="header--action flex items-center gap-x-5">
            <li className="flex items-center gap-x-1">
              <CiBellOn className="w-6 h-6" />
              <span className="text-sm font-medium">Thông báo</span>
            </li>
            <li className="flex items-center gap-x-1">
              <CiHeadphones className="w-6 h-6" />
              <span className="text-sm font-medium">Hỗ trợ</span>
            </li>
            <li className="flex items-center gap-1.5 relative group">
              <div className="flex items-center gap-x-1">
                <CiGlobe className="w-6 h-6" />
                <span className="text-sm font-medium">Tiếng Việt</span>
              </div>
              <IoIosArrowDown className="w-4 h-4 fill-[#4E4E4E]" />
              {/* dropdown language */}
              <div className="dropdown--language absolute z-10 opacity-0 invisible top-[calc(100%+10px)] right-0 w-full translate-y-2 transition-all duration-[0.2s] group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible after:content-[''] after:block after:w-full after:h-3.5 after:absolute after:bottom-full after:left-0">
                <ul className="overflow-hidden shadow-md rounded-[4px] after:content-[''] after:absolute after:border-l-8 after:border-r-8 after:border-b-8 after:border-l-transparent after:border-r-transparent after:border-b-accentColor after:bottom-full after:right-1.5">
                  <li className="capitalize p-[6px_8px] text-sm bg-primaryColor cursor-pointer hover:bg-[#e3f4ff] transition-colors duration-[0.15s] ">
                    Tiếng Việt
                  </li>
                  <li className="capitalize p-[6px_8px] text-sm bg-primaryColor cursor-pointer hover:bg-[#e3f4ff] transition-colors duration-[0.15s] ">
                    Tiếng Anh
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        {/* bottom */}
        <div className="header--bottom grid grid-cols-12 items-center py-[10px] gap-x-base">
          {/* logo */}
          <div className="header--logo flex-y-center col-span-2 uppercase text-[28px] font-semibold">
            <Link href="/">
              <ImgLazy
                src="./images/logo-datn.png"
                alt="Logo Kadu"
                className="max-w-[75%]"
              />
            </Link>
          </div>
          {/* search */}
          <div className="header--search relative col-span-5">
            {/* header search  */}
            <HeaderSearch />
          </div>
          {/* control user */}
          <div className="header--controlUser col-span-5 flex justify-end">
            <ul className="flex-y-center gap-x-4">
              <li className="item">
                <Link href="/wishlist" className="relative">
                  <CiHeart className="w-8 h-8" />
                  <div className="count--cart flex-center absolute right-[-4px] top-0 w-4 h-4 rounded-full bg-accentColor text-[11px] text-white">
                    0
                  </div>
                </Link>
              </li>
              <li className="item">
                <Link href="/cart" className="relative">
                  <CiShoppingCart className="w-8 h-8" />
                  <div className="count--cart flex-center absolute right-[-4px] top-0 w-4 h-4 rounded-full bg-accentColor text-[11px] text-white">
                    0
                  </div>
                </Link>
              </li>
              <li className="item">
                <Link href="/user" className="relative">
                  <CiUser className="w-8 h-8" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
