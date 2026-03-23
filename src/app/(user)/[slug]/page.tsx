import Link from "next/link";
import axios from "axios";
import NotFound from "@/app/not-found";

// icon
import { FaStar } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { LiaShippingFastSolid } from "react-icons/lia";
import { CiUser, CiShop } from "react-icons/ci";

// type
import type { ProductDetail, TypeProduct } from "@/app/types/type";

// component
import Breadcrumb from "@/app/components/user/Breadcrumb";
import ImgLazy from "@/app/components/shared/Imglazy";
import BtnSecondary from "@/app/components/user/button/BtnSecondary";
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import QuantityBox from "@/app/components/user/Quantitybox";
import CommentItem from "@/app/components/user/CommentItem";
import SlideEmbla from "@/app/components/user/product/SlideEmbla";
import Product from "@/app/components/user/product/Product";
import PromoCodeItem from "@/app/components/user/PromoCodeItem";

// services
import productServices from "@/app/services/productServices";
import ErrorBlock from "@/app/components/user/ErrorBlock";
import TitleSection from "@/app/components/user/TitleSection";
import SlideProductEmbla from "@/app/components/user/product/SlideProductEmbla";
import BannerProductDetail from "@/app/components/user/SlideProductDetail";
import commentServices from "@/app/services/commentServices";

// helper
import { formatMoney } from "@/app/utils/helper";
import DetailProductMain from "@/app/components/user/product/DetailProductMain";
import { TypeComment } from "@/app/types/comment";
import MessageBlock from "@/app/components/user/MessageBlock";
import voucherServcesServer from "@/app/services/voucherServices-server";
import { TypePromoCode } from "@/app/types/promoCode";
import TitleAside from "@/app/components/user/TitleAside";
import RenderStar from "@/app/components/user/RenderStar";

