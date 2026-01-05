import clsx from "clsx";
import React, { ReactNode, ButtonHTMLAttributes } from "react";

type BtnPrimaryProps = {
  className?: string;
  content?: string;
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function BtnPrimary({
  className,
  content = "Xem thêm",
  children,
  ...props
}: BtnPrimaryProps) {
  return (
    <button
      {...props}
      className={clsx(
        "p-[10px_30px] rounded-lg bg-accentColor text-base text-white font-semibold transition-all-300-ease select-none hover:bg-accentColorHover",
        children && "flex items-center gap-x-2",
        className
      )}
    >
      {children}
      {content}
    </button>
  );
}
