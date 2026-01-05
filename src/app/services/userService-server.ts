import fetchApiServer from "../utils/fetchApiServer";

const userServiceServer = {
  getInfoUser: () => fetchApiServer("/site/lay-thong-tin-tk"),
};

export default userServiceServer;
