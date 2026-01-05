import fetchApiServer from "../utils/fetchApiServer";

const payServicesServer = {
  getAllMethodPay: () => fetchApiServer("/site/PTTT"),
};
export default payServicesServer;
