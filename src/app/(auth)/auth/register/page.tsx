"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import clsx from "clsx";

// icons
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
// components
import BtnPrimary from "@/app/components/user/button/BtnPrimary";

// hook
import useEffectAfterMount from "@/app/hook/useEffectAfterMount";

import {
  validatorEmail,
  validatorPasswword,
  validatorPhone,
} from "@/app/utils/form";
import fetchApi from "@/app/utils/fetchApi";
import { toast } from "react-toastify";
import { ApiError } from "next/dist/server/api-utils";

export default function Regiter() {
  const router = useRouter();
  // data form
  const [email, setEmail] = useState<string>("");
  const [tai_khoan, setTai_khoan] = useState<string>("");
  const [mat_khau, setMat_khau] = useState<string>("");
  const [mat_khau_nhap_lai, setMat_khau_nhap_lai] = useState<string>("");
  const [dien_thoai, setDien_thoai] = useState<string>("");

  // recheck
  const [recheck, setRecheck] = useState<number>(0);
  //err
  const [errForm, setErrForm] = useState({
    email: "",
    tai_khoan: "",
    mat_khau: "",
    mat_khau_nhap_lai: "",
    dien_thoai: "",
  });

  // check
  const [validInp, setValidInp] = useState({
    tai_khoan: false,
    email: false,
    mat_khau: false,
    mat_khau_nhap_lai: false,
    dien_thoai: false,
  });

  useEffectAfterMount(() => {
    setValidInp((prev) => ({
      ...prev,
      email: validatorEmail(email, (errMsg) => {
        setErrForm((prev) => ({ ...prev, email: errMsg }));
      }),
    }));
  }, [email, recheck]);

  //tai_khoan
  useEffectAfterMount(() => {
    if (tai_khoan.trim() === "") {
      setErrForm((prev) => ({ ...prev, tai_khoan: "Không được để trống" }));
      setValidInp((prev) => ({ ...prev, tai_khoan: false }));
    } else {
      setErrForm((prev) => ({ ...prev, tai_khoan: "" }));
      setValidInp((prev) => ({ ...prev, tai_khoan: true }));
    }
  }, [tai_khoan, recheck]);

  //pass
  useEffectAfterMount(() => {
    setValidInp((prev) => ({
      ...prev,
      mat_khau: validatorPasswword(mat_khau, (errMsg) => {
        setErrForm((prev) => ({ ...prev, mat_khau: errMsg }));
      }),
    }));
  }, [mat_khau, recheck]);

  // nhap lai
  useEffectAfterMount(() => {
    if (mat_khau_nhap_lai.trim() === "") {
      setErrForm((prev) => ({
        ...prev,
        mat_khau_nhap_lai: "Không được để trống",
      }));
      setValidInp((prev) => ({ ...prev, mat_khau_nhap_lai: false }));
    } else if (mat_khau_nhap_lai.trim() === mat_khau) {
      setErrForm((prev) => ({
        ...prev,
        mat_khau_nhap_lai: "",
      }));
      setValidInp((prev) => ({ ...prev, mat_khau_nhap_lai: true }));
    } else {
      setErrForm((prev) => ({
        ...prev,
        mat_khau_nhap_lai: "Mật khẩu không khớp",
      }));
      setValidInp((prev) => ({ ...prev, mat_khau_nhap_lai: false }));
    }
  }, [mat_khau_nhap_lai, mat_khau, recheck]);

  useEffectAfterMount(() => {
    setValidInp((prev) => ({
      ...prev,
      dien_thoai: validatorPhone(dien_thoai, (errMsg) => {
        setErrForm((prev) => ({ ...prev, dien_thoai: errMsg }));
      }),
    }));
  }, [dien_thoai, recheck]);

  // main register
  const handleRegister = async () => {
    setRecheck(1);
    if (
      !validInp.dien_thoai &&
      !validInp.email &&
      !validInp.mat_khau &&
      !validInp.mat_khau_nhap_lai &&
      !validInp.tai_khoan
    ) {
      return false;
    }
    try {
      const data = {
        dien_thoai,
        mat_khau,
        mat_khau_nhap_lai,
        tai_khoan,
        email,
      };
      const res = await fetchApi("/dang-ky", "POST", data);
      if (res.status === 200 && res.success) {
        setDien_thoai("");
        setEmail("");
        setMat_khau("");
        setMat_khau_nhap_lai("");
        setTai_khoan("");
        setRecheck(0);
        toast.success(
          "Đăng ký thành công!, vui lòng kiểm tra Email để xác thực"
        );
      }
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message);
    }
  };

  //
  return (
    <section className="section--register h-full">
      <div className="flex-center h-full">
        <div className="container">
          <div className="row justify-center">
            <div className="col-9 relative z-10">
              <div className="register group bg-white overflow-hidden rounded-[20px] grid grid-cols-2">
                <div className="">
                  <div className="register--bg h-full bg-[url('/images/auth/bg-left-form.png')] bg-no-repeat bg-center bg-contain"></div>
                </div>
                <div className="register--main p-[28px_20px]">
                  {/* title */}
                  <div className="login--title relative pb-2 inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-[35%] after:bg-accentColor after:h-[3.5px] after:clip-line-title after:transition-all-300-ease group-hover:after:w-[55%]">
                    <h1 className="title-24 text-accentColor">Đăng ký</h1>
                    <span className="text-[13px] mt-1">
                      Vui lòng đăng ký để tiếp tục
                    </span>
                  </div>
                  {/* form */}
                  <div className="register--form mt-10">
                    <div className="block--inp mt-4 first:mt-0">
                      <input
                        type="tel"
                        value={tai_khoan}
                        placeholder="Tên đăng ký"
                        className="w-full h-[42px] p-[7px_12px] rounded-lg border border-gray-300 outline-none placeholder:text-sm"
                        onChange={(e) => setTai_khoan(e.target.value)}
                      />
                      <span
                        className={clsx(
                          "err--form",
                          !errForm.tai_khoan && "hidden"
                        )}
                      >
                        {errForm.tai_khoan}
                      </span>
                    </div>
                    <div className="block--inp mt-4 first:mt-0">
                      <input
                        type="tel"
                        value={email}
                        placeholder="Email"
                        className="w-full h-[42px] p-[7px_12px] rounded-lg border border-gray-300 outline-none placeholder:text-sm"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <span
                        className={clsx(
                          "err--form",
                          !errForm.email && "hidden"
                        )}
                      >
                        {errForm.email}
                      </span>
                    </div>
                    <div className="block--inp mt-4 first:mt-0">
                      <input
                        type="tel"
                        value={mat_khau}
                        placeholder="Mật khẩu"
                        className="w-full h-[42px] p-[7px_12px] rounded-lg border border-gray-300 outline-none placeholder:text-sm"
                        onChange={(e) => setMat_khau(e.target.value)}
                      />
                      <span
                        className={clsx(
                          "err--form",
                          !errForm.mat_khau && "hidden"
                        )}
                      >
                        {errForm.mat_khau}
                      </span>
                    </div>
                    <div className="block--inp mt-4 first:mt-0">
                      <input
                        type="tel"
                        value={mat_khau_nhap_lai}
                        placeholder="Nhập lại mật khẩu"
                        className="w-full h-[42px] p-[7px_12px] rounded-lg border border-gray-300 outline-none placeholder:text-sm"
                        onChange={(e) => setMat_khau_nhap_lai(e.target.value)}
                      />
                      <span
                        className={clsx(
                          "err--form",
                          !errForm.mat_khau_nhap_lai && "hidden"
                        )}
                      >
                        {errForm.mat_khau_nhap_lai}
                      </span>
                    </div>
                    <div className="block--inp mt-4 first:mt-0">
                      <input
                        type="tel"
                        value={dien_thoai}
                        placeholder="Điện thoại"
                        className="w-full h-[42px] p-[7px_12px] rounded-lg border border-gray-300 outline-none placeholder:text-sm"
                        onChange={(e) => setDien_thoai(e.target.value)}
                      />
                      <span
                        className={clsx(
                          "err--form",
                          !errForm.dien_thoai && "hidden"
                        )}
                      >
                        {errForm.dien_thoai}
                      </span>
                    </div>
                    <BtnPrimary
                      content="Đăng ký"
                      className="w-full mt-4"
                      onClick={() => handleRegister()}
                    />
                  </div>
                  {/* method */}
                  <div className="register--method mt-4">
                    <div className="register--method__title text-sm text-[#A8A8A8] text-center">
                      Hoặc
                      <br /> Đăng ký bằng
                    </div>
                    <div className="register--method__main flex-x-center gap-x-4 mt-4">
                      <div className="method--facebook w-8 h-8 rounded-full flex-center bg-[#3B589C] cursor-pointer select-none">
                        <FaFacebookF className="text-sm text-white" />
                      </div>
                      <div className="method--google w-8 h-8 rounded-full flex-center bg-white border border-[#bababa] cursor-pointer select-none">
                        <FcGoogle className="text-base text-white" />
                      </div>
                    </div>
                    <div className="mt-5 text-sm text-center">
                      <span className="text-[#A8A8A8]">
                        Bạn đã có tài khoản{" "}
                      </span>
                      <Link href="#!" className="text-accentColor font-medium">
                        Đăng nhập
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
