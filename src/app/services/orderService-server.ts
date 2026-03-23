import fetchApiServer from "../utils/fetchApiServer";

const orderServiceServer = {
  getAllOrder: (status?: string) =>
    fetchApiServer(`/site/shop/don-hang`, "GET", {}, { trang_thai: status }),
  getOrderSeller: (trang_thai?: number) =>
    fetchApiServer(
      `/site/shop/don-hang`,
      "GET",
      {},
      { trang_thai: trang_thai }
    ),
};
export default orderServiceServer;
