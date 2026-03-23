import AccountSidebar from "@/app/components/user/AccountSidebar";
import AddressItem from "@/app/components/user/AddressItem";
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import BtnSecondary from "@/app/components/user/button/BtnSecondary";
import ErrorBlock from "@/app/components/user/ErrorBlock";
import MessageBlock from "@/app/components/user/MessageBlock";
import addressServicesServer from "@/app/services/addressServices-server";
import { TypeAddressItem } from "@/app/types/type";
import { IoIosAdd } from "react-icons/io";
import AddressList from "./addressList";
import AddressMain from "./addressMain";
import AddressPopup from "./addressPopup";

export default async function Address() {
  const result = await Promise.allSettled([
    addressServicesServer.getAddressAll(),
  ]);
  const [addressListRes] = result;
  const addressList: TypeAddressItem[] | null =
    addressListRes.status === "fulfilled"
      ? addressListRes.value.data.result.data
      : null;

  return (
    <>
      <AddressMain addressList={addressList} />
    </>
  );
}
