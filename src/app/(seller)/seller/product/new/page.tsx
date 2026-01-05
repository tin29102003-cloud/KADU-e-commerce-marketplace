import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import SectionAddProduct from "./sectionAddproduct";
import categoryServicesServer from "@/app/services/categoryServices-server";
import productServicesServer from "@/app/services/productServices-server";

export default async function ProductNew() {
  const result = await Promise.allSettled([
    categoryServicesServer.getAllSelect(),
    productServicesServer.getThuongHieuSelect(),
    productServicesServer.getAttributeSelect(),
  ]);
  const [categoriesSelectRes, thuonghieuSelectRes, attribiteSelectRes] = result;

  const categoriesSelect: { value: string; label: string }[] =
    categoriesSelectRes.status === "fulfilled"
      ? (
          categoriesSelectRes.value.data.data as {
            id: string;
            ten_dm: string;
          }[]
        ).map((item) => ({
          value: item.id,
          label: item.ten_dm,
        }))
      : [];

  const thuonghieuSelect: { value: string; label: string }[] =
    thuonghieuSelectRes.status === "fulfilled"
      ? (
          thuonghieuSelectRes.value.data.data as {
            id: string;
            ten_th: string;
          }[]
        ).map((item) => ({
          value: item.id,
          label: item.ten_th,
        }))
      : [];

  //   attribiu tè
  const attribiteSelect: { value: string; label: string }[] =
    attribiteSelectRes.status === "fulfilled"
      ? (
          attribiteSelectRes.value.data.data as {
            id: string;
            ten_thuoc_tinh: string;
          }[]
        ).map((item) => ({
          value: item.id,
          label: item.ten_thuoc_tinh,
        }))
      : [];

  // render
  return (
    <SectionAddProduct
      categoriesSelect={categoriesSelect}
      thuonghieuSelect={thuonghieuSelect}
      attribiteSelect={attribiteSelect}
    />
  );
}
