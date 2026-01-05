import Link from "next/link";

// icons
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import BtnCircle from "@/app/components/user/BtnCircle";

// components
import BtnPrimary from "@/app/components/user/button/BtnPrimary";

export default function ForgotPassword() {
  return (
    <section className="section--forgotPass w-full h-screen relative overflow-hidden bg-[#4E9BFF] ">
      <div className="flex-center h-full">
        <div className="container">
          <div className="row justify-center">
            <div className="col-8 relative z-10">
              <div className="forgotPass group bg-white overflow-hidden rounded-[20px] grid grid-cols-2">
                <div className="">
                  <div className="forgotPass--bg h-full bg-[url('/images/auth/bg-left-form.png')] bg-no-repeat bg-center bg-contain"></div>
                </div>
                <div className="forgotPass--main p-[28px_20px]">
                  {/* title */}
                  <div className="login--title relative pb-2 inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-[35%] after:bg-accentColor after:h-[3.5px] after:clip-line-title after:transition-all-300-ease group-hover:after:w-[55%]">
                    <h1 className="title-24 text-accentColor">Quên mật khẩu</h1>
                  </div>
                  {/* form */}
                  <div className="forgotPass--form mt-10">
                    <div className="block--inp">
                      <input
                        type="tel"
                        placeholder="Email/Số điện thoại"
                        className="w-full h-[42px] p-[7px_12px] rounded-lg border border-gray-300 outline-none placeholder:text-sm"
                      />
                    </div>
                    <BtnPrimary content="Tiếp theo" className="w-full mt-4" />
                  </div>
                  {/* method */}
                  <div className="forgotPass--method mt-4">
                    <div className="forgotPass--method__title text-sm text-[#A8A8A8] text-center">
                      Hoặc
                      <br /> Đăng ký bằng
                    </div>
                    <div className="forgotPass--method__main flex-x-center gap-x-4 mt-4">
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
      <div className="bg--authIcon icon1"></div>
      <div className="bg--authIcon icon2"></div>
    </section>
  );
}
