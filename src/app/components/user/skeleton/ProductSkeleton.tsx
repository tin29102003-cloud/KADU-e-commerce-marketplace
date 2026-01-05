"use client";
import Link from "next/link";

// icons
import { CiHeart, CiLocationOn } from "react-icons/ci";
import { FaStar } from "react-icons/fa";

// skeleton
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProductSkeleton() {
  return (
    <div className="product p-[10px] flex flex-col justify-between gap-y-3 border border-borderDefault rounded-lg">
      {/* product info main */}
      <div className="product__infoMain">
        <div className="product--action flex items-center justify-between ">
          <Skeleton
            containerClassName="leading-none"
            width="38px"
            height="21px"
          ></Skeleton>
          <Skeleton
            containerClassName="leading-none"
            width="28px"
            height="28px"
          ></Skeleton>
        </div>
        {/* img */}
        <div className="product--thumb aspect-square overflow-hidden mt-3">
          <Skeleton
            containerClassName="block h-full leading-none"
            height="100%"
          ></Skeleton>
        </div>
        {/* info */}

        {/* product info main==== */}
        <div className="content--main mt-2">
          <Skeleton
            containerClassName="leading-none"
            style={{ lineHeight: "1.5" }}
          ></Skeleton>

          <Skeleton
            containerClassName="leading-none block mt-[6px] "
            className=""
            width="80%"
          ></Skeleton>
        </div>
      </div>

      {/* product info secondary === */}
      <div className="product__infoBottom">
        <Skeleton
          containerClassName="block "
          width="100%"
          height="20px"
        ></Skeleton>
        {/* rating */}
        <div className="rating flex items-center justify-between gap-x-2 gap-y-2 mt-3 flex-wrap">
          <Skeleton containerClassName="leading-none" width="145px"></Skeleton>
          <Skeleton containerClassName="leading-none" width="64px"></Skeleton>
        </div>
        <Skeleton
          containerClassName="leading-none inline-block mt-3"
          width="70px"
        ></Skeleton>
      </div>
    </div>
  );
}
