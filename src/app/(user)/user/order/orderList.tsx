"use client";
import ErrorBlock from "@/app/components/user/ErrorBlock";
import MessageBlock from "@/app/components/user/MessageBlock";
import OrderItem from "@/app/components/user/OrderItem";
import { TypeOrderItem } from "@/app/types/order";
import { useEffect, useState } from "react";

export default function OrderList({
  orderList,
}: {
  orderList: TypeOrderItem[] | null;
}) {
  const [orderListChange, setOrderListChange] = useState<
    TypeOrderItem[] | null
  >(orderList);
  useEffect(() => {
    setOrderListChange(orderList);
  }, [orderList]);
  if (orderListChange === null) return <ErrorBlock />;
  if (orderListChange !== null && orderListChange.length === 0)
    return <MessageBlock content="Hiện chưa có đơn hàng." />;
  if (orderListChange !== null && orderListChange.length > 0) {
    return (
      <div className="order--list flex flex-col gap-base mt-5">
        {orderListChange.map((order) => (
          <OrderItem
            key={order.id}
            order={order}
            setOrderListChange={setOrderListChange}
          />
        ))}
      </div>
    );
  }
}
