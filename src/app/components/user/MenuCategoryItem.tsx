"use client";
import Link from "next/link";
import React from "react";
import { useRef } from "react";

// icons
import { IoIosArrowForward } from "react-icons/io";

export default function MenuCategoryItem() {
  let isFlag = useRef(false);

  const openMegaMenu = (e: React.MouseEvent<HTMLLIElement>) => {
    const li = e.currentTarget;
    const megaMenu = li.querySelector(".mega--menu") as HTMLElement;
    const iconShow = li.querySelector(".icon--show") as HTMLElement;

    if (megaMenu && iconShow) {
      const heightMegaMenu = megaMenu.scrollHeight;
      if (!isFlag.current) {
        // style megaMenu
        Object.assign(megaMenu.style, {
          height: `${heightMegaMenu}px`,
          opacity: 1,
        });
        // style icon show
        iconShow.style.transform = "rotate(90deg)";
      } else {
        // style megaMenu
        Object.assign(megaMenu.style, {
          height: "0px",
          opacity: 0,
        });
        // style icon show
        iconShow.style.transform = "rotate(0deg)";
      }

      isFlag.current = !isFlag.current;
    }
  };

  return (
    <li className="menu--category__item py-[6px]" onClick={openMegaMenu}>
      <div className="flex-between-center gap-3 cursor-pointer">
        <div className="title text-sm font-semibold">Điện Tử</div>
        <div className="count--openMenu flex-y-center gap-x-1 select-none">
          <span className="sount text-sm font-medium">(12)</span>
          <div className="icon--show transition-all-300-ease">
            <IoIosArrowForward className="w-4 h-4 stroke-textGrayDark" />
          </div>
        </div>
      </div>
      {/* mega menu */}
      <ul
        className="mega--menu pl-[10px] text-textGrayDark h-0 opacity-0 overflow-hidden transition-all-300-ease"
        onClick={(e) => e.stopPropagation()}
      >
        {Array.from({ length: 5 }).map((item, i) => (
          <li key={i} className="item py-1">
            <Link href="#!" className="text-sm">
              Mega {i + 1}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
