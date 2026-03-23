import axios from "axios";

export const loginApi = async (tai_khoan, mat_khau) => {
  const res = await axios.post(
    "http://localhost:5000/api/login",
    {
      tai_khoan,
      mat_khau,
    },
    {
      withCredentials: true, // để backend set cookie refresh token
    }
  );

  if (res.data.success) {
    localStorage.setItem("accessToken", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res.data;
};

export const logoutApi = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};
