import fetchApiServer from "../utils/fetchApiServer";

const categoryServicesServer = {
  getAllParent: () => fetchApiServer("/site/danh-muc-parent"),
  getAll: () => fetchApiServer("/site/danh-muc-phan-cap"),
  getAllSelect: () => fetchApiServer("/site/danh-muc-san-pham/select"),
};

export default categoryServicesServer;
