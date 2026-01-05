import fetchApiServer from "../utils/fetchApiServer";

const productServicesServer = {
  productFilter: (
    p: string,
    query: {
      min_price: string;
      max_price: string;
      brands: string;
      rating: string;
      is_on_sale: string;
      sort: string;
      page: string;
    }
  ) =>
    fetchApiServer(
      `/site/danh-muc-san-pham/filter/${p}`,
      "GET",
      {},
      {
        min_price: query.min_price,
        max_price: query.max_price,
        id_ths: query.brands,
        rating: query.rating,
        is_on_sale: query.is_on_sale,
        sort: query.sort,
        page: query.page,
      }
    ),
  getProductShop: (id: number, page?: number) =>
    fetchApiServer("/site/shop/san-pham", "GET", {}, { id, page }),
  getThuongHieu: () => fetchApiServer("/site/thuong-hieu-san-pham/select"),
  getThuongHieuSelect: () =>
    fetchApiServer("/site/thuong-hieu-san-pham/select"),
  getAttributeSelect: () => fetchApiServer("/site/thuoc-tinh-san-pham/select"),
  getProductSale: () => fetchApiServer("/site/san-pham-sale"),
  getProductFeatured: () => fetchApiServer("/site/san-pham-noi-bat"),
  searchProduct: (keyword: string, page: number) =>
    fetchApiServer(`/site/tim-kiem-san-pham`, "GET", {}, { keyword, page }),
};
export default productServicesServer;
