import fetchApiServer from "../utils/fetchApiServer";

const addressServicesServer = {
  getAddressAll: () => fetchApiServer("/site/dia-chi"),
  // deleteAddress: (id: number | string) =>
  //   fetchApiServer(`/site/dia-chi/${id}`, "DELETE"),
  getAddressDefault: () => fetchApiServer("/site/dia-chi-mac-dinh/"),
};

export default addressServicesServer;
