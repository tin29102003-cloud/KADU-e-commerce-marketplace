"use client";
import ProductSale from "@/app/(user)/product/sale/page";
import ErrorBlock from "@/app/components/user/ErrorBlock";
import MessageBlock from "@/app/components/user/MessageBlock";
import ProductSellerItem from "@/app/components/user/product/ProductSellerItem";
import { TypeProduct } from "@/app/types/type";
import { useEffect, useState } from "react";

export default function SectionAllPrdSeller({
  productSeller,
}: {
  productSeller: TypeProduct[] | null;
}) {
  const [productSellerChange, setProductSellerChange] = useState<
    TypeProduct[] | null
  >(productSeller);
  useEffect(() => {
    setProductSellerChange(productSeller);
  }, [productSeller]);

  return (
    <div className="productSeller--list">
      {productSellerChange === null && <ErrorBlock />}
      {productSellerChange !== null && productSellerChange.length === 0 && (
        <MessageBlock content="Hiện không có sản phẩm" />
      )}
      {productSellerChange !== null &&
        productSellerChange.length > 0 &&
        productSellerChange.map((prd) => (
          <ProductSellerItem
            key={prd.id}
            product={prd}
            setProductSellerChange={setProductSellerChange}
          />
        ))}
    </div>
  );
}
