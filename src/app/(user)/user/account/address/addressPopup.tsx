import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import SelectClient from "@/app/components/user/SelectClient";
import addressServices from "@/app/services/addressServices";
import { TypePhuong, TypeQuan, TypeTinh } from "@/app/types/address";
import { TypeAddressItem } from "@/app/types/type";
import { validatorPhone, validatorString } from "@/app/utils/form";
import axios from "axios";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
type Option = { value: string; label: string };

export default function AddressPopup({
  isOpen,
  setOpenAddressPopup,
  setAddressListProcessed,
}: {
  isOpen?: boolean;
  setOpenAddressPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setAddressListProcessed: React.Dispatch<
    React.SetStateAction<TypeAddressItem[] | null>
  >;
}) {
  const [ho_ten, setHo_ten] = useState<string>("");
  const [dien_thoai, setDien_thoai] = useState<string>("");
  const [dia_chi, setDia_chi] = useState<string>("");
  const [tinh, setTinh] = useState<string>("");
  const [quan, setQuan] = useState<string>("");
  const [phuong, setPhuong] = useState<string>("");
  const [mac_dinh, setMac_dinh] = useState<boolean>(false);
  const [map, setMap] = useState();
  const [tinhOpts, setTinhOpts] = useState<Option[]>([]);
  const [quanOpts, setQuanOpts] = useState<Option[]>([]);
  const [phuongOpts, setPhuongOpts] = useState<Option[]>([]);

  const [isValid, setIsValid] = useState({
    ho_ten: false,
    dien_thoai: false,
    dia_chi: false,
    tinh: false,
    quan: false,
    phuong: false,
  });
  const [errForm, setErrForm] = useState({
    ho_ten: "",
    dien_thoai: "",
    dia_chi: "",
    tinh: "",
    quan: "",
    phuong: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          "https://api.vnappmob.com/api/v2/province/"
        );
        if (res.status !== 200) return;
        setTinhOpts(
          res.data.results.map((item: TypeTinh) => ({
            value: item.province_id,
            label: item.province_name,
          }))
        );
        console.log(res.data.results);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const handleValidatorUserName = (val: string) => {
    setHo_ten(val);
    const isValid = validatorString(val, (errMsg) => {
      setErrForm((prev) => ({ ...prev, ho_ten: errMsg }));
    });
    setIsValid((prev) => ({ ...prev, ho_ten: isValid }));
  };
  const handleValidatorPhone = (val: string) => {
    setDien_thoai(val);
    const isValid = validatorPhone(val, (errMsg) => {
      setErrForm((prev) => ({ ...prev, dien_thoai: errMsg }));
    });
    setIsValid((prev) => ({ ...prev, dien_thoai: isValid }));
  };
  const handleValidatorAddress = (val: string) => {
    setDia_chi(val);
    const isValid = validatorString(val, (errMsg) => {
      setErrForm((prev) => ({ ...prev, dia_chi: errMsg }));
    });
    setIsValid((prev) => ({ ...prev, dia_chi: isValid }));
  };
  // const handleValidatorConscious = (val: string) => {
  //   setTinh(val);
  //   const isValid = validatorString(val, (errMsg) => {
  //     setErrForm((prev) => ({ ...prev, tinh: errMsg }));
  //   });
  //   setIsValid((prev) => ({ ...prev, tinh: isValid }));
  // };
  // const handleValidatorDistrict = (val: string) => {
  //   setQuan(val);
  //   const isValid = validatorString(val, (errMsg) => {
  //     setErrForm((prev) => ({ ...prev, quan: errMsg }));
  //   });
  //   setIsValid((prev) => ({ ...prev, quan: isValid }));
  // };
  // const handleValidatorWard = (val: string) => {
  //   setPhuong(val);
  //   const isValid = validatorString(val, (errMsg) => {
  //     setErrForm((prev) => ({ ...prev, phuong: errMsg }));
  //   });
  //   setIsValid((prev) => ({ ...prev, phuong: isValid }));
  // };

  const handleSubmit = async () => {
    if (!isValid.dia_chi && !isValid.dien_thoai && !isValid.ho_ten) return;
    const objPost: TypeAddressItem = {
      ho_ten: ho_ten,
      dien_thoai: dien_thoai,
      dia_chi: dia_chi,
      tinh: tinh,
      quan: quan,
      phuong: phuong,
      mac_dinh: mac_dinh,
    };
    console.log(objPost);
    try {
      const res = await addressServices.addAddress(objPost);
      if (!res.success) return;
      setAddressListProcessed((prev) => {
        const current = prev ?? [];
        return [...current, { id: res.data.id, ...objPost }];
      });
      toast.success("Thêm địa chỉ mới thành công.");
      setOpenAddressPopup(false);
    } catch (err) {
      console.log(err);
      toast.error("Có lỗi xảy ra trong quá trình thêm!");
    }
  };

  const handleSelectTinh = (val: string | undefined) => {
    if (!val) return;
    console.log(val);
    setTinh(val);
  };
  const handleSelectQuan = (val: string | undefined) => {
    if (!val) return;
    console.log(val);
    setQuan(val);
  };
  const handleSelectPhuong = (val: string | undefined) => {
    if (!val) return;
    console.log(val);
    setPhuong(val);
  };
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `https://api.vnappmob.com/api/v2/province/district/${tinh}`
        );
        if (res.status !== 200) return;
        setQuanOpts(
          res.data.results.map((item: TypeQuan) => ({
            value: item.district_id,
            label: item.district_name,
          }))
        );
      } catch (err) {
        console.log(err);
      }
    })();
  }, [tinh]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `https://api.vnappmob.com/api/v2/province/ward/${quan}`
        );
        if (res.status !== 200) return;
        console.log(res.data);
        setPhuongOpts(
          res.data.results.map((item: TypePhuong) => ({
            value: item.ward_id,
            label: item.ward_name,
          }))
        );
      } catch (err) {
        console.log(err);
      }
    })();
  }, [quan]);

  // const handleSelectQuan = (val: string | undefined) => {};
  return (
    <div
      className={clsx(
        "address--popup fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-all-300-ease",
        !isOpen ? "opacity-0 invisible" : ""
      )}
      onClick={() => setOpenAddressPopup((prev) => !prev)}
    >
      <div
        className="bg-white rounded-lg w-[90%] max-h-[95vh] overflow-y-auto style-scroll-1 max-w-lg p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className="text-lg font-semibold mb-4">Địa chỉ mới</h2>

        {/* Form */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="block--inp">
              <input
                type="text"
                placeholder="Họ và tên"
                className="style-inp-1"
                onChange={(e) => handleValidatorUserName(e.target.value)}
              />
              {errForm.ho_ten && (
                <span className={clsx("err--form")}>{errForm.ho_ten}</span>
              )}
            </div>

            <div className="block--inp">
              <input
                type="text"
                placeholder="Số điện thoại"
                className="style-inp-1"
                onChange={(e) => handleValidatorPhone(e.target.value)}
              />
              {errForm.dien_thoai && (
                <span className={clsx("err--form")}>{errForm.dien_thoai}</span>
              )}
            </div>
            <div className="block--inp col-span-full">
              {/* <input
                type="text"
                placeholder="Tỉnh / Thành phố"
                className="style-inp-1"
                // onChange={(e) => handleValidatorConscious(e.target.value)}
              /> */}
              <SelectClient
                options={tinhOpts}
                placeholder="Tỉnh / Thành phố"
                onChange={(val) => handleSelectTinh(val?.value)}
              />
              {errForm.tinh && (
                <span className={clsx("err--form")}>{errForm.tinh}</span>
              )}
            </div>
            <div className="block--inp col-span-full">
              <SelectClient
                options={quanOpts}
                placeholder="Quận / Huyện"
                onChange={(val) => handleSelectQuan(val?.value)}
              />
              {/* {errForm.quan && (
                <span className={clsx("err--form")}>{errForm.quan}</span>
              )} */}
            </div>
            <div className="block--inp col-span-full">
              <SelectClient
                options={phuongOpts}
                placeholder="Phường / Xã"
                onChange={(val) => handleSelectPhuong(val?.value)}
              />
              {/* <input
                type="text"
                placeholder="Phường / Xã"
                className="style-inp-1"
                onChange={(e) => handleValidatorWard(e.target.value)}
              /> */}
            </div>

            {errForm.phuong && (
              <span className={clsx("err--form")}>{errForm.phuong}</span>
            )}
            <div className="block--inp col-span-full">
              <textarea
                placeholder="Địa chỉ cụ thể"
                className="style-inp-1 h-[120px]"
                onChange={(e) => handleValidatorAddress(e.target.value)}
              />
              {errForm.dia_chi && (
                <span className={clsx("err--form")}>{errForm.dia_chi}</span>
              )}
            </div>
          </div>

          {/* <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400">
            <option>Tỉnh/ Thành phố, Quận/ Huyện, Phường/ Xã</option>
          </select> */}

          {/* Loại địa chỉ */}
          {/* <div className="flex gap-3 mt-2">
            <button className="flex-1 border border-gray-300 rounded-md py-2 hover:bg-gray-100">
              Nhà Riêng
            </button>
            <button className="flex-1 border border-gray-300 rounded-md py-2 hover:bg-gray-100">
              Văn Phòng
            </button>
          </div> */}

          {/* Default checkbox */}
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="defaultAddress"
              className="mr-2 cursor-pointer"
              onChange={(e) => setMac_dinh(e.target.checked)}
            />
            <label
              htmlFor="defaultAddress"
              className="text-sm text-gray-600 cursor-pointer select-none"
            >
              Đặt làm địa chỉ mặc định
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="popup--action flex justify-end mt-5 gap-3">
          {/* <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Trở Lại
          </button> */}
          <BtnPrimary content="Hoàn thành" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