export default async function DetailProduct({
  params,
}: {
  params: { slug: string };
}) {
  // fetch api
  const { slug } = await params;

  const result = await Promise.allSettled([
    productServices.getOneProduct(slug),
    voucherServcesServer.getAll(),
  ]);
  const [detailProductDefaultRes, voucherListRes] = result;

  const detailProductDefault =
    detailProductDefaultRes.status === "fulfilled"
      ? detailProductDefaultRes.value.data.result.data
      : null;

  // voucher
  const voucherList: TypePromoCode[] =
    voucherListRes.status === "fulfilled"
      ? voucherListRes.value.data.data
      : null;
  //detail product
  const productDetail: ProductDetail = detailProductDefault
    ? detailProductDefault.san_pham
    : {};
  // product related
  const produceRelatedList: TypeProduct[] =
    detailProductDefault && detailProductDefault.san_pham_cung_loai.length > 0
      ? detailProductDefault.san_pham_cung_loai
      : null;

  // comment
  const commentListRes = await commentServices.getOne(productDetail.id);
  const commentList: TypeComment[] | null = commentListRes.success
    ? commentListRes.data.result.data
    : null;
  console.log(productDetail);
  return (
    <>
      {/* info seller */}
      <DetailProductMain product={productDetail} />
      <section className="section--seller section-py">
        <div className="container">
          <div className="seller flex-y-center p-5 rounded-lg border border-bd-primary">
            <div className="seller--card relative flex-y-center gap-x-3 pr-5 after:content-[''] after:block after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[90%] after:border-r-[1.2px] after:border-neutral-150">
              <div className="seller--logo">
                <Link
                  href={`/shop/${productDetail.shop.id}`}
                  className="block w-[80px] h-[80px] rounded-full border border-neutral-300 p-1"
                >
                  <div className="box--img w-full h-full rounded-full bg-neutral-150 overflow-hidden">
                    <ImgLazy
                      src={
                        productDetail.shop.hinh !== null
                          ? productDetail.shop.hinh
                          : "/images/avatar-shop-default.jpg"
                      }
                      connectHost={productDetail.shop.hinh !== null}
                      alt="Seller logo"
                      className="img-full"
                    />
                  </div>
                </Link>
              </div>
              <div className="seller--info">
                <h4 className="seller--info__name font-medium line-clamp-2">
                  {productDetail.shop.ten_shop}
                </h4>
                <div className="seller--status flex-y-center gap-x-1 mt-1 before:content-[''] before:block before:w-[5px] before:h-[5px] before:bg-[#16A34A] before:rounded-full">
                  <span className="text-sm text-[#16A34A]">Online</span>
                </div>
                <div className="seller--action flex-y-center gap-x-2 mt-3">
                  <Link
                    href={`/shop/${productDetail.shop.id}`}
                    className="btn btn--primary flex items-center gap-x-2 !p-[8px_14px] !text-sm"
                  >
                    <CiShop className="w-5 h-5 stroke-white stroke-[0.9px]" />
                    Xem shop
                  </Link>
                  {/* <BtnPrimary className="p-[8px_14px] text-sm">
                    <CiShop className="w-5 h-5 stroke-white stroke-[0.9px]" />
                  </BtnPrimary> */}
                  {/* <BtnSecondary
                    className="p-[8px_14px] text-sm"
                    content="Xem shop"
                  >
                    
                  </BtnSecondary> */}
                </div>
              </div>
            </div>
            {/* <ul className="seller--stats flex-grow grid grid-cols-3">
              <li className="seller--stats__item relative text-sm grid grid-rows-2 gap-y-5 after:content-[''] after:block after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[75%] after:border-r-[1.2px] after:border-neutral-150 px-6 last:pr-0 first:pl-5">
                <div className="stats--row1 flex-between-center gap-x-1">
                  <span className="title text-neutral-500">Đánh giá</span>
                  <span className="content text-accentColor font-medium ">
                    104
                  </span>
                </div>
                <div className="stats--row2 flex-between-center gap-x-1">
                  <span className="title text-neutral-500">Sản phẩm</span>
                  <span className="content text-accentColor font-medium ">
                    14
                  </span>
                </div>
              </li>
              <li className="seller--stats__item relative text-sm grid grid-rows-2 gap-y-5 after:content-[''] after:block after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[45%] after:border-r-[1.2px] after:border-neutral-150 px-6 last:pr-0 first:pl-5">
                <div className="stats--row1 flex-between-center gap-x-1">
                  <span className="title text-neutral-500">Đánh giá</span>
                  <span className="content text-accentColor font-medium ">
                    104
                  </span>
                </div>
                <div className="stats--row2 flex-between-center gap-x-1">
                  <span className="title text-neutral-500">Sản phẩm</span>
                  <span className="content text-accentColor font-medium ">
                    14
                  </span>
                </div>
              </li>
              <li className="seller--stats__item relative text-sm grid grid-rows-2 gap-y-5 px-6 last:pr-0 first:pl-5">
                <div className="stats--row1 flex-between-center gap-x-1">
                  <span className="title text-neutral-500">Đánh giá</span>
                  <span className="content text-accentColor font-medium ">
                    104
                  </span>
                </div>
                <div className="stats--row2 flex-between-center gap-x-1">
                  <span className="title text-neutral-500">Sản phẩm</span>
                  <span className="content text-accentColor font-medium ">
                    14
                  </span>
                </div>
              </li>
            </ul> */}
            {/* CiUser CiShop */}
          </div>
        </div>
      </section>

      {/* detail body  */}
      <section className="section--detailBody section-py">
        <div className="container">
          <div className="row">
            <div className="col-9">
              {/* product information */}
              <section className="section--descPrd section-py">
                <TitleSection title="Thông tin sản phẩm" />
                {productDetail.mo_ta?.trim() ? (
                  <div className="descPrd mt-base">
                    <div className="descPrd-content max-w-full p-4 rounded-lg border border-bd-primary shadow-[0_0_5px_1.2px_rgba(0,0,0,0.1)]">
                      <div className="prose max-w-full">
                        {productDetail.mo_ta}
                      </div>
                    </div>
                  </div>
                ) : (
                  <MessageBlock
                    content="Sản phẩm hiện chưa có mô tả."
                    className="mt-base"
                  />
                )}
              </section>
              {/* comment */}
              <section className="section--comment section-py">
                <TitleSection title="Đánh giá sản phẩm" />

                {/* block 1  */}
                {commentList === null && <ErrorBlock className="mt-base" />}
                {commentList !== null && commentList.length === 0 && (
                  <MessageBlock
                    content="Sản phẩm hiện chưa có đánh giá."
                    className="mt-base"
                  />
                )}
                {commentList !== null && commentList.length > 0 && (
                  <div className="block--comment mt-base">
                    <div className="comment--option p-3 rounded-lg bg-primaryColor border border-bd-primary ">
                      <div className="flex-y-center gap-x-10">
                        <div className="stats--star">
                          <div className="stats--star__count text-accentColor">
                            <span className="title-24 font-semibold">4.9 </span>
                            <span className="font-semibold">trên 5</span>
                          </div>
                          <div className="stats--star__ic flex-y-center gap-x-1 mt-2">
                            <FaStar className="w-[18px] h-[18px] fill-[#FFC205]" />
                            <FaStar className="w-[18px] h-[18px] fill-[#FFC205]" />
                            <FaStar className="w-[18px] h-[18px] fill-[#FFC205]" />
                            <FaStar className="w-[18px] h-[18px] fill-[#FFC205]" />
                            <FaStar className="w-[18px] h-[18px] fill-[#FFC205]" />
                          </div>
                        </div>
                        {/*  */}
                        <ul className="option--list flex flex-wrap gap-x-[10px] gap-y-3">
                          <li className="p-[8px_14px] rounded-full border border-bd-primary bg-white text-sm text-textGrayDark whitespace-nowrap select-none cursor-pointer">
                            Tất cả
                          </li>
                          <li className="p-[8px_14px] rounded-full border border-bd-primary bg-white text-sm text-textGrayDark whitespace-nowrap select-none cursor-pointer">
                            1 ngàn ngôi sao trong đêm
                          </li>
                          <li className="p-[8px_14px] rounded-full border border-bd-primary bg-white text-sm text-textGrayDark whitespace-nowrap select-none cursor-pointer">
                            10 ngón tay
                          </li>

                          <li className="p-[8px_14px] rounded-full border border-bd-primary bg-white text-sm text-textGrayDark whitespace-nowrap select-none cursor-pointer">
                            Con cò bay lã bay la
                          </li>
                          <li className="p-[8px_14px] rounded-full border border-bd-primary bg-white text-sm text-textGrayDark whitespace-nowrap select-none cursor-pointer">
                            Con cò bé bé nó đậu vô cây
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* comment list  */}
                    <div className="container--comment p-[12px_14px] rounded-lg bg-[#f3f4f5] mt-4">
                      {/* comment list  */}
                      <ul className="cardComment--list flex flex-col gap-y-4">
                        {commentList.map((comment, i) => {
                          return <CommentItem key={i} comment={comment} />;
                        })}
                      </ul>
                    </div>
                    {/*  */}
                  </div>
                )}

                {/* block 2 */}
              </section>

              {/* leien qan đến thg shop */}
              <section className="section--productRelatedShop section-py">
                <TitleSection title="Sản phẩm khác của Shop" />
                {produceRelatedList === null && <ErrorBlock />}
                {produceRelatedList !== null &&
                  produceRelatedList.length === 0 && (
                    <MessageBlock content="Hiện không có sản phẩm liên quan." />
                  )}
                {produceRelatedList !== null &&
                  produceRelatedList.length > 0 && (
                    <div className="list-productRelatedShop mt-base">
                      <SlideProductEmbla
                        slidesPerViews={4}
                        listProduct={produceRelatedList}
                      />
                    </div>
                  )}
              </section>

              {/* có thể mày sẻ thích */}
              <section className="section--productYouMightLike section-py hidden">
                <TitleSection title="Có thể bạn cũng thích" />
                <ul className="list-productYouMightLike mt-base grid grid-col4">
                  {/* {productRelatedShop.map((prd: any) => (
                    <Product product={prd} />
                  ))} */}
                </ul>
              </section>
            </div>
            <div className="col-3">
              {/* {voucherList !== null && voucherList.length === 0 && (
                  <div className="mt-base">Hiện không có mã giảm giá!</div>
                  )} */}
              {voucherList !== null && voucherList.length > 0 && (
                <div className="promo--code">
                  <TitleAside title="Mã Khuyến mãi" />
                  <ul className="promo--code__list mt-5 flex flex-col gap-y-3">
                    {voucherList.map((voucher) => (
                      <PromoCodeItem code={voucher} />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
