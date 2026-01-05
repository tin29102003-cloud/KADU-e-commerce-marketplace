import Link from "next/link";
import clsx from "clsx";

// icons
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { CiFilter } from "react-icons/ci";

// types
import type { TypeProduct } from "@/app/types/type";

import productServicesServer from "@/app/services/productServices-server";
import { TypeCategoriesAll } from "@/app/types/category";
import { TypePagination, TypeTrademark } from "@/app/types/product";
import SectionCollectionAll from "./sectionCollectionAll";

type TypeQueryParams = {
  min_price: string;
  max_price: string;
  brands: string;
  rating: string;
  is_on_sale: string;
  sort: string;
  page: string;
};

export default async function CollectionAll({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: TypeQueryParams;
}) {
  const { slug } = await params;
  //
  const {
    min_price,
    max_price,
    brands,
    rating,
    is_on_sale,
    sort,
    page,
  }: TypeQueryParams = await searchParams;
  const result = await Promise.allSettled([
    productServicesServer.productFilter(slug, {
      min_price,
      max_price,
      brands,
      rating,
      is_on_sale,
      sort,
      page,
    }),
    productServicesServer.getThuongHieu(),
  ]);
  //
  const [defaultDataFilterRes, trademarkListRes] = result;

  //
  const productFilterList: TypeProduct[] =
    defaultDataFilterRes.status === "fulfilled"
      ? defaultDataFilterRes.value.data.data.product
      : null;
  const currentDmId =
    defaultDataFilterRes.status === "fulfilled"
      ? defaultDataFilterRes.value.data.data.current_danhmuc_id
      : null;
  // pagination
  const pagination: TypePagination =
    defaultDataFilterRes.status === "fulfilled"
      ? defaultDataFilterRes.value.data.data.pagination
      : null;
  // trademark
  const trademarkList: TypeTrademark[] | null =
    trademarkListRes.status === "fulfilled"
      ? trademarkListRes.value.data.data
      : null;
  const categoryList: {
    parent: {
      id: number;
      ten_dm: string;
      slug: string;
    };
    children: [TypeCategoriesAll];
  } =
    defaultDataFilterRes.status === "fulfilled"
      ? defaultDataFilterRes.value.data.data.sidebar
      : null;

  // render
  // const handlePagination = (p: number) => {
  //   pushFilters({ page: p });
  // };
  return (
    <SectionCollectionAll
      categoryList={categoryList}
      slug={slug}
      trademarkList={trademarkList}
      productFilterList={productFilterList}
      pagination={pagination}
      currentDmId={currentDmId}
    />
  );
}
