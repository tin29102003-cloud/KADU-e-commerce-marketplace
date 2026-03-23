"use client";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { useEffect, useState } from "react";
import orderService from "@/app/services/orderServices";
import { useSearchParams } from "next/navigation";
import { TypeOrderDetail } from "@/app/types/type";
import { formatMoney } from "@/app/utils/helper";

export default function SectionSuccess() {
  const searchParams = useSearchParams();
  const id_dh = searchParams.get("id_dh");
  const [infoOrther, setInfoOther] = useState<TypeOrderDetail | null>(null);
  useEffect(() => {
    if (!id_dh) return;
    (async () => {
      try {
        const res = await orderService.getOrderId(Number(id_dh));
        if (!res.success) return;

        setInfoOther(res.data.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);
  console.log(infoOrther);
  return (
    <section className="section--checkoutSuccess bg-gray-50 section-py">
      <div className="container">
        <div className="checkout--success flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accentColor">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Title */}
            <h1 className="mb-2 text-2xl font-semibold text-gray-800">
              Thanh toán thành công
            </h1>

            {/* Description */}
            <p className="mb-6 text-sm text-gray-500">
              Cảm ơn{" "}
              <span className="font-semibold text-accentColor/70">
                {infoOrther && infoOrther.ten_nguoi_nhan}
              </span>{" "}
              đã mua hàng. Đơn hàng của bạn đã được ghi nhận và đang được xử lý.
            </p>

            {/* Order Info */}
            <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left text-sm">
              <div className="flex justify-between flex-wrap">
                <span className="text-gray-500">Mã đơn hàng</span>
                <span className="font-medium text-gray-800">
                  {infoOrther && infoOrther.ma_dh}
                </span>
              </div>
              <div className="mt-2 flex justify-between flex-wrap">
                <span className="text-gray-500">Phương thức</span>
                <span className="text-gray-800">
                  {infoOrther && infoOrther.pttt.ten_pt}
                </span>
              </div>
              <div className="mt-2 flex justify-between flex-wrap">
                <span className="text-gray-500">Phí vận chuyển</span>
                <span className="font-semibold text-accentColor">
                  {infoOrther && formatMoney(Number(infoOrther.phi_vc))}
                </span>
              </div>
              <div className="mt-2 flex justify-between flex-wrap">
                <span className="text-gray-500">Tổng thanh toán</span>
                <span className="font-semibold text-accentColor">
                  {infoOrther && formatMoney(Number(infoOrther.tong_tien))}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button className="w-full rounded-lg bg-accentColor py-3 text-sm font-medium text-white hover:bg-accentColor/80 transition-all-300-ease">
                Xem đơn hàng
              </button>

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
