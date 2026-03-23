"use client";
import Link from "next/link";
import { useState, useRef, ChangeEvent, useEffect } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

// icons
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

// components
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import { toast } from "react-toastify";
import validator from "validator";

// services
import fetchApi from "@/app/utils/fetchApi";

// hook custom
import useEffectAfterMount from "@/app/hook/useEffectAfterMount";

// form
import { validatorEmailAndPhone, validatorPasswword } from "@/app/utils/form";

//type
import { ApiError } from "@/app/types/type";
import { useFilter } from "@/app/hook/useFilter";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");

  //err
  const [errMail, setErrMail] = useState<string>("");
  const [errPass, setErrPass] = useState<string>("");

  // valid
  const [validInputs, setValidInputs] = useState({
    email: false,
    pass: false,
  });

  //email + phone
  useEffectAfterMount(() => {
    setValidInputs((prev) => ({
      ...prev,
      email: validatorEmailAndPhone(email, (errMsg) => {
        setErrMail(errMsg);
      }),
    }));
  }, [email]);

  // pass
  useEffectAfterMount(() => {
    setValidInputs((prev) => ({
      ...prev,
      pass: validatorPasswword(pass, (errMsg) => {
        setErrPass(errMsg);
      }),
    }));
  }, [pass]);

  // call api
  const handleLogin = async () => {
    if (validInputs.email && validInputs.pass) {
      try {
        const res = await fetchApi("/dang-nhap", "POST", {
          tai_khoan: email,
          mat_khau: pass,
        });
        if (res.status === 200 && res.success) {
          const data = res.data.user;
          toast.success("Đăng nhập thành công!");
          localStorage.setItem(
            "infoUser",
            JSON.stringify({
              ho_ten: data.ho_ten,
              tai_khoan: data.tai_khoan,
              vai_tro: data.vai_tro,
              email: data.email,
              hinh: data.hinh,
            })
          );
          setTimeout(() => {
            router.push("/?is_login=true");
          }, 1000);
        }
      } catch (err) {
        const error = err as ApiError;
        toast.error(error.message);
      }
    }
  };

  // render
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
                    <h1 className="title-24 text-accentColor">Đăng nhập</h1>
                    <span className="text-[13px] mt-1">
                      Vui lòng đăng nhập để tiếp tục
                    </span>
                  </div>
                  {/* form */}
                  <div className="login--form mt-10">
                    <div className="block--inp">
                      <input
                        type="text"
                        placeholder="Email, số điện thoại, tên đăng nhập"
                        className="w-full h-[42px] p-[7px_12px] rounded-lg border border-gray-300 outline-none placeholder:text-sm"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <span className={clsx("err--form", !errMail && "hidden")}>
                        {errMail}
                      </span>
                    </div>
                    <div className="block--inp relative mt-4">
                      <input
                        type="text"
                        placeholder="Mật khẩu"
                        className="w-full h-[42px] p-[7px_12px] rounded-lg border border-gray-300 outline-none placeholder:text-sm"
                        onChange={(e) => setPass(e.target.value)}
                      />
                      <span className={clsx("err--form", !errPass && "hidden")}>
                        {errPass}
                      </span>
                    </div>
                    <Link
                      href="#!"
                      className="float-right mt-2 text-xs text-accentColor clear-both"
                    >
                      Quên mật khẩu
                    </Link>
                    <BtnPrimary
                      content="Đăng nhập"
                      className="w-full mt-4"
                      onClick={() => {
                        handleLogin();
                      }}
                    />
                  </div>
                  {/* method */}
                  <div className="login--method mt-4">
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
                      <Link
                        href="/auth/register"
                        className="text-accentColor font-medium"
                      >
                        Đăng ký
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
//   <div className="login--bg ratio-box ratio-1_1 bg-[url('/images/auth/bg-left-form.png')] bg-no-repeat bg-center bg-contain"></div>
