import Image from "next/image";
import Link from "next/link";
import { Swiper } from "swiper";
import React from "react";
import AutoScroll from "embla-carousel-auto-scroll";

import { CiHeart, CiLocationOn } from "react-icons/ci";

// type
import type { TypeProduct } from "../types/type";
import type { TypeCategory } from "../types/type";

// component
import BtnSeeAll from "../components/user/BtnSeeAll";
import BtnCircle from "../components/user/BtnCircle";
import Banner from "../components/user/banner/Banner";
import Product from "../components/user/product/Product";
import ProductSkeleton from "../components/user/skeleton/ProductSkeleton";
import TitleSection from "../components/user/TitleSection";
// import ProductSwiper from "../components/user/product/ProductSwiper";
import SlideEmbla from "../components/user/product/SlideEmbla";
import ErrorBlock from "../components/user/ErrorBlock";
import SlideProductEmbla from "../components/user/product/SlideProductEmbla";
import CategoryItem from "../components/user/CategoryItem";
import BtnSecondary from "../components/user/button/BtnSecondary";
import SlideLogo from "../components/user/SlideLogo";
// lazyload img
import ImgLazy from "../components/shared/Imglazy";

// services
import bannerServices from "../services/bannerServices";
import productServices from "../services/productServices";
import { JSX } from "react";
import productServicesServer from "../services/productServices-server";
import categoryServicesServer from "../services/categoryServices-server";
import MessageBlock from "../components/user/MessageBlock";

