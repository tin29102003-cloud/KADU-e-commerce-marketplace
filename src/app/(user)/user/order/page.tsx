import Link from "next/link";
import AccountSidebar from "@/app/components/user/AccountSidebar";
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import OrderItem from "@/app/components/user/OrderItem";
import orderServiceServer from "@/app/services/orderService-server";
import OrderList from "./orderList";
import { TypeOrderItem } from "@/app/types/order";
import { getStatusOrder } from "@/app/utils/helper";
import clsx from "clsx";

export default async function Order({
  searchParams,
}: {
  searchParams: { type: string };
}) {
  const { type } = await searchParams;

  const result = await Promise.allSettled([
    orderServiceServer.getAllOrder(type),
  ]);
  const [orderListRes] = result;
  const orderList: TypeOrderItem[] | null =
    orderListRes.status === "fulfilled"
      ? orderListRes.value.data.result.data
      : null;
  return (
    <div className="order">
      <div className="order--header border-b border-bd-primary pb-3 mb-4 hidden">
        <h1 className="text-xl font-medium text-gray-800">Đơn hàng</h1>
      </div>
      <nav className="order--nav">
        <ul className="flex-y-center overflow-x-auto">
          <li className={clsx(type === undefined && "active")}>
            <Link
              href="/user/order"
              className="inline-block p-[8px_14px] whitespace-nowrap text-sm border-b-2 border-bd-primary"
            >
              Tất cả
            </Link>
          </li>
          {Array.from({ length: 5 }).map((_, i) => (
            <li
              key={`tag-${i}`}
              className={clsx(Number(type) === i && "active")}
            >
              <Link
                href={`?type=${i}`}
                className="inline-block p-[8px_14px] whitespace-nowrap text-sm border-b-2 border-bd-primary"
              >
                {getStatusOrder(i)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <OrderList orderList={orderList} />
    </div>
  );
}
