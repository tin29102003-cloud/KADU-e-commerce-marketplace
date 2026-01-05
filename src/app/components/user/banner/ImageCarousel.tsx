import Link from "next/link";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// type
import { TypeImageCarousel } from "@/app/types/type";

export default function ImageCarousel({
  listBanner,
  delay = 3000,
  speed = 900,
}: {
  listBanner: TypeImageCarousel[];
  delay?: number;
  speed?: number;
}) {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay }}
      speed={speed}
      loop={true}
      className="swiper--banner w-full h-full rounded-lg"
    >
      {listBanner.length > 0 &&
        listBanner.map((banner: TypeImageCarousel) => (
          <SwiperSlide>
            <Link href={banner.href} className="">
              <img
                src={banner.urlImg}
                alt={banner.alt}
                className="w-full h-full object-cover"
              />
            </Link>
          </SwiperSlide>
        ))}
    </Swiper>
  );
}
