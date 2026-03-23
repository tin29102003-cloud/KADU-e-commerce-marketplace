import ImgLazy from "@/app/components/shared/Imglazy";
import AccountSidebar from "@/app/components/user/AccountSidebar";
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import BtnSecondary from "@/app/components/user/button/BtnSecondary";
import OrderItem from "@/app/components/user/OrderItem";
import userServiceServer from "@/app/services/userService-server";
import { TypeUserInfo } from "@/app/types/user";
import UpdateInfoUser from "./updateInfoUser";

export default async function AccountProfile() {
  const result = await Promise.allSettled([userServiceServer.getInfoUser()]);
  const [infoUserRes] = result;
  const infoUser: TypeUserInfo =
    infoUserRes.status === "fulfilled" ? infoUserRes.value.data.taiKhoan : null;
  return <UpdateInfoUser infoUser={infoUser} />;
}
