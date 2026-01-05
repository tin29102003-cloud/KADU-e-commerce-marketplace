// lib/fetchApiServer.ts
import { cookies } from "next/headers";
import { ApiError } from "../types/type";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_API;

const fetchApiServer = async (
  endURL: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  data: any = {},
  params: Record<string, any> = {}
) => {
  try {
    const cookieHeader = (await cookies()).toString();

    const url = new URL(`${BASE_URL}${endURL}`);
    Object.entries(params).forEach(([k, v]) =>
      url.searchParams.append(k, String(v))
    );

    const res = await fetch(url.toString(), {
      method,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: method !== "GET" ? JSON.stringify(data) : undefined,
      cache: "no-store",
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw {
        status: res.status,
        message: errData?.thong_bao || "Server error",
      } as ApiError;
    }

    const result = await res.json();
    return {
      status: res.status,
      data: result,
      success: result?.success,
    };
  } catch (err: any) {
    if (err?.status) throw err;
    throw {
      status: -1,
      message: "Lỗi không xác định (server)",
    } as ApiError;
  }
};
export default fetchApiServer;
