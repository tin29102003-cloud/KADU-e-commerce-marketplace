import fetchApi from "../utils/fetchApi";

const categoryServices = {
  getAll: () => fetchApi("/category"),
};

export default categoryServices;
