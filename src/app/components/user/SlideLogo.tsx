"use client";
import AutoScroll from "embla-carousel-auto-scroll";
import Link from "next/link";
import ImgLazy from "../shared/Imglazy";

// components
import SlideEmbla from "./product/SlideEmbla";

export default function SlideLogo() {
  return (
    <section className="section--slideLogo section-py  ">
      <div className="slideLogo py-5 bg-primaryColor">
        <SlideEmbla
          navigation={false}
          options={{ loop: true, align: "start", containScroll: "trimSnaps" }}
          plugin={[
            AutoScroll({
              speed: 1,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
        >
          <div className="embla__container flex gap-x-3 group">
            {Array.from({ length: 20 }).map((item) => (
              <div className="flex-[0_0_calc(((100%-(12px*9))/10))] last:mr-3">
                <div className="block--imgLogo">
                  <Link href="#!" className="block ratio-box ratio-2_1">
                    <div className="img flex-center ratio-box-img">
                      <ImgLazy
                        src="./images/logo-datn.png"
                        alt="logo"
                        className="max-h-[83px] img-contain !transition-all grayscale-[0.8] hover:grayscale-0 select-none"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </SlideEmbla>
      </div>
    </section>
  );
}
