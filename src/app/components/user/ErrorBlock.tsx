import clsx from "clsx";
import Link from "next/link";

// icon
import { IoIosWarning } from "react-icons/io";

export default function ErrorBlock({
  title = "Đã xảy ra lỗi!",
  desc = "Có lỗi xãy ra vui lòng thử lại sau.",
  className,
}: {
  title?: string;
  desc?: string;
  className?: string;
}) {
  return (
    <section className={clsx("section--errorBlock", className)}>
      <div className="error flex flex-col items-center bg-[#f5f5f5] p-[20px_16px]">
        {/* icon */}
        <div className="error__icon w-16 h-16 rounded-full bg-[#FFD5D3] flex-center ">
          <IoIosWarning className="w-10 h-10 fill-[#F64749]" />
        </div>
        {/*  */}
        <div className="error__title text-base font-semibold mt-2">{title}</div>
        <div className="error__desc text-sm text-textGrayDark mt-1 line-clamp-3">
          {desc}
        </div>
      </div>
    </section>
  );
}
