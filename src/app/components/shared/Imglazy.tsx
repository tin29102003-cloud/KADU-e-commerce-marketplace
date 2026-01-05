"use client";
import clsx from "clsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function ImgLazy({
  src = "",
  alt = "",
  className,
  effect = "blur",
  wrapperClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  effect?: "blur" | "opacity" | "black-and-white";
  wrapperClassName?: string;
}) {
  return (
    <LazyLoadImage
      wrapperClassName={wrapperClassName}
      src={src}
      alt={alt}
      className={clsx(className)}
      effect={effect}
    />
  );
}
