import ImgLazy from "@/app/components/shared/Imglazy";
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import BtnSecondary from "@/app/components/user/button/BtnSecondary";
import MessageBlock from "@/app/components/user/MessageBlock";
import Product from "@/app/components/user/product/Product";
import TitleSection from "@/app/components/user/TitleSection";
import productServicesServer from "@/app/services/productServices-server";
import { TypePagination } from "@/app/types/product";
import { TypeProduct } from "@/app/types/type";
import clsx from "clsx";
import Link from "next/link";

// icons
import { CiUser, CiShop } from "react-icons/ci";

import SectionAllProduct from "./sectionAllProduct";

export default async function Shop({
  params,
  searchParams,
}: {
  params: { id: number };
  searchParams: { page?: string };
}) {
  const { id } = await params;

  const { page } = await searchParams;
  const result = await Promise.allSettled([
    productServicesServer.getProductShop(Number(id), Number(page)),
  ]);
  const [productDeffaultRes] = result;
  const dataProductDeffault =
    productDeffaultRes.status === "fulfilled"
      ? productDeffaultRes.value.data.result
      : null;
  const productDeffault: TypeProduct[] = dataProductDeffault
    ? dataProductDeffault.data
    : null;
  const pagination: TypePagination = dataProductDeffault
    ? dataProductDeffault.pagination
    : null;
  const productList: TypeProduct[] | null = productDeffault
    ? productDeffault.filter((item) => Number(item.so_luong) > 0)
    : null;

  const productOutOfStockList: TypeProduct[] | null = productDeffault
    ? productDeffault.filter((item) => Number(item.so_luong) <= 0)
    : null;
  // console.log(productOutOfStockList);
  return (
    <>
      <section className="section--shop">
        <div className="container">
          <div className="shop">
            <div className="shop--banner relative">
              <div className="img--banner ratio-box ratio:pt-[2_8] overflow-hidden rounded-md after:content-[''] after:block after:absolute after:inset-0 after:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.5))] after:z-1 after:backdrop-blur-sm">
                <ImgLazy
                  src="/images/banner/xiaomi-15t-5g-home-0925.webp"
                  alt="banner"
                  wrapperClassName="ratio-box-img"
                  className="ratio-img"
                />
              </div>
              {/* banner-content */}
              <div className="wrap--infoBanner absolute bottom-0 left-0 w-full p-4">
                <div className="seller flex">
                  <div className="seller--content flex-y-center gap-x-3 pr-base border-r border-white/50">
                    <div className="seller--logo">
                      <Link
                        href="#!"
                        className="block w-[80px] h-[80px] rounded-full border border-neutral-300 p-1"
                      >
                        <div className="box--img w-full h-full rounded-full bg-neutral-150 overflow-hidden">
                          <ImgLazy
                            src="/images/product/product-2.png"
                            alt="Seller logo"
                            className="img-full"
                          />
                        </div>
                      </Link>
                    </div>
                    <div className="seller--info">
                      <h4 className="seller--info__name font-medium text-white line-clamp-2">
                        TORANO Official Store
                      </h4>
                      <div className="seller--status flex-y-center gap-x-1 mt-1 before:content-[''] before:block before:w-[5px] before:h-[5px] before:bg-[#16A34A] before:rounded-full">
                        <span className="text-sm text-white">Online</span>
                      </div>
                      <div className="seller--action flex-y-center gap-x-2 mt-3">
                        <BtnPrimary
                          content="Theo dõi"
                          className="p-[8px_14px] text-sm"
                        >
                          <CiUser className="w-5 h-5 stroke-white stroke-[0.9px]" />
                        </BtnPrimary>
                        <BtnSecondary
                          content="Chat"
                          className="p-[8px_14px] text-sm"
                        >
                          <CiShop className="w-5 h-5 stroke-accentColor stroke-[0.9px]" />
                        </BtnSecondary>
                      </div>
                    </div>
                  </div>
                  {/*  */}
                  <div className="info--seller grow pl-base">
                    <ul className="infoSeller--list grid grid-cols-3 gap-base">
                      {Array.from({ length: 6 }).map((item) => (
                        <li className="item flex-y-center gap-x-1">
                          <div className="title flex-y-center gap-x-2">
                            <div className="icon text-xl text-white">
                              <CiShop />
                            </div>
                            <span className="content text-sm text-white">
                              Sản phẩm:
                            </span>
                          </div>
                          <span className="content text-sm font-medium text-accentColor">
                            199
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <nav className="menu--seller">
        <ul className="menuSeller-list">
          <li className="item">
            <Link href="#!">Menu 1</Link>
          </li>
          <li className="item">
            <Link href="#!">Menu 1</Link>
          </li>
          <li className="item">
            <Link href="#!">Menu 1</Link>
          </li>
          <li className="item">
            <Link href="#!">Menu 1</Link>
          </li>
        </ul>
      </nav> */}
      <SectionAllProduct productList={productList} pagination={pagination} />
      {/* {productShopList.filter((item)=>Number(item.so_luong)<=0)} */}
      {productOutOfStockList && productOutOfStockList?.length > 0 && (
        <section className="section--productOutOfStock section-py">
          <div className="container">
            <div className="productOutOfStock">
              <TitleSection title="Sản phẩm hết hàng" />
              <ul className="productOutOfStock--list grid-col4 mt-base">
                {productOutOfStockList.map((p) => (
                  <Product product={p} />
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
