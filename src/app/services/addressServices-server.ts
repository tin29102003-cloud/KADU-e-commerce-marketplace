import fetchApiServer from "../utils/fetchApiServer";

const addressServicesServer = {
  getAddressDefault: () => fetchApiServer("/site/dia-chi"),
};

export default addressServicesServer;
