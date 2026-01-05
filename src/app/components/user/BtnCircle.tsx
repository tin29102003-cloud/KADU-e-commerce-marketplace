"use client";
import clsx from "clsx";
// import icons
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

export default function BtnCircle({
  className,
  rotateIcon = "next",
  onClick,
}: {
  className?: string;
  rotateIcon?: "prev" | "next";
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "btn--circle",
        rotateIcon,
        "group w-8 h-8 rounded-full bg-accentColor flex-center cursor-pointer transition-all-300-ease hover:bg-accentColorHover",
        className
      )}
    >
      {rotateIcon === "prev" ? (
        <IoIosArrowBack className="w-4 h-4 fill-white" />
      ) : (
        <IoIosArrowForward className="w-4 h-4 fill-white" />
      )}
    </button>
  );
}
