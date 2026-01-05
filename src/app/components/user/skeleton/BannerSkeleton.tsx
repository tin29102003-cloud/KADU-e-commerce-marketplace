// skeleton
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function BannerSkeleton() {
  return (
    <section className="section--skeleton">
      <div className="container">
        <div className="banner grid grid-cols-12 grid-rows-2 gap-base">
          {/* swiper banner main */}
          <div className="col-span-8 row-span-2 ratio-2_1 relative">
            <Skeleton
              containerClassName="banner__main absolute inset-0 leading-none"
              height="100%"
              borderRadius="8px"
            ></Skeleton>
          </div>
          {/* banner side top */}
          <Skeleton
            containerClassName="top bottom col-span-4 row-span-1 leading-none"
            height="100%"
            borderRadius="8px"
          ></Skeleton>
          {/* banner side bottom */}
          <Skeleton
            containerClassName="bottom bottom col-span-4 row-span-1 leading-none"
            height="100%"
            borderRadius="8px"
          ></Skeleton>
        </div>
      </div>
    </section>
  );
}
