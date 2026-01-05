import Link from "next/link";
import clsx from "clsx";

// import icon
import { IoIosArrowForward } from "react-icons/io";

export default function BtnSeeAll({
  contentBtn = "Xem tất cả",
  href = "#!",
  className,
}: {
  contentBtn?: string;
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={clsx("inline-flex items-center gap-x-1", className)}
    >
      <span className="text-base text-accentColor font-medium">
        {contentBtn}
      </span>
      <IoIosArrowForward className="w-5 h-5 fill-accentColor" />
    </Link>
  );
}
