import ImgLazy from "@/app/components/shared/Imglazy";
import ErrorBlock from "@/app/components/user/ErrorBlock";
import MessageBlock from "@/app/components/user/MessageBlock";
import orderServiceServer from "@/app/services/orderService-server";
import { TypeOrderItem } from "@/app/types/order";

export default async function OrderSeller() {
  const result = await Promise.allSettled([
    orderServiceServer.getOrderSeller(),
  ]);
  const [orderListDefaultRes] = result;
  const orderList: TypeOrderItem[] | null =
    orderListDefaultRes.status === "fulfilled"
      ? orderListDefaultRes.value.data.result.data
      : null;
  return (
    <section className="section--orderSeller">
      <div className="orderSeller">
        {orderList === null && <ErrorBlock />}
        {orderList !== null && orderList.length === 0 && (
          <MessageBlock content="Hiện không có đơn hàng." />
        )}
        {orderList !== null &&
          orderList.length > 0 &&
          orderList.map((order) => (
            <div className="orderSeller--item w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              {/* Header */}
              <div className="order--header flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium text-gray-900">Mã đơn:</span>
                  <span>{order.ma_dh}</span>
                </div>
                <span className="rounded-full bg-accentColor/50 px-3 py-1 text-xs font-medium text-white">
                  Chờ xác nhận
                </span>
              </div>

              {/* Product */}
              <div className="productSeller--list">
                <div className="productSeller--item flex gap-4 py-4">
                  <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-gray-100 ratio-box">
                    <ImgLazy
                      src="ád"
                      alt=""
                      connectHost={true}
                      className="ratio-img"
                      wrapperClassName="block w-full h-full"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <h3 className="product--name line-clamp-2 text-sm font-medium text-gray-900">
                      Áo thun form rộng unisex basic cotton 100%
                    </h3>
                    <p className="text-xs text-gray-500">
                      Phân loại: Trắng / XL
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs text-gray-500">x1</span>
                      <div className="product--price flex gap-x-2">
                        <span className="price__new text-sm font-semibold text-gray-900">
                          199.000đ
                        </span>
                        <span className="price__old text-sm font-semibold text-gray-900">
                          199.000đ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buyer info */}
              <div className="rounded-xl bg-gray-50 p-3 text-sm">
                <p className="font-medium text-gray-900">Người nhận</p>
                <p className="text-gray-600">Nguyễn Văn A • 0909 999 999</p>
                <p className="text-gray-500">
                  123 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM
                </p>
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-500">Tổng tiền:</span>
                  <span className="ml-1 font-semibold text-accentColor">
                    199.000đ
                  </span>
                </div>

                <div className="flex gap-2">
                  <button className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-300">
                    Từ chối
                  </button>
                  <button className="rounded-xl bg-accentColor px-4 py-2 text-sm font-medium text-white hover:bg-accentColor/80 transition-all-300-ease">
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
