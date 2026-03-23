"use client";
import AddressItem from "@/app/components/user/AddressItem";
import ErrorBlock from "@/app/components/user/ErrorBlock";
import MessageBlock from "@/app/components/user/MessageBlock";
import { TypeAddressItem } from "@/app/types/type";
import React, { useState } from "react";

export default function AddressList({
  addressList,
  setAddressListProcessed,
}: {
  addressList: TypeAddressItem[] | null;
  setAddressListProcessed: React.Dispatch<
    React.SetStateAction<TypeAddressItem[] | null>
  >;
}) {
  // render
  if (addressList === null) return <ErrorBlock />;
  if (addressList !== null && addressList.length === 0)
    return <MessageBlock content="Hiện chưa có địa chỉ." />;
  if (addressList !== null && addressList.length > 0) {
    return (
      <div className="address--list">
        {addressList.map((addr) => (
          <AddressItem
            address={addr}
            setAddressListProcessed={setAddressListProcessed}
          />
        ))}
      </div>
    );
  }
}
