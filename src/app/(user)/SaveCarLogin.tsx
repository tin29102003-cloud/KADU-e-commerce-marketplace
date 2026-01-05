"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import cartServices from "../services/cartServices";
import productServices from "../services/productServices";
export default function SaveCarLogin() {
  const searchParam = useSearchParams();
  const isLogin = searchParam.get("is_login");
  useEffect(() => {
    if (!isLogin) return;
    const cartLocalStr = localStorage.getItem("cartLocal");
    const cartLocal = cartLocalStr ? JSON.parse(cartLocalStr) : null;
    if (!cartLocal) return;

    (async () => {
      // const res = await productServices.addTocart();
    })();
    //
  }, [isLogin]);

  return null;
}
