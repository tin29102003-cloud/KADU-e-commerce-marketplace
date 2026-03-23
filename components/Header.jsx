"use client"

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import vn from "../public/vn.webp";
import { Bell } from "lucide-react";
import adminDefault from "../public/admin.jpg";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const rawUser = JSON.parse(storedUser);

      // ✅ Chuẩn hóa dữ liệu cho Header dùng
      setUser({
        name: rawUser.ho_ten || rawUser.tai_khoan,
        image: rawUser.hinh || null,
        ...rawUser
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="bg-[#1e1e1e] shadow-lg border-b border-[#1f1f1f] mx-4 sm:mx-6 lg:mx-8 mt-4 mb-2 rounded-lg">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 flex items-center justify-between">
        <h1 className='text-lg sm:text-xl lg:text-2xl font-semibold text-gray-100'>
          Tổng quan
        </h1>

        <div className="flex items-center space-x-3 sm:space-x-6">
          <Image src={vn} alt="logo" width={25} height={18} className='shadow-md cursor-pointer'/>

          <div className="relative">
            <Bell className='w-5 sm:w-6 h-5 sm:h-6 text-gray-300 cursor-pointer hover:text-white'/>
          </div>

          {user ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src={user.image || adminDefault}
                alt="user"
                width={35}
                height={35}
                className='rounded-full border border-gray-600'
              />
              <span className='hidden sm:block text-gray-100 font-medium'>
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-400 text-white text-sm px-3 py-1 rounded"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              onClick={() => window.location.href = "/login"}
              className="bg-blue-500 hover:bg-blue-400 text-white text-sm px-3 py-1 rounded"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header;
