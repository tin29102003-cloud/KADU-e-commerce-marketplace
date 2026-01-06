"use client";
import clsx from "clsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const BASE_URL_SERVER = process.env.NEXT_PUBLIC_HOST_BACKEND;

export default function ImgLazy({
  src = "",
  alt = "",
  className,
  effect = "blur",
  wrapperClassName,
  connectHost = false,
}: {
  src: string;
  alt: string;
  className?: string;
  effect?: "blur" | "opacity" | "black-and-white";
  wrapperClassName?: string;
  connectHost?: boolean;
}) {
  return (
    <LazyLoadImage
      wrapperClassName={wrapperClassName}
      src={connectHost ? BASE_URL_SERVER + src : src}
      alt={alt}
      className={clsx(className)}
      effect={effect}
    />
  );
}
