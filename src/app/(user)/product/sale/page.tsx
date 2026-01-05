import ErrorBlock from "@/app/components/user/ErrorBlock";
import MessageBlock from "@/app/components/user/MessageBlock";
import Product from "@/app/components/user/product/Product";
import TitleSection from "@/app/components/user/TitleSection";
import productServicesServer from "@/app/services/productServices-server";
import { TypeProduct } from "@/app/types/type";

export default async function ProductSale() {
  const res = await productServicesServer.getProductSale();
  const listProductSale: TypeProduct[] | null = res.success
    ? res.data.result.data
    : null;

  return (
    <section className="section--allPRoductSale section-py">
      <div className="container">
        <div className="allPRoductSale">
          <TitleSection title="Sản phẩm Sale" />
          {listProductSale === null && <ErrorBlock className="mt-base" />}
          {listProductSale !== null && listProductSale.length === 0 && (
            <MessageBlock
              content="Hiện không có sản phẩm."
              className="mt-base"
            />
          )}
          {listProductSale !== null && listProductSale.length > 0 && (
            <ul className="allPRoductSale-list grid-col5 mt-base">
              {listProductSale.map((prd) => (
                <Product product={prd} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
