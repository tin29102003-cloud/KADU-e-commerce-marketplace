import fetchApi from "../utils/fetchApi";
const cartServices = {
  delCartId: (id: number) => fetchApi(`/site/delete-cart/${id}`, "DELETE"),
  updateCart: (id: number, so_luong: number) =>
    fetchApi(`/site/update-cart/${id}`, "PUT", { so_luong }),
  cartToogle: (id_gh_ct: number[]) =>
    fetchApi("/site/cart/toggle", "PUT", { id_gh_ct }),
};

export default cartServices;
