"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  useEffect,
  useState,
} from "react";
import useEmblaCarousel from "embla-carousel-react";

import type { UseEmblaCarouselType } from "embla-carousel-react";

import ErrorBlock from "../ErrorBlock";
import BtnCircle from "../BtnCircle";

import { PropsEmbla } from "@/app/types/type";
import clsx from "clsx";

export default function SlideEmbla({
  options = { duration: 10, align: "start" },
  children,
  containerClassName,
  viewportClassName,
  plugin = undefined,
  navigation = true,
  selectedIndex,
}: PropsEmbla) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugin);
  const [emblaApiState, setEmblaApiState] = useState<
    UseEmblaCarouselType[1] | undefined
  >(undefined);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    setEmblaApiState(emblaApi);

    emblaApi.reInit({ startIndex: emblaApi.selectedScrollSnap() });
    if (selectedIndex !== undefined && selectedIndex !== null) {
      emblaApi.scrollTo(selectedIndex);
    }
    if (!navigation) return;
    const onSelect = () => {
      setCanScrollNext(emblaApi.canScrollNext());
      setCanScrollPrev(emblaApi.canScrollPrev());
    };
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();

    // clean event
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [selectedIndex, emblaApi]);

  return (
    <div className={clsx("embla", containerClassName)}>
      <div
        className={clsx(
          "embla__viewport overflow-hidden p-[2px] h-full",
          viewportClassName
        )}
        ref={emblaRef}
      >
        {children}
      </div>

      {/* navigation */}
      {navigation && (
        <div className={`embla__control`}>
          <div className="embla__buttons">
            <BtnCircle
              rotateIcon="prev"
              onClick={() => emblaApiState?.scrollPrev()}
              className={`${!canScrollPrev && "hidden pointer-events-none"}`}
            />
            <BtnCircle
              rotateIcon="next"
              onClick={() => emblaApiState?.scrollNext()}
              className={`${!canScrollNext && "hidden pointer-events-none"}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
