"use client";
import Link from "next/link";

// icons
import { GoPencil } from "react-icons/go";
import { CiBellOn } from "react-icons/ci";
import { IoIosArrowForward } from "react-icons/io";

// components
import ImgLazy from "../shared/Imglazy";
import { useEffect, useState } from "react";
import { TypeUserInfo, TypeUserInfoLocal } from "@/app/types/user";
import userServiceServer from "@/app/services/userService-server";
import userService from "@/app/services/userServices";

export default function AccountSidebar() {
  const [infoUser, setInfoUser] = useState<TypeUserInfo | null>();
  useEffect(() => {
    (async () => {
      try {
        const res = await userService.getInfoUser();
        if (!res.status) return;
        setInfoUser(res.data.taiKhoan);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <div className="accounrt--sidebar col-3">
      <div className="border border-bd-primary h-full">
        {/* user info */}
        <div className="user--info flex-y-center gap-x-2 p-[20px_16px] border-b border-bd-primary">
          <div className="user--info__avata w-10 h-10 rounded-full ratio-box">
            <ImgLazy
              src={infoUser && infoUser.hinh ? infoUser.hinh : ""}
              connectHost={true}
              alt="avatar"
              className="img-full"
            />
          </div>
          <div className="user--info__main">
            <span className="text-base font-semibold">
              {infoUser && infoUser.ho_ten}
            </span>
            <div className="edit--profile flex-y-center gap-x-1">
              <GoPencil className="text-sm text-textGrayDark" />
              <span className="text-xs text-textGrayDark">Sửa hồ sơ</span>
            </div>
          </div>
        </div>
        {/*  */}
        <ul className="user--menu px-[5px] py-3">
          <li className="user--menu__item">
            {/* title */}
            <div className="menu--title flex-between-center p-1 cursor-pointer select-none">
              <div className="flex-y-center gap-x-1 text-textGrayDark">
                {/* <CiBellOn className="text-2xl " /> */}
                <Link href="/user/account/profile" className="text-sm">
                  Hồ sơ
                </Link>
              </div>
              {/* <IoIosArrowForward className="arrow--show text-xl" /> */}
            </div>
            {/* mega menu */}
            {/* <ul className="mega--menu pl-[26px] flex flex-col gap-y-2">
              <li className="mega--menu__item text-textGrayDark text-sm">
                <Link href="#!">Hồ sơ</Link>
              </li>
              <li className="mega--menu__item text-textGrayDark text-sm">
                <Link href="/user/account/address">Địa chỉ</Link>
              </li>
              <li className="mega--menu__item text-textGrayDark text-sm">
                <Link href="#!">Đổi mật khẩu</Link>
              </li>
              <li className="mega--menu__item text-textGrayDark text-sm">
                <Link href="#!">Cài đặt thông báo</Link>
              </li>
              <li className="mega--menu__item text-textGrayDark text-sm">
                <Link href="#!">Thiết lập riêng tư</Link>
              </li>
            </ul> */}
          </li>
          <li className="user--menu__item">
            {/* title */}
            <div className="menu--title flex-between-center p-1 cursor-pointer select-none">
              <div className="flex-y-center gap-x-1 text-textGrayDark">
                {/* <CiBellOn className="text-2xl " /> */}
                <Link href="/user/account/address" className="text-sm">
                  Địa chỉ
                </Link>
              </div>
              {/* <IoIosArrowForward className="arrow--show text-xl" /> */}
            </div>
            {/* mega menu */}
            {/* <ul className="mega--menu pl-[26px] flex flex-col gap-y-2">
              <li className="mega--menu__item text-textGrayDark text-sm">
                <Link href="#!">Hồ sơ</Link>
              </li>
              <li className="mega--menu__item text-textGrayDark text-sm">
                <Link href="/user/account/address">Địa chỉ</Link>
              </li>
              <li className="mega--menu__item text-textGrayDark text-sm">
                <Link href="#!">Đổi mật khẩu</Link>
              </li>
              <li className="mega--menu__item text-textGrayDark text-sm">
                <Link href="#!">Cài đặt thông báo</Link>
              </li>
              <li className="mega--menu__item text-textGrayDark text-sm">
                <Link href="#!">Thiết lập riêng tư</Link>
              </li>
            </ul> */}
          </li>
          <li className="user--menu__item">
            {/* title */}
            <div className="menu--title flex-between-center p-1 cursor-pointer select-none">
              <div className="flex-y-center gap-x-1 text-textGrayDark">
                {/* <CiBellOn className="text-2xl " /> */}
                <Link href="/user/order" className="text-sm">
                  Đơn hàng
                </Link>
              </div>
              {/* <IoIosArrowForward className="arrow--show text-xl" /> */}
            </div>
            {/* mega menu */}
            {/* <ul className="mega--menu pl-[26px] flex flex-col gap-y-2">
              <li className="mega--menu__item text-textGrayDark text-sm">
                <Link href="#!">Hồ sơ</Link>
              </li>
              <li className="mega--menu__item text-textGrayDark text-sm">
                <Link href="/user/account/address">Địa chỉ</Link>
              </li>
              <li className="mega--menu__item text-textGrayDark text-sm">
                <Link href="#!">Đổi mật khẩu</Link>
              </li>
              <li className="mega--menu__item text-textGrayDark text-sm">
                <Link href="#!">Cài đặt thông báo</Link>
              </li>
              <li className="mega--menu__item text-textGrayDark text-sm">
                <Link href="#!">Thiết lập riêng tư</Link>
              </li>
            </ul> */}
          </li>
        </ul>
      </div>
    </div>
  );
}
