import fetchApi from "../utils/fetchApi";
import { TypePostProduct } from "../types/product";

const productServices = {
  getAll: (page?: number) =>
    fetchApi("/site/san-pham", "GET", {}, { page: page }),
  getOneProduct: (slug: string) => fetchApi(`/site/san-pham/${slug}`, "GET"),
  addTocart: (data: TypePostProduct) =>
    fetchApi("/site/add-to-cart", "POST", data),
  loveProduct: (data: { id_sp: number }) =>
    fetchApi("/site/yeu-thich-sp/toggle", "POST", data),
  getAllProductLove: () => fetchApi("/site/yeu-thich-sp"),
  searchProductHeader: (keyword: string, limit?: string) =>
    fetchApi(`/site/tim-kiem-san-pham`, "GET", {}, { keyword, limit }),
  addProductSeller: (formData: FormData) =>
    fetchApi("/site/shop/san-pham", "POST", formData),
  deleteProductSeller: (id: number) =>
    fetchApi(`/site/shop/san-pham/${id}`, "DELETE"),
};

export default productServices;

// /site/tim-kiem-goi-y-san-pham
