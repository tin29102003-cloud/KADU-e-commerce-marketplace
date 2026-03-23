import fetchApi from "../utils/fetchApi";

const shopServices = {
  registerShop: ({ ten_shop }: { ten_shop: string }) =>
    fetchApi("/site/dang-ky-shop", "POST", { ten_shop: ten_shop }),
};

export default shopServices;
