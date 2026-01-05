import fetchApi from "../utils/fetchApi";

const commentServices = {
  getOne: (id: number) => fetchApi(`/site/danh-gia/${id}`, "GET"),
};
export default commentServices;
