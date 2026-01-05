"use client";
import ImgLazy from "@/app/components/shared/Imglazy";
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import BtnSecondary from "@/app/components/user/button/BtnSecondary";
import { TypeUserInfo } from "@/app/types/user";
import React, { useState } from "react";
import { Fancybox, Carousel } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import useFancybox from "@/app/hook/useFancybox";

export default function UpdateInfoUser({
  infoUser,
}: {
  infoUser: TypeUserInfo;
}) {
  const [fancyboxRef] = useFancybox({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    infoUser ? infoUser.hinh : null
  );
  const [useName, setUserName] = useState<string | null>(
    infoUser ? infoUser.ho_ten : null
  );

  const handleSetImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    setAvatarPreview(previewURL);
  };

  const handleValidatorPhone = (val: string) => {};
  return (
    <div className="user--info bg-white p-6 rounded-md shadow-[1px_1px_5px_rgba(0,0,0,0.15)]">
      {/* Header */}
      <div className="user--header border-b border-bd-primary pb-3 mb-4">
        <h1 className="text-xl font-medium text-gray-800">Hồ sơ của tôi</h1>
        <p className="text-sm text-gray-500">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
      </div>

      {/* Content */}
      <div className="user--main grid grid-cols-12 gap-6">
        {/* Left */}
        <div className="col-span-12 md:col-span-8">
          <div className="user--infoMain flex flex-col gap-y-4">
            <div className="flex-y-center gap-x-5">
              <label className="w-32 text-sm text-gray-500 text-right">
                Tên đăng nhập
              </label>
              <span className="user--name text-base font-semibold">
                {infoUser ? infoUser.ho_ten : "???"}
              </span>
            </div>
            <div className="flex-y-center gap-x-5">
              <label className="w-32 text-sm text-gray-500 text-right">
                Tên
              </label>
              <input
                defaultValue={infoUser ? infoUser.ho_ten : "???"}
                className="flex-1 border px-3 py-2 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {/* <div className="flex-y-center gap-x-5">
                      <label className="w-32 text-sm text-gray-500 text-right">
                        Email
                      </label>
                      <span className="mr-3 text-sm">Ti******@gmail.com</span>
                      <button className="text-blue-500 text-sm hover:underline">
                        Thay đổi
                      </button>
                    </div> */}
            <div className="flex-y-center gap-x-5">
              <label className="w-32 text-sm text-gray-500 text-right">
                Số điện thoại
              </label>
              <div className="block--inp flex gap-x-2 flex-1">
                <input
                  type="text"
                  className="flex-1 border px-3 py-2 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  defaultValue={infoUser ? infoUser.dien_thoai : "???"}
                  onChange={(e) => handleValidatorPhone(e.target.value)}
                />
                {/* <span className="mr-3 text-sm">
                        
                      </span> */}
                {infoUser && !infoUser.dien_thoai && (
                  <button className="text-blue-500 text-sm hover:underline">
                    Cập nhật
                  </button>
                )}
              </div>
            </div>

            {/* <div className="flex-y-center gap-x-5">
                      <label className="w-32 text-sm text-gray-500 text-right">
                        Giới tính
                      </label>
                      <div className="flex gap-6 text-sm">
                        <label className="flex-y-center gap-x-5 gap-2">
                          <input type="radio" name="gender" />
                          Nam
                        </label>
                        <label className="flex-y-center gap-x-5 gap-2">
                          <input type="radio" name="gender" defaultChecked />
                          Nữ
                        </label>
                        <label className="flex-y-center gap-x-5 gap-2">
                          <input type="radio" name="gender" />
                          Khác
                        </label>
                      </div>
                    </div> */}

            {/* <div className="flex-y-center gap-x-5">
                      <label className="w-32 text-sm text-gray-500 text-right">
                        Ngày sinh
                      </label>
                      <span className="mr-3 text-sm"></span>
                      <button className="text-blue-500 text-sm hover:underline">
                        Thay đổi
                      </button>
                    </div> */}
          </div>
          <div className="wrap--btnSubmit flex gap-x-5 mt-7">
            <div className="w-32"></div>
            <BtnPrimary content="Lưu" />
          </div>
        </div>

        {/* Right */}
        <div className="user--avatar col-span-12 md:col-span-4 flex flex-col items-center border-l">
          <div ref={fancyboxRef} className="avatar">
            <a
              href={
                avatarPreview ? avatarPreview : "/images/avatar-default.png"
              }
              data-fancybox
              className="avatar--fancybox inline-block w-24 h-24 rounded-full overflow-hidden border border-bd-primary"
            >
              <ImgLazy
                src={
                  avatarPreview ? avatarPreview : "/images/avatar-default.png"
                }
                alt="img user"
                className="img-full"
                wrapperClassName="inline-block w-full h-full"
                data-fancybox
              />
            </a>
          </div>

          <BtnSecondary
            content="Chọn ảnh"
            className="relative px-4 py-2 mt-4 text-sm"
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 z-2 cursor-pointer"
              onChange={handleSetImg}
            />
          </BtnSecondary>
        </div>
      </div>
    </div>
  );
}
