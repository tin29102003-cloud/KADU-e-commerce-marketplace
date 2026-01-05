import fetchApiServer from "../utils/fetchApiServer";

const voucherServcesServer = {
  getAll: () => fetchApiServer("/site/voucher"),
};
export default voucherServcesServer;
