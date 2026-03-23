"use client";
import AccountSidebar from "@/app/components/user/AccountSidebar";
import AddressItem from "@/app/components/user/AddressItem";
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import BtnSecondary from "@/app/components/user/button/BtnSecondary";
import ErrorBlock from "@/app/components/user/ErrorBlock";
import MessageBlock from "@/app/components/user/MessageBlock";
import { IoIosAdd } from "react-icons/io";
import AddressList from "./addressList";
import { TypeAddressItem } from "@/app/types/type";
import { useState } from "react";
import AddressPopup from "./addressPopup";
export default function AddressMain({
  addressList,
}: {
  addressList: TypeAddressItem[] | null;
}) {
  const [openAddressPopup, setOpenAddressPopup] = useState(false);
  const [addressListProcessed, setAddressListProcessed] = useState<
    TypeAddressItem[] | null
  >(addressList);
  return (
    <div className="address bg-white rounded-md shadow-[1px_1px_5px_rgba(0,0,0,0.15)] p-6">
      <div className="address--header flex-between-center gap-3 border-b border-bd-primary pb-3 mb-4">
        <h1 className="text-xl font-medium text-gray-800">Địa chỉ</h1>
        <BtnPrimary
          content="Thêm địa chỉ"
          className=" text-white !p-[8px_16px]"
          onClick={() => setOpenAddressPopup((prev) => !prev)}
        >
          <IoIosAdd className="text-2xl" />
        </BtnPrimary>
      </div>
      {/* main */}

      <AddressList
        addressList={addressListProcessed}
        setAddressListProcessed={setAddressListProcessed}
      />
      <AddressPopup
        isOpen={openAddressPopup}
        setOpenAddressPopup={setOpenAddressPopup}
        setAddressListProcessed={setAddressListProcessed}
      />
    </div>
  );
}
