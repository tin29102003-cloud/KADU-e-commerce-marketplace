"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// icons
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowForward } from "react-icons/io";

// components
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import TitleSection from "@/app/components/user/TitleSection";

//
import fetchApi from "@/app/utils/fetchApi";

export default function RegisterNext() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  //
  useEffect(() => {
    const email = sessionStorage.getItem("email") || "";
    if (!email) router.push("/auth/register");
    nextInpCode();
    setEmail(sessionStorage.getItem("email") as string);
    // step
    sessionStorage.setItem("step", "1");
  }, []);

  // next inp
  const nextInpCode = () => {
    const stepInp = document.querySelectorAll("input[data-inp-step]");
    stepInp.forEach((inp) => {
      inp.addEventListener("input", () => {
        const step = Number((inp as HTMLInputElement).dataset.inpStep);
        if ((inp as HTMLInputElement).value.length > 0) {
          const next = document.querySelector(
            `input[data-inp-step="${step + 1}"]`
          ) as HTMLInputElement;
          if (next) next.focus();
        } else {
          const next = document.querySelector(
            `input[data-inp-step="${step - 1}"]`
          ) as HTMLInputElement;
          if (next) next.focus();
        }
      });
    });
  };

  // step 1
  const registerStep1 = async () => {
    const stepInp = document.querySelectorAll("input[data-inp-step]");
    let code = "";
    stepInp.forEach((item) => {
      code += (item as HTMLInputElement).value;
    });
    // send code
    try {
      const res = await fetchApi("/gui-lai-xac-thuc-dk");
    } catch (err) {}
    console.log(code);
  };

  return (
    <section className="section--registerStep h-full">
      <div className="flex-center h-full">
        <div className="container">
          <div className="row justify-center">
            <div className="col-9 relative z-10">
              {/* tab main */}
              <div className="registerStep row bg-white overflow-hidden rounded-[20px]">
                {/* list tab */}
                <ul className="col-4 registerStep--menu bg-accentColor p-[32px_20px_40px_28px]">
                  <li
                    className="registerStep--menu__item flex-between-center py-[10px] text-white first:pt-0 last:pb-0"
                    data-step="1"
                  >
                    <div className="step--countContent flex-y-center gap-x-3">
                      <div className="step--count flex-center w-9 h-9 rounded-full border border-white text-sm font-medium ">
                        1
                      </div>
                      <div className="step--content">
                        <div className="step--content__title text-[15px] font-semibold">
                          Step 1
                        </div>
                        <div className="step--content__desc text-sm mt-1">
                          Xác minh số điện thoại
                        </div>
                      </div>
                    </div>
                    <IoIosArrowForward className="text-lg text-white cursor-pointer" />
                  </li>
                  <li
                    className="registerStep--menu__item flex-between-center py-[10px] text-white first:pt-0 last:pb-0"
                    data-step="2"
                  >
                    <div className="step--countContent flex-y-center gap-x-3">
                      <div className="step--count flex-center w-9 h-9 rounded-full border border-white text-sm font-medium ">
                        2
                      </div>
                      <div className="step--content">
                        <div className="step--content__title text-[15px] font-semibold">
                          Step 2
                        </div>
                        <div className="step--content__desc text-sm mt-1">
                          Tạo mật khẩu
                        </div>
                      </div>
                    </div>
                    <IoIosArrowForward className="text-lg text-white cursor-pointer" />
                  </li>
                  <li
                    className="registerStep--menu__item flex-between-center py-[10px] text-white first:pt-0 last:pb-0"
                    data-step="3"
                  >
                    <div className="step--countContent flex-y-center gap-x-3">
                      <div className="step--count flex-center w-9 h-9 rounded-full border border-white text-sm font-medium ">
                        1
                      </div>
                      <div className="step--content">
                        <div className="step--content__title text-[15px] font-semibold">
                          Step 3
                        </div>
                        <div className="step--content__desc text-sm mt-1">
                          Xác minh số điện thoại
                        </div>
                      </div>
                    </div>
                    <IoIosArrowForward className="text-lg text-white cursor-pointer" />
                  </li>
                </ul>
                {/* content */}
                <div className="col-8 registerStep--main p-[32px_28px_40px_28px]">
                  <TitleSection title="Đăng ký" />
                  <ul className="step--list mt-8">
                    <li className="step--list__item tab-content-1 ">
                      <h3 className="step1--title text-base font-semibold">
                        Nhập mã xác nhận
                      </h3>
                      <span className="inline-block text-sm mt-3">
                        Mã xác thực sẽ được gửi qua Gmail{" "}
                        <span className="font-semibold">{email && email}</span>
                      </span>
                      {/* nhập code s */}
                      <div className="step1--enterCode grid grid-cols-5 w-[55%] mx-auto gap-x-4 mt-8">
                        <input
                          type="text"
                          name=""
                          id=""
                          className="border-b border-neutral-200 outline-none text-center"
                          maxLength={1}
                          data-inp-step="1"
                        />
                        <input
                          type="text"
                          name=""
                          id=""
                          className="border-b border-neutral-200 outline-none text-center"
                          maxLength={1}
                          data-inp-step="2"
                        />
                        <input
                          type="text"
                          name=""
                          id=""
                          className="border-b border-neutral-200 outline-none text-center"
                          maxLength={1}
                          data-inp-step="3"
                        />
                        <input
                          type="text"
                          name=""
                          id=""
                          className="border-b border-neutral-200 outline-none text-center"
                          maxLength={1}
                          data-inp-step="4"
                        />
                        <input
                          type="text"
                          name=""
                          id=""
                          className="border-b border-neutral-200 outline-none text-center"
                          maxLength={1}
                          data-inp-step="5"
                        />
                      </div>
                      <span className="step1--timeout block mt-8 text-sm text-neutral-400">
                        Vui lòng chờ 60 giây để gửi lại
                      </span>

                      <BtnPrimary
                        content="Tiếp tục"
                        className="w-full mt-8"
                        onClick={() => registerStep1()}
                      />
                    </li>
                  </ul>
                </div>
              </div>
              {/* đóng tab main  */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
