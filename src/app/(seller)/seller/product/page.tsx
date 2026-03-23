import ImgLazy from "@/app/components/shared/Imglazy";
import ErrorBlock from "@/app/components/user/ErrorBlock";
import MessageBlock from "@/app/components/user/MessageBlock";
import productServicesServer from "@/app/services/productServices-server";
import { TypeProduct } from "@/app/types/type";
import ProductSellerItem from "@/app/components/user/product/ProductSellerItem";
import Pagination from "@/app/(user)/search/pagination";
import SectionAllPrdSeller from "./sectionAllPrdSeller";

export default async function ProductSeller({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page: string };
}) {
  const { page } = await searchParams;
  const result = await Promise.allSettled([
    productServicesServer.getProductSeller(Number(page)),
  ]);
  const [productSellerRes] = result;
  const productSeller: TypeProduct[] | null =
    productSellerRes.status === "fulfilled"
      ? productSellerRes.value.data.result.data
      : null;
  const pagination =
    productSellerRes.status === "fulfilled"
      ? productSellerRes.value.data.result.pagination
      : null;

  return (
    <section className="section--allProductSeller section-py">
      <div className="allProductSeller">
        <div className="overflow-x-auto rounded border bg-white text-sm">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-[80px_1.5fr_1fr_1fr_1fr_1fr_1fr] border-b bg-gray-50 px-4 py-3 font-medium text-gray-600">
            <div>Hình</div>
            <div>Sản phẩm</div>
            <div>Mã SP</div>
            <div>Giá </div>
            <div>Số lượng</div>
            <div>Trạng thái</div>
            <div className="text-right">Hành động</div>
          </div>

          {/* list prd */}
          <SectionAllPrdSeller productSeller={productSeller} />
        </div>
        <Pagination pagination={pagination} />
      </div>
    </section>
  );
}
