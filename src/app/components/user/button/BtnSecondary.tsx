import clsx from "clsx";
import { ReactNode } from "react";
import { BtnPrimaryProps } from "@/app/types/type";
export default function BtnSecondary({
  className,
  content = "Xem thêm",
  children,
  ...props
}: BtnPrimaryProps) {
  return (
    <button
      {...props}
      className={clsx(
        "p-[10px_30px] rounded-lg bg-[#e0f6ff] border border-accentColor text-base text-accentColor font-semibold transition-all-300-ease select-none hover:bg-[#F4FCFF]",
        children && "flex items-center gap-x-2",
        className
      )}
    >
      {children}
      {content}
    </button>
  );
}
