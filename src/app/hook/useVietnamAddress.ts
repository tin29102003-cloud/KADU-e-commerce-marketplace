import { useEffect, useState } from "react";
import axios from "axios";

export type Option = {
  value?: string;
  label?: string;
};

export default function useVietnamAddress() {
  const [rawData, setRawData] = useState<any[]>([]);

  const [provinceOpts, setProvinceOpts] = useState<Option[]>([]);
  const [districtOpts, setDistrictOpts] = useState<Option[]>([]);
  const [wardOpts, setWardOpts] = useState<Option[]>([]);

  const [provinceCode, setProvinceCode] = useState<string>();
  const [districtCode, setDistrictCode] = useState<string>();
  const [wardCode, setWardCode] = useState<string>();
  // fetch
  useEffect(() => {
    (async () => {
      const res = await axios.get(
        "https://provinces.open-api.vn/api/v2/?depth=2"
      );
      console.log(res.data);
      setRawData(res.data);

      setProvinceOpts(
        res.data.map((p: any) => ({
          value: String(p.code),
          label: p.name,
        }))
      );
    })();
  }, []);

  const selectProvince = (opt: Option | null) => {
    if (!opt) return;

    setProvinceCode(opt.value);
    setDistrictCode(undefined);
    setWardCode(undefined);
    setWardOpts([]);

    const province = rawData.find((p: any) => String(p.code) === opt.value);

    if (!province) return;

    setDistrictOpts(
      province.districts.map((d: any) => ({
        value: String(d.code),
        label: d.name,
      }))
    );
  };

  // chọn quận
  const selectDistrict = (opt: Option | null) => {
    if (!opt) return;

    setDistrictCode(opt.value);
    setWardCode(undefined);

    const province = rawData.find((p: any) => String(p.code) === provinceCode);

    const district = province?.districts.find(
      (d: any) => String(d.code) === opt.value
    );

    if (!district) return;

    setWardOpts(
      district.wards.map((w: any) => ({
        value: String(w.code),
        label: w.name,
      }))
    );
  };

  // chọn phường
  const selectWard = (opt: Option | null) => {
    if (!opt) return;
    setWardCode(opt.value);
  };

  return {
    provinceOpts,
    districtOpts,
    wardOpts,
    //
    provinceCode,
    districtCode,
    wardCode,
    //
    selectProvince,
    selectDistrict,
    selectWard,
  };
}
