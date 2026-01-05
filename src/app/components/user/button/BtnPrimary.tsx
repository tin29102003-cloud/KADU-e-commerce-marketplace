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
        "btn btn--primary",
        children && "flex items-center gap-x-2",
        className
      )}
    >
      {children}
      {content}
    </button>
  );
}
