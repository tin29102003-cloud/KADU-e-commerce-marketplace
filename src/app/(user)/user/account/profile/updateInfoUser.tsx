"use client";
import ImgLazy from "@/app/components/shared/Imglazy";
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import BtnSecondary from "@/app/components/user/button/BtnSecondary";
import { TypeUserInfo } from "@/app/types/user";
import React, { useEffect, useState } from "react";
import { Fancybox, Carousel } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import useFancybox from "@/app/hook/useFancybox";
import { validatorPhone, validatorString } from "@/app/utils/form";
import { toast } from "react-toastify";
import infoUserServices from "@/app/services/infoUserServices";
import clsx from "clsx";
import { ApiError } from "@/app/types/type";

export default function UpdateInfoUser({
  infoUser,
}: {
  infoUser: TypeUserInfo;
}) {
  console.log(infoUser.hinh);
  const [fancyboxRef] = useFancybox({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    infoUser ? infoUser.hinh : null
  );
  const [useName, setUserName] = useState<string>(infoUser.ho_ten);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [phone, setPhone] = useState<string | number>(infoUser.dien_thoai);
  const [errForm, setErrForm] = useState({ userName: "", phone: "", img: "" });
  const BASE_URL_SERVER = process.env.NEXT_PUBLIC_HOST_BACKEND;
  const handleSetImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);
  const handleValidatorUserName = (val: string) => {
    setUserName(val);
    validatorString(val, (errMsg) => {
      setErrForm((prev) => ({ ...prev, userName: errMsg }));
    });
  };

  const handleValidatorPhone = (val: string) => {
    setPhone(val);
    validatorPhone(val, (errMsg) => {
      setErrForm((prev) => ({ ...prev, phone: errMsg }));
    });
  };

  const handleSubmit = async () => {
    console.log(avatarFile);
    const isUserNameChanged = useName !== infoUser.ho_ten;
    const isPhoneChanged = phone !== infoUser.dien_thoai;
    const isAvatarChanged = !!avatarFile;
    if (!isUserNameChanged && !isPhoneChanged && !isAvatarChanged) {
      toast.warning("Không có sự thay đổi.");
      return;
    }

    if (isUserNameChanged && errForm.userName) return;
    if (isPhoneChanged && errForm.phone) return;
    const formData = new FormData();
    // if (avatarFile) {
    formData.append("hinh_user", avatarFile ? avatarFile : "");
    // }
    // if (isUserNameChanged) {
    formData.append("ho_ten", useName);
    // }
    // if (isPhoneChanged) {
    formData.append("dien_thoai", String(phone));
    // }
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
    // console.log(avatarFile);
    // console.log(useName);
    // console.log(phone);
    try {
      const res = await infoUserServices.updateInfoUser(formData);
      if (!res.success) return;
      toast.success("Cập nhật thông tin thành công.");
      console.log(res);
      // const getInfoUser = JSON.parse(
      //   localStorage.getItem("infoUser") ?? "null"
      // );

      // const changeData = {
      //   ...getInfoUser,
      //   ho_ten: useName,
      //   hinh: !avatarFile ? BASE_URL_SERVER! + avatarPreview : avatarPreview!,
      // };
      // localStorage.setItem("infoUser", JSON.stringify(changeData));
    } catch (err) {
      console.log(err);
      const error = err as ApiError;
      if (error.status === 400) {
        toast.error(error.message);
      } else {
        toast.error("Lỗi không xác định");
      }
    }
  };

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
              <div className="block--inp flex-1">
                <input
                  defaultValue={infoUser ? infoUser.ho_ten : "???"}
                  className="w-full border px-3 py-2 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => handleValidatorUserName(e.target.value)}
                />
                <span
                  className={clsx("err--form", !errForm.userName && "hidden")}
                >
                  {errForm.userName}
                </span>
              </div>
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
              <div className="block--inp flex-1">
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  defaultValue={infoUser ? infoUser.dien_thoai : "???"}
                  onChange={(e) => handleValidatorPhone(e.target.value)}
                />
                <span className={clsx("err--form", !errForm.phone && "hidden")}>
                  {errForm.phone}
                </span>
                {/* <span className="mr-3 text-sm">
                        
                      </span> */}
                {/* {infoUser && !infoUser.dien_thoai && (
                  <button className="text-blue-500 text-sm hover:underline">
                    Cập nhật
                  </button>
                )} */}
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
            <BtnPrimary content="Lưu" onClick={handleSubmit} />
          </div>
        </div>

        {/* Right */}
        <div className="user--avatar col-span-12 md:col-span-4 flex flex-col items-center border-l">
          <div ref={fancyboxRef} className="avatar">
            <a
              href={
                !avatarFile ? BASE_URL_SERVER! + avatarPreview : avatarPreview!
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
                connectHost={!avatarFile}
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
