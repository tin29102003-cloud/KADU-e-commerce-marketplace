"use client";
import { ThreeDots } from "react-loader-spinner";

export default function Spinner({
  width = 30,
  height = 30,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <ThreeDots height={30} width={30} color="#1BBCFF" ariaLabel="loading" />
  );
}
