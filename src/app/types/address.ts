// export interface TypeAddressItem {
//   id: number;
//   ho_ten: string;
//   dien_thoai: number;
//   dia_chi: string;
//   tinh: string;
//   quan: string;
//   phuong: string;
//   mac_dinh: boolean;
// }

export interface TypeTinh {
  province_id: string;
  province_name: string;
  province_type: string;
}
export interface TypeQuan {
  district_id: string;
  district_name: string;
  district_type: string;
}
export interface TypePhuong {
  ward_id: string;
  ward_name: string;
  ward_type: string;
}