export default async function Home() {
  const result = await Promise.allSettled([
    productServices.getAll(),
    productServicesServer.getProductSale(),
    categoryServicesServer.getAllParent(),
    productServicesServer.getProductFeatured(),
    // bannerServices.getAll(),
    // categoryServices.getAll(),
  ]);

  const [
    listProductRes,
    listProductSaleRes,
    listCategoriesRes,
    productFeaturedRes,
  ] = result;
  const listProduct: TypeProduct[] =
    listProductRes.status === "fulfilled"
      ? listProductRes.value.data.result.data
      : null;
  // console.log(listProduct);
  // product sale
  const listProductSale: TypeProduct[] =
    listProductSaleRes.status === "fulfilled"
      ? listProductSaleRes.value.data.result.data
      : null;

  // categories
  const listCategories: TypeCategory[] =
    listCategoriesRes.status === "fulfilled"
      ? listCategoriesRes.value.data.data
      : null;

  // sản phẩm nổi bậc
  const productFeatured: TypeProduct[] =
    productFeaturedRes.status === "fulfilled"
      ? productFeaturedRes.value.data.result.data
      : null;

  // const sp1 = listProduct.filter((item) => item.noi_bat === true);
  // console.log(sp1);
  // const [listBannerRes, listProductRes, categoryRes] = result;
  // const listBanner =
  //   listBannerRes.status === "fulfilled" ? listBannerRes.value : null;
  // const listProduct: TypeProduct[] =
  //   listProductRes.status === "fulfilled" ? listProductRes.value : null;
  // const listCategory: TypeCategory[] =
  //   categoryRes.status === "fulfilled" ? categoryRes.value : null;
  // render

  // product sale
  // const listProductSale = listProduct
  //   ? listProduct.filter((prd) => Number(prd.sale) === 1)
  //   : null;

  // product suggest
  // const productSuggest = listProduct ? listProduct : null;

  // handle arr category

  // /chạy lại
  let handleArrCategory: JSX.Element[] = [];

  if (listCategories) {
    for (let i = 0; i < listCategories.length; i += 2) {
      const group = listCategories.slice(i, i + 2);
      handleArrCategory.push(
        <div
          key={i}
          className="category--list__col grid grid-rows-2 gap-y-base h-full"
        >
          {group.map((ctgr) => (
            <CategoryItem
              key={ctgr.id}
              className="select-none"
              category={ctgr}
            />
          ))}
        </div>
      );
    }
  }

  return (
    <>
      <Banner />
      {/*section sale */}
      <section className="section--sale section-py">
        <div className="container">
          <div className="block--productSale">
            {/* top */}
            <div className="sale--top flex-between-center">
              {/* title */}
              <div className="sale--title flex items-center gap-x-2">
                <div className="sale--title__ic">
                  <ImgLazy
                    src="/images/icons/icon-sale.png"
                    alt="icon sale"
                    className="max-w-[46px] h-auto"
                  />
                </div>
                <TitleSection title="Sale chớp nhoáng" />
              </div>
              {/* time sale  */}
              {/* <div className="sale--time flex flex-col items-center gap-y-2 bg-primaryColor border border-bd-f5 rounded-lg p-2">
                <div className="inline-block sale--time__title text-xs text-[#DC2626] bg-[#FFEEEE] rounded-full p-[6px_10px] font-medium">
                  Kết thúc sau
                </div>
                <ul className="list--timeSale flex items-center gap-x-2">
                  <li className="list--timeSale__item flex flex-col items-center gap-y-1">
                    <div className="time w-[52px] h-[48px] bg-white border border-[#EDEDED] rounded-lg flex-center">
                      <span className="title-24 text-accentColor font-semibold">
                        00
                      </span>
                    </div>
                    <span className="content text-xs font-medium">Ngày</span>
                  </li>
                  <li className="list--timeSale__dot flex flex-col items-center gap-y-2">
                    <span className="w-[5px] h-[5px] rounded-full bg-accentColor"></span>
                    <span className="w-[5px] h-[5px] rounded-full bg-accentColor"></span>
                  </li>
                  <li className="list--timeSale__item flex flex-col items-center gap-y-1">
                    <div className="time w-[52px] h-[48px] bg-white border border-[#EDEDED] rounded-lg flex-center">
                      <span className="title-24 text-accentColor font-semibold">
                        00
                      </span>
                    </div>
                    <span className="content text-xs font-medium">Ngày</span>
                  </li>
                  <li className="list--timeSale__dot flex flex-col items-center gap-y-2">
                    <span className="w-[5px] h-[5px] rounded-full bg-accentColor"></span>
                    <span className="w-[5px] h-[5px] rounded-full bg-accentColor"></span>
                  </li>
                  <li className="list--timeSale__item flex flex-col items-center gap-y-1">
                    <div className="time w-[52px] h-[48px] bg-white border border-[#EDEDED] rounded-lg flex-center">
                      <span className="title-24 text-accentColor font-semibold">
                        00
                      </span>
                    </div>
                    <span className="content text-xs font-medium">Ngày</span>
                  </li>
                  <li className="list--timeSale__dot flex flex-col items-center gap-y-2">
                    <span className="w-[5px] h-[5px] rounded-full bg-accentColor"></span>
                    <span className="w-[5px] h-[5px] rounded-full bg-accentColor"></span>
                  </li>
                  <li className="list--timeSale__item flex flex-col items-center gap-y-1">
                    <div className="time w-[52px] h-[48px] bg-white border border-[#EDEDED] rounded-lg flex-center">
                      <span className="title-24 text-accentColor font-semibold">
                        00
                      </span>
                    </div>
                    <span className="content text-xs font-medium">Ngày</span>
                  </li>
                </ul>
              </div> */}
            </div>
            {/* list product */}
            {listProductSale === null && <ErrorBlock />}
            {listProductSale !== null && listProductSale.length === 0 && (
              <MessageBlock content="Hiện không có sản phẩm sale!" />
            )}
            {listProductSale && listProductSale.length > 0 && (
              <div className="sale--listProduct mt-base">
                <SlideProductEmbla listProduct={listProductSale} />
              </div>
            )}

            <div className="flex-x-center mt-base">
              <BtnSeeAll href="/product/sale" />
            </div>
          </div>
        </div>
      </section>

      {/* section category */}
      <section className="section--category section-py">
        <div className="container">
          <div className="block--category">
            <div className="category--top flex-between-center">
              <TitleSection title="Danh mục Hot" />
              <BtnSeeAll href="/all_categories" />
            </div>
            {/* list category */}
            {/* chạy lại */}
            {handleArrCategory ? (
              handleArrCategory.length > 0 && (
                <div className="category--main mt-base grid grid-cols-12 gap-x-base">
                  <div className="category--banner col-span-3">
                    <Link
                      href=""
                      className="block w-full h-full clip-tr-bl ratio-box rounded-lg"
                    >
                      <ImgLazy
                        src="./images/category/category-banner.jpg"
                        alt="category item"
                        className="img-full"
                        wrapperClassName="ratio-img"
                      />
                    </Link>
                  </div>
                  <div className="category--list col-span-9">
                    <SlideEmbla containerClassName="h-full">
                      <div className="embla__container grid-col5-slide h-full">
                        {handleArrCategory.map((ctgr, i) => (
                          <React.Fragment key={i}>{ctgr}</React.Fragment>
                        ))}
                      </div>
                    </SlideEmbla>
                  </div>
                </div>
              )
            ) : (
              <ErrorBlock desc="Đã có lỗi xảy ra vui lòng thử lại sau." />
            )}
          </div>
        </div>
      </section>

      {/* section product betseller */}
      <section className="section--bestSeller section-py">
        <div className="container">
          <div className="block--bestSeller">
            <div className="bestSeller--top flex-between-center">
              <TitleSection title="Sản phẩm nổi bậc" />
              <BtnSeeAll />
            </div>
            {productFeatured ? (
              // productFeatured\
              productFeatured.length > 0 && (
                <div className="bestSeller--list mt-base">
                  <SlideProductEmbla listProduct={productFeatured} />
                </div>
              )
            ) : (
              <ErrorBlock />
            )}
          </div>
        </div>
      </section>

      {/* slide logo */}
      <SlideLogo />

      {/* section product suggest */}
      <section className="section--suggest section-py">
        <div className="container">
          <div className="block--suggest">
            <div className="suggest--top flex-between">
              <TitleSection title="Gợi ý hôm nay" />
              <BtnSeeAll />
            </div>
            <ul className="suggest--list mt-base grid-col5">
              {listProduct &&
                listProduct.length > 0 &&
                listProduct.map((prd: TypeProduct) => (
                  <Product product={prd} />
                ))}
            </ul>
            <div className="flex-x-center mt-base">
              <BtnSecondary />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
