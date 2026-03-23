"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

// components
import ImgLazy from "../shared/Imglazy";
import SlideEmbla from "./product/SlideEmbla";

const toggleThumb = () => {};

export default function SlideProductDetail({
  listBanner,
}: {
  listBanner: [{ url: string }];
}) {
  const [indexThumb, setIndexThumb] = useState(0);
  useEffect(() => {
    const listThumb = document.querySelectorAll(".thumb--navigation__item");
    listThumb.forEach((el, i) => {
      (el as HTMLElement).onclick = () => {
        setIndexThumb(i);
        toggleThumb();
      };
    });
  }, []);
  return (
    <div className="block--detailBanner sticky top-2">
      <div className="banner--main overflow-hidden rounded-lg">
        {/* slide banner  */}
        <SlideEmbla
          containerClassName="h-full"
          viewportClassName="p-0"
          navigation={false}
          selectedIndex={indexThumb}
        >
          <div className="container__embla flex h-full">
            {listBanner.map((banner, i) => (
              <div key={i} className="banner--main__item flex-none w-full">
                <Link href="#!" className="block h-full ratio-box ratio-1_1">
                  <ImgLazy
                    src={banner.url}
                    connectHost={true}
                    alt="Dây nịt da siêu đẹp"
                    className="img-full"
                    wrapperClassName="ratio-box-img"
                  />
                </Link>
              </div>
            ))}
          </div>
        </SlideEmbla>

        {/*  */}
      </div>
      {/* banner thumb */}
      <div className="thumb--navigation mt-3">
        <ul className="embla__container grid grid-flow-col auto-cols-[calc((100%-(12px*4))/5)] gap-x-3 overflow-x-auto">
          {listBanner.map((banner) => (
            <li className="thumb--navigation__item cursor-pointer p-[6px] rounded-lg border-[1.2px] border-bd-primary transition-all-300-ease hover:border-accentColor">
              <div className="img--thumb ratio-box ratio-1_1 rounded-lg">
                <ImgLazy
                  src={"http://localhost:5000/" + banner.url}
                  alt="test test test"
                  className="img-full"
                  wrapperClassName="ratio-box-img"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
