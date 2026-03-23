"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  DollarSign,
  Tag,
  ShoppingBag,
  ShoppingCart,
  Users,
  X,
  Menu,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Wallet,
  TicketPercent,
} from "lucide-react";

const ICONS = {
  House,
  DollarSign,
  Tag,
  ShoppingBag,
  ShoppingCart,
  Users,
  CreditCard,
  Wallet,
  TicketPercent,
  Menu,
  ChevronDown,
  ChevronRight,
};

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState({
    products: true,
    users: false,
    categories: false,
    payments: false,
    vouchers: false,
  });

  const pathname = usePathname();

  const toggleMenu = (key) => {
    setOpenMenu((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (href) => pathname === href;

  const hasActiveSubItem = (subItems) =>
    subItems?.some((sub) => isActive(sub.href));

  const sidebarItems = [
    { name: "Tổng quan", href: "/", icon: "House" },

    {
      name: "Sản phẩm",
      icon: "ShoppingBag",
      key: "products",
      subItems: [
        { name: "Duyệt sản phẩm", href: "/products/review" },
        { name: "Danh sách sản phẩm", href: "/products/list" },
      ],
    },

    {
      name: "Người dùng",
      icon: "Users",
      key: "users",
      subItems: [
        { name: "Thêm người dùng", href: "/users/create" },
        { name: "Danh sách người dùng", href: "/users/list" },
      ],
    },

    {
      name: "Đơn hàng",
      href: "/orders",
      icon: "ShoppingCart",
    },

    {
      name: "Danh mục",
      icon: "Tag",
      key: "categories",
      subItems: [
        { name: "Thêm danh mục", href: "/categories/create" },
        { name: "Danh sách danh mục", href: "/categories/list" },
      ],
    },

    {
      name: "Voucher",
      icon: "TicketPercent",
      key: "vouchers",
      subItems: [
        { name: "Thêm voucher", href: "/vouchers/create" },
        { name: "Danh sách voucher", href: "/vouchers/list" },
      ],
    },

    {
      name: "Phương thức thanh toán",
      icon: "CreditCard",
      key: "payments",
      subItems: [
        { name: "Thêm phương thức", href: "/payments/create" },
        { name: "Danh sách phương thức", href: "/payments/list" },
      ],
    }
  ];

  return (
    <div
      className={`relative z-10 flex-shrink-0 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="h-full bg-[#1e1e1e] p-4 flex flex-col border-r border-[#2f2f2f]">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mb-6 p-2 rounded-full hover:bg-[#2f2f2f] transition-colors max-w-fit"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="flex-1 overflow-auto">
          {sidebarItems.map((item) => {
            const IconComponent = ICONS[item.icon];
            if (!IconComponent) return null;

            const isItemActive =
              (item.href && isActive(item.href)) ||
              (item.subItems && hasActiveSubItem(item.subItems));

            return (
              <div key={item.name}>
                {item.subItems ? (
                  <>
                    <div
                      onClick={() => toggleMenu(item.key)}
                      className={`flex items-center justify-between h-10 px-3 rounded-lg mb-1 cursor-pointer
                        hover:bg-[#2f2f2f] transition-colors
                        ${
                          isItemActive
                            ? "bg-[#2f2f2f] text-white"
                            : "text-gray-300"
                        }`}
                    >
                      <div className="flex items-center">
                        <IconComponent size={20} />
                        {isSidebarOpen && (
                          <span className="ml-4">{item.name}</span>
                        )}
                      </div>

                      {isSidebarOpen &&
                        (openMenu[item.key] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        ))}
                    </div>

                    {isSidebarOpen && openMenu[item.key] && (
                      <div className="ml-8 mb-2">
                        {item.subItems.map((sub) => (
                          <Link key={sub.name} href={sub.href}>
                            <div
                              className={`h-9 px-3 flex items-center rounded-lg text-sm cursor-pointer
                                hover:bg-[#2f2f2f]
                                ${
                                  isActive(sub.href)
                                    ? "bg-[#2f2f2f] text-white"
                                    : "text-gray-300"
                                }`}
                            >
                              {sub.name}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={item.href}>
                    <div
                      className={`flex items-center h-10 px-3 rounded-lg mb-2 cursor-pointer
                        hover:bg-[#2f2f2f] transition-colors
                        ${
                          isActive(item.href)
                            ? "bg-[#2f2f2f] text-white"
                            : "text-gray-300"
                        }`}
                    >
                      <IconComponent size={20} />
                      {isSidebarOpen && (
                        <span className="ml-4">{item.name}</span>
                      )}
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
