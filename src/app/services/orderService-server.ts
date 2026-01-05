import fetchApiServer from "../utils/fetchApiServer";

const orderServiceServer = {
  getAllOrder: (status: string) =>
    fetchApiServer(`/site/shop/don-hang/?trang_thai=${status}`),
};
export default orderServiceServer;
