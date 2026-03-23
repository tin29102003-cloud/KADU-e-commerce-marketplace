import fetchApi from "../utils/fetchApi";

const userService = {
  getInfoUser: () => fetchApi("/site/lay-thong-tin-tk"),
};

export default userService;
