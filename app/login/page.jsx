"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [taiKhoan, setTaiKhoan] = useState("");
  const [matKhau, setMatKhau] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(taiKhoan, matKhau);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e1e1e] p-6 rounded-lg w-80"
      >
        <h2 className="text-xl text-white mb-4 text-center">
          Đăng nhập
        </h2>

        <input
          className="w-full mb-3 p-2 rounded bg-[#2f2f2f] text-white"
          placeholder="Tài khoản"
          onChange={(e) => setTaiKhoan(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-4 p-2 rounded bg-[#2f2f2f] text-white"
          placeholder="Mật khẩu"
          onChange={(e) => setMatKhau(e.target.value)}
        />

        <button className="w-full bg-indigo-600 py-2 rounded text-white">
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
