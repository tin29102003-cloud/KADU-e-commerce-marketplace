import UpdateInfoUser from "../(user)/user/account/profile/updateInfoUser";
import fetchApi from "../utils/fetchApi";

const infoUserServices = {
  updateInfoUser: (formData: FormData) =>
    fetchApi("/site/cap-nhat-thong-tin-tk", "PATCH", formData),
};

export default infoUserServices;
