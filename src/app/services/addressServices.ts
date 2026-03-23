import { TypeAddressItem } from "../types/type";
import fetchApi from "../utils/fetchApi";
const addressServices = {
  deleteAddress: (id: number | string) =>
    fetchApi(`/site/dia-chi/${id}`, "DELETE"),
  addAddress: (data: TypeAddressItem) =>
    fetchApi("/site/dia-chi", "POST", data),
  // getAllMap: () => fetchApi("https://provinces.open-api.vn/api/v2/?depth=2"),
  setDeffaultAddress: (id: number) =>
    fetchApi(`site/dia-chi-mac-dinh/${id}`, "PATCH"),
};

export default addressServices;
