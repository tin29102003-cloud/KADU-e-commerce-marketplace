import fetchApi from "../utils/fetchApi";

const bannerServices = {
  getAll: () => fetchApi("/banner"),
};

export default bannerServices;
