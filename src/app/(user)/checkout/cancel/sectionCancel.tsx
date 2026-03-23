"use client";

import payServices from "@/app/services/payServices";
import payServicesServer from "@/app/services/payServices-server";
import { TypeOrderDetail } from "@/app/types/type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function SectionCancel() {
  const searchParams = useSearchParams();
  const id_dh = searchParams.get("id_dh");
  useEffect(() => {
    if (!id_dh) return;
    (async () => {
      try {
        const res = await payServices.cancelPay(Number(id_dh));
        if (!res.success) return;
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);
  return (
    <section className="section--checkoutSuccess bg-gray-50 section-py">
      <div className="container">
        <div className="checkout--success flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-[40px] text-white">
              <IoMdClose />
            </div>

            {/* Title */}
            <h1 className="mb-2 text-2xl font-semibold text-gray-800">
              Hủy thành toán thành công
            </h1>

            {/* Description */}
            <p className="desc mb-6 text-sm text-gray-500">
              Giao dịch không được hoàn tất. Bạn có thể thử thanh toán lại hoặc
              chọn phương thức khác
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="w-full rounded-lg border py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all-300-ease"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
