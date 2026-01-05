import fetchApi from "../utils/fetchApi";
import { TypePostProduct } from "../types/product";

const productServices = {
  getAll: () => fetchApi("/site/san-pham"),
  getOneProduct: (slug: string) => fetchApi(`/site/san-pham/${slug}`, "GET"),
  addTocart: (data: TypePostProduct) =>
    fetchApi("/site/add-to-cart", "POST", data),
  loveProduct: (data: { id_sp: number }) =>
    fetchApi("/site/yeu-thich-sp/toggle", "POST", data),
  getAllProductLove: () => fetchApi("/site/yeu-thich-sp"),
  searchProductHeader: (keyword: string) =>
    fetchApi(`/site/tim-kiem-san-pham`, "GET", {}, { keyword }),
};

export default productServices;

// /site/tim-kiem-goi-y-san-pham
