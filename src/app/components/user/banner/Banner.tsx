"use client";
import Link from "next/link";

import type { TypeImageCarousel } from "@/app/types/type";
// component
import ErrorBlock from "../ErrorBlock";
import ImageCarousel from "./ImageCarousel";

export default function Banner() {
  // error
  // if (!listBanner) return <ErrorBlock desc="Lỗi không lấy được Banner" />;
  // // success
  // if (listBanner.length > 0)
  return (
    <section className="section--banner">
      <div className="container">
        {/* banner */}
        <div className="banner grid grid-cols-12 grid-rows-2 gap-base">
          <div className="banner__main col-span-8 row-span-2 ratio-2_1 relative">
            {/* swiper banner main */}
            <div className="absolute inset-0">
              <ImageCarousel
                listBanner={[
                  {
                    id: 1,
                    urlImg: "/images/banner/galaxy-s25-fe-home-0925.webp",
                    alt: "",
                    href: "#!",
                  },
                  {
                    id: 2,
                    urlImg: "/images/banner/home-app3-opensale.jpg",
                    alt: "",
                    href: "#!",
                  },
                ]}
              />
            </div>
          </div>
          {/* banner side top */}
          <div className="top col-span-4 row-span-1 ">
            <ImageCarousel
              listBanner={[
                {
                  id: 1,
                  urlImg: "/images/banner/home-app3-opensale.jpg",
                  alt: "",
                  href: "#!",
                },
              ]}
              delay={4000}
            />
          </div>
          {/* banner side bottom */}
          <div className="bottom col-span-4 row-span-1 ">
            <ImageCarousel
              listBanner={[
                {
                  id: 1,
                  urlImg: "/images/banner/xiaomi-15t-5g-home-0925.webp",
                  alt: "",
                  href: "#!",
                },
              ]}
              delay={4000}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
