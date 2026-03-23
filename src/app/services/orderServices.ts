import fetchApi from "../utils/fetchApi";

const orderService = {
  getOrderId: (id: number) => fetchApi(`/site/don-hang/lich-su/${id}`),
  deleteOrderItem: (id: number) => fetchApi(`/site/don-hang/huy/${id}`, "PUT"),
};
export default orderService;
