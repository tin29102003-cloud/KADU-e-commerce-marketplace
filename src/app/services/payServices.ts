import fetchApi from "../utils/fetchApi";
const BASE_URL_PAYMENT = process.env.NEXT_PUBLIC_PAYMENT;

const payServices = {
  getAllProductPay: (data: {
    items: { id_bt: number; id_sp: number; so_luong: number }[];
  }) => fetchApi("/site/xem-truoc-don-hang", "POST", data),
  newDonHang: (data: {
    items: { id_sp: string; so_luong: number; id_bt: number }[];
    id_km: number;
    id_dia_chi: number;
    id_pttt: number;
    ghi_chu: string;
  }) => fetchApi("/site/tao-don-hang", "POST", data),
  payment: (id_dh: number) =>
    fetchApi(`${BASE_URL_PAYMENT}/api/site/created-payment-link`, "POST", {
      id_dh,
    }),
};

export default payServices;
