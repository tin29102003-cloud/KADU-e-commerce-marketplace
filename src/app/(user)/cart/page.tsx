import Link from "next/link";

// icons

// components
import CartBlock from "@/app/(user)/cart/CartBlock";
import TitleSection from "@/app/components/user/TitleSection";
import BtnPrimary from "@/app/components/user/button/BtnPrimary";

// services
import productServices from "@/app/services/productServices";
import { TypeCartItem } from "@/app/types/cart";
import MessageBlock from "@/app/components/user/MessageBlock";
import cartServicesServer from "@/app/services/cartServices-server";

export default async function Cart() {
  const result = await Promise.allSettled([cartServicesServer.getAll()]);
  const [cartListRes] = result;
  const cartList: TypeCartItem[] =
    cartListRes.status === "fulfilled" ? cartListRes.value.data.data : null;
  return (
    <>
      {/* cart main  */}
      <section className="section--cart section-py">
        <div className="container">
          <div className="cart">
            <TitleSection title="Giỏ hàng" />
            {/* list items cart  */}
            <CartBlock cartList={cartList} />
          </div>
        </div>
      </section>
      {/* action */}

      {/*   */}
      <section className="section--cartProductYouMightLike">
        <div className="container"></div>
      </section>
    </>
  );
}
