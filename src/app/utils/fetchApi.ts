import axios from "axios";
// import { ApiError } from "next/dist/server/api-utils";
import { ApiError } from "../types/type";

// fetch api
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_API;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
  withCredentials: true,
});

const fetchApi = async (
  endURL: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  data = {},
  params = {}
) => {
  try {
    const isFormData = data instanceof FormData;
    const res = await api({
      url: endURL,
      method,
      data,
      params,
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
    });
    return { status: res.status, data: res.data, success: res.data.success };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const message = err.response?.data?.thong_bao || err.message;
      throw {
        status,
        message,
      } as ApiError;
    }
    throw { status: -1, message: "Lỗi không xác định" } as ApiError;
  }
};

export default fetchApi;
