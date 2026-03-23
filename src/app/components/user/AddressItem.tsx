import { TypeAddressItem } from "@/app/types/type";
import BtnSecondary from "./button/BtnSecondary";
import React from "react";
// import addressServicesServer from "@/app/services/addressServices-server";
import addressServices from "@/app/services/addressServices";
import { toast } from "react-toastify";
import productServices from "@/app/services/productServices";

export default function AddressItem({
  address,
  setAddressListProcessed,
}: {
  address: TypeAddressItem;
  setAddressListProcessed: React.Dispatch<
    React.SetStateAction<TypeAddressItem[] | null>
  >;
}) {
  const handleDelete = async (id: string | number | undefined) => {
    try {
      if (!id) return;
      const res = await addressServices.deleteAddress(id);
      if (!res.success) return;
      toast.success("Xóa địa chỉ thành công.");
      setAddressListProcessed((prev) => {
        if (!prev) return prev;
        return prev.filter((item) => item.id !== id);
      });
    } catch (err) {
      toast.error("Có lỗi xảy ra khi xóa!");
      console.log(err);
    }
  };

  const handleSetDefaultAddress = async (id: string | number | undefined) => {
    if (!id) {
      toast.error("Có lỗi xảy ra khi set mặc định!");
      return;
    }

    try {
      const res = await addressServices.setDeffaultAddress(Number(id));
      if (!res.success) return;
      console.log(res.data);
      setAddressListProcessed((prev) => {
        if (!prev) return prev;
        return prev.map((item) => {
          if (item.id !== id) {
            return { ...item, mac_dinh: false };
          } else {
            return { ...item, mac_dinh: true };
          }
        });
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      key={address.id}
      className="address--item py-4 flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-0 border-b border-neutral-200 last:border-none"
    >
      {/* Thông tin */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="address--userName font-medium">
            {address.ho_ten}
          </span>
          <span className="address--phone text-gray-500 text-sm">
            {address.dien_thoai}
          </span>
        </div>
        <div className="address--content text-gray-500 text-sm">
          {address.dia_chi}
        </div>

        {/* Các nút */}
        {address.mac_dinh && (
          <div className="address--tag flex gap-2 mt-2">
            <BtnSecondary
              content="Mặc định"
              className="tag--addressDefault p-[3px_6px] !text-[11px] !font-normal rounded-[5px]"
            />
          </div>
        )}
      </div>

      {/* Cập nhật */}
      <div className="address--action flex-y-center gap-2 ml-auto md:ml-0">
        {!address.mac_dinh && (
          <button
            className="btn--update text-accentColor text-sm"
            onClick={(e) => handleSetDefaultAddress(address.id)}
          >
            Set mặc định
          </button>
        )}
        {!address.mac_dinh && (
          <button
            className="btn--update text-accentColor text-sm"
            onClick={() => handleDelete(address.id)}
          >
            Xóa
          </button>
        )}
      </div>
    </div>
  );
}
