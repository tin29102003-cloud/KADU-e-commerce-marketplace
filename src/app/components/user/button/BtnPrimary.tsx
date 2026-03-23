import clsx from "clsx";
import { BtnPrimaryProps } from "@/app/types/type";
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
