"use client";
import clsx from "clsx";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";

export default function RenderStar({
  star,
  widthStar = "18px",
  heightStar = "18px",
}: {
  star: number;
  widthStar?: string;
  heightStar?: string;
}) {
  const maxStar = 5;
  const fullStar = Math.floor(star);
  const hasHalfStar = star - fullStar >= 0.5;
  const emptyStar = maxStar - fullStar - (hasHalfStar ? 1 : 0);
  return (
    <>
      {/* full */}
      {Array.from({ length: fullStar }).map((_, i) => (
        <IoIosStar
          key={`star-${i}`}
          className={clsx(`w-[${widthStar}] h-[${heightStar}] fill-[#FFC205]`)}
        />
      ))}
      {/* half */}
      {hasHalfStar && (
        <IoIosStarHalf
          className={clsx(`w-[${widthStar}] h-[${heightStar}] fill-[#FFC205]`)}
        />
      )}
      {/* empty */}
      {Array.from({ length: emptyStar }).map((_, i) => (
        <IoIosStarOutline
          key={`star-emty-${i}`}
          className={clsx(`w-[${widthStar}] h-[${heightStar}] fill-[#FFC205]`)}
        />
      ))}
    </>
  );
}
