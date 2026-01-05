import TitleSection from "@/app/components/user/TitleSection";

import productServices from "@/app/services/productServices";

// component
import Product from "@/app/components/user/product/Product";
import { ErrorRes, TypeProduct } from "@/app/types/type";

export default async function Wishlist() {
  const result = await Promise.allSettled([
    productServices.getAllProductLove(),
  ]);
  const [listProductLoveRes] = result;
  const listProductLove: TypeProduct[] | ErrorRes =
    listProductLoveRes.status === "fulfilled"
      ? listProductLoveRes.value.data
      : listProductLoveRes.reason;
  console.log(listProductLove);
  return (
    <section className="section--wishlist section-py">
      <div className="container">
        <div className="wishlist">
          <TitleSection title="Yêu thích" />
          <ul className="list-product">
            {"status" in listProductLove ? (
              listProductLove.status === 401 && (
                <div className="no-products py-[60px] px-8 mt-base text-lg md:text-2xl font-medium text-center text-accentColor">
                  Bạn cần đăng nhập để xem danh sách yêu thích!
                </div>
              )
            ) : listProductLove.length === 0 ? (
              <div className="no-products py-[60px] px-8 mt-base text-lg md:text-2xl font-medium text-center text-accentColor">
                Không có sản phẩm yêu thích!
              </div>
            ) : (
              listProductLove.map((p) => <Product key={p.id} product={p} />)
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
