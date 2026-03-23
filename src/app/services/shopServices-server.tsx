import fetchApiServer from "../utils/fetchApiServer";

const shopServicesServer = {
  getInfoShop: () => fetchApiServer("/site/shop/profile"),
};

export default shopServicesServer;
