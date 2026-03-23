"use client";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import payServices from "@/app/services/payServices";
import { toast } from "react-toastify";
import { IoReloadOutline } from "react-icons/io5";

export default function () {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id_dh = searchParams.get("id_dh");
  useEffect(() => {
    if (!id_dh) return;
    (async () => {
      try {
        const res = await payServices.checkStatusPay(Number(id_dh));
        if (!res.success) return;
        // console.log(res.data);
        const nextPage = res.data.data;
        if (!nextPage.is_paid) {
          router.push(`/checkout/cancel/?id_dh=${id_dh}`);
        } else if (nextPage.is_paid) {
          router.push(`/checkout/success/?id_dh=${id_dh}`);
        }
      } catch (err) {
        console.log(err);
        toast.error("Lỗi khi thanh toán!");
      }
    })();
  }, [id_dh]);
  return (
    <section className="section--checkoutSuccess bg-gray-50 section-py">
      <div className="container">
        <div className="checkout--success flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-500 text-[40px] text-white">
              <IoReloadOutline />
            </div>

            {/* Title */}
            <h1 className="mb-2 text-2xl font-semibold text-gray-800">
              Thanh toán đang được xử lý
            </h1>

            {/* Description */}
            <p className="text-sm text-gray-500">
              Thanh toán của bạn đang được xử lý vui lòng chờ trong giây lát.
            </p>

            {/* Order Info */}
          </div>
        </div>
      </div>
    </section>
  );
}
