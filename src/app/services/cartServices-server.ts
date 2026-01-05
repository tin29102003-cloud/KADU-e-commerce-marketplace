import fetchApiServer from "../utils/fetchApiServer";

const cartServicesServer = {
  getAll: () => fetchApiServer("/site/get-cart"),
};

export default cartServicesServer;
