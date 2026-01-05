"use client";
import type { TypeProduct } from "@/app/types/type";
import SlideEmbla from "./SlideEmbla";
import ErrorBlock from "../ErrorBlock";
import Product from "./Product";
import AutoScroll from "embla-carousel-auto-scroll";
import { Autoplay } from "swiper/modules";
import clsx from "clsx";

export default function SlideProductEmbla({
  listProduct,
  slidesPerViews = 5,
  className,
}: {
  listProduct: TypeProduct[] | null;
  slidesPerViews?: 4 | 5;
  className?: string;
}) {
  if (!listProduct) return <ErrorBlock desc="Lỗi không lấy được sản phẩm" />;
  if (listProduct.length === 0) return <ErrorBlock desc="Không có sản phẩm" />;

  //   success
  return (
    <SlideEmbla>
      <ul
        className={clsx(
          "embla__container",
          {
            "grid-col5-slide": slidesPerViews === 5,
            "grid-col4-slide": slidesPerViews === 4,
          },
          className
        )}
      >
        {listProduct.map((prd: TypeProduct) => (
          <Product
            key={prd.id}
            product={prd}
            className={`embla--col${slidesPerViews}__item select-none`}
          />
        ))}
      </ul>
    </SlideEmbla>
  );
}
