"use client";
import Link from "next/link";
import BtnSecondary from "./components/user/button/BtnSecondary";
import "./scss/main.css";
import { useState, useEffect, JSX } from "react";
export default function NotFound() {
  const [arrStar, setArrStar] = useState<JSX.Element[]>([]);
  useEffect(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    let arrStar: JSX.Element[] = [];
    const padding = 100;
    for (let i = 0; i <= 50; i++) {
      const randomPositionX = Math.floor(
        Math.random() * (screenWidth - 2 * padding) + padding
      );
      const randomPositionY = Math.floor(
        Math.random() * (screenHeight - 2 * padding) + padding
      );
      const delay = Math.ceil(Math.random() * 20);
      const duration = Math.ceil(Math.random() * 10 + i);
      arrStar.push(
        <span
          style={
            {
              "--delay": `${delay}s`,
              "--duration": `${duration}s`,
              top: `${randomPositionY}px`,
              left: `${randomPositionX}px`,
            } as React.CSSProperties
          }
          className="star--test"
        ></span>
      );
    }
    setArrStar(arrStar);
  }, []);
  // const randomPositiony=
  return (
    <section className="section--notFound h-screen bg-black overflow-hidden">
      <div className="container h-screen overflow-hidden">
        <h1>404 rồi cút qua trang khác đi </h1>
        {/* <BtnSecondary className="m-10" /> */}
        {arrStar.map((el) => el)}
      </div>
    </section>
  );
}
