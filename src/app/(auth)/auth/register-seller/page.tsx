"use client";
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import shopServices from "@/app/services/shopServices";
import shopServicesServer from "@/app/services/shopServices-server";
import { ApiError } from "@/app/types/type";
import { validatorString } from "@/app/utils/form";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function RegisterShop() {
  const router = useRouter();
  const [errForm, setErrForm] = useState({ ten_shop: "" });
  const [isvalid, setIsValid] = useState({ ten_shop: false });
  const [ten_shop, setTen_shop] = useState<string>("");
  const handleValidatorTenShop = (val: string) => {
    setTen_shop(val);
    const isValid = validatorString(
      val,
      (errMsg) => {
        setErrForm((prev) => ({ ...prev, ten_shop: errMsg }));
      },
      {
        maxLength: 255,
        minLength: 10,
      }
    );
    setIsValid((prev) => ({ ...prev, ten_shop: isValid }));
  };
  const handleRegisterShop = async () => {
    handleValidatorTenShop(ten_shop);
    if (!isvalid.ten_shop) return;
    try {
      const res = await shopServices.registerShop({ ten_shop });
      if (!res.success) return;
      toast.success("Đăng ký Shop thành công.");
      setTimeout(() => {
        router.push("/?is_login=true");
      }, 1000);
    } catch (err) {
      console.log(err);
      const error = err as ApiError;
      toast.error(error.message);
    }
  };
  return (
    <section className="section--login h-full">
      <div className="flex-center h-full">
        <div className="container">
          <div className="row justify-center">
            <div className="col-8 relative z-10">
              <div className="login group bg-white overflow-hidden rounded-[20px] grid grid-cols-2">
                <div className="">
                  <div className="login--bg h-full bg-[url('/images/auth/bg-left-form.png')] bg-no-repeat bg-center bg-contain"></div>
                </div>
                <div className="login--main p-[28px_20px]">
                  {/* title */}
                  <div className="login--title relative pb-2 inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-[35%] after:bg-accentColor after:h-[3.5px] after:clip-line-title after:transition-all-300-ease group-hover:after:w-[55%]">
                    <h1 className="title-24 text-accentColor">Đăng ký shop</h1>
                    <span className="text-[13px] mt-1">
                      Đăng ký Shop để tiếp tục
                    </span>
                  </div>
                  {/* form */}
                  <div className="login--form mt-10">
                    <div className="block--inp relative mt-4">
                      <input
                        type="text"
                        placeholder="Tên shop"
                        className="w-full h-[42px] p-[7px_12px] rounded-lg border border-gray-300 outline-none placeholder:text-sm"
                        onChange={(e) => handleValidatorTenShop(e.target.value)}
                      />
                      {errForm.ten_shop && (
                        <span className={clsx("err--form")}>
                          {errForm.ten_shop}
                        </span>
                      )}
                    </div>
                    {/* <Link
                      href="#!"
                      className="float-right mt-2 text-xs text-accentColor clear-both"
                    >
                      Quên mật khẩu
                    </Link> */}
                    <BtnPrimary
                      content="Đăng ký"
                      className="w-full mt-4"
                      onClick={() => {
                        handleRegisterShop();
                      }}
                    />
                  </div>
                  {/* method */}
                  {/* <div className="login--method mt-4">
                    <div className="login--method__title text-sm text-[#A8A8A8] text-center">
                      Hoặc
                      <br /> Đăng nhập bằng
                    </div>
                    <div className="login--method__main flex-x-center gap-x-4 mt-4">
                      <div className="method--facebook w-8 h-8 rounded-full flex-center bg-[#3B589C] cursor-pointer select-none">
                        <FaFacebookF className="text-sm text-white" />
                      </div>
                      <div className="method--google w-8 h-8 rounded-full flex-center bg-white border border-[#bababa] cursor-pointer select-none">
                        <FcGoogle className="text-base text-white" />
                      </div>
                    </div>
                    <div className="mt-5 text-sm text-center">
                      <span className="text-[#A8A8A8]">
                        Bạn mới biết đến DATN?{" "}
                      </span>
                      <Link href="#!" className="text-accentColor font-medium">
                        Đăng ký
                      </Link>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
