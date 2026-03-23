"use client";
import { useEffect, useState } from "react";
import BtnSeeAll from "../components/user/BtnSeeAll";
import TitleSection from "../components/user/TitleSection";
import productServices from "../services/productServices";
import { TypeProduct } from "../types/type";
import ErrorBlock from "../components/user/ErrorBlock";
import MessageBlock from "../components/user/MessageBlock";
import Product from "../components/user/product/Product";
import BtnSecondary from "../components/user/button/BtnSecondary";
import ProductSkeleton from "../components/user/skeleton/ProductSkeleton";

export default function SectionAllProductSuggest() {
  const [listProduct, setListProduct] = useState<TypeProduct[]>([]); // bỏ null
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);
  const limit = 10;

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (currentPage: number) => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(false);
    try {
      const res = await productServices.getAll(currentPage);
      if (!res.success) {
        setError(true);
        return;
      }
      const data: TypeProduct[] = res.data.result.data;
      if (data.length < limit) setHasMore(false);

      setListProduct((prev) => [...prev, ...data]);
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) setPage((prev) => prev + 1);
  };

  return (
    <section className="section--suggest section-py">
      <div className="container">
        <div className="block--suggest">
          <div className="suggest--top flex-between">
            <TitleSection title="Gợi ý hôm nay" />
            <BtnSeeAll />
          </div>

          {error && <ErrorBlock />}
          {!error && listProduct.length === 0 && !loading && (
            <MessageBlock content="Hiện không có sản phẩm." />
          )}
          {listProduct.length > 0 && (
            <ul className="suggest--list mt-base grid-col5">
              {listProduct.map((prd: TypeProduct) => (
                <Product key={prd.id} product={prd} />
              ))}
              {loading &&
                Array.from({ length: limit }).map((_, idx) => (
                  <ProductSkeleton key={idx} />
                ))}
            </ul>
          )}

          {hasMore && !error && (
            <div className="flex-x-center mt-base">
              <BtnSecondary onClick={handleLoadMore} content="">
                {loading ? "Đang tải..." : "Xem thêm"}
              </BtnSecondary>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
