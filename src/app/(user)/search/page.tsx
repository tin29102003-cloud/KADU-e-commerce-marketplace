import ErrorBlock from "@/app/components/user/ErrorBlock";
import MessageBlock from "@/app/components/user/MessageBlock";
import Product from "@/app/components/user/product/Product";
import TitleSection from "@/app/components/user/TitleSection";

import productServicesServer from "@/app/services/productServices-server";
import { TypeProduct } from "@/app/types/type";
import Pagination from "./pagination";

export default async function Search({
  searchParams,
}: {
  searchParams: { query: string; page: string };
}) {
  const { query, page } = await searchParams;

  const result = await Promise.allSettled([
    productServicesServer.searchProduct(query, Number(page)),
  ]);
  const [listProductSearchRes] = result;
  const listProductSearch: TypeProduct[] =
    listProductSearchRes.status === "fulfilled"
      ? listProductSearchRes.value.data.result.data
      : null;
  console.log(listProductSearch);
  const pagination =
    listProductSearchRes.status === "fulfilled"
      ? listProductSearchRes.value.data.result.pagination
      : null;

  // pagination

  return (
    <section className="section--search section-py">
      <div className="container">
        <div className="section--search">
          <TitleSection title="Tìm kiếm" />
          {listProductSearch === null && <ErrorBlock className="mt-base" />}
          {listProductSearch !== null && listProductSearch.length === 0 && (
            <MessageBlock
              content="Không tìm thấy sản phẩm!"
              className="mt-base"
            />
          )}
          {listProductSearch !== null && listProductSearch.length > 0 && (
            <ul className="searchResult--list grid-col5 mt-base">
              {listProductSearch.map((prd) => (
                <Product product={prd} />
              ))}
            </ul>
          )}
        </div>
        <Pagination pagination={pagination} />
      </div>
    </section>
  );
}
