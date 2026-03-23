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
import { TypeReason } from "@/app/types/type";

export default async function Cart() {
  const result = await Promise.allSettled([cartServicesServer.getAll()]);
  const [dataCartRes] = result;

  let cartList: TypeCartItem[] | null = [];
  const handleGetCart = () => {
    if (dataCartRes.status === "fulfilled") {
      cartList = dataCartRes.value.data.data;
    } else {
      const reason: TypeReason = dataCartRes.reason;
      if (reason.status === 401) {
        cartList = null;
      } else {
        cartList = null;
        console.log(reason.message);
      }
    }
  };
  handleGetCart();
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

      {/* <section className="section--cartProductYouMightLike">
        <div className="container"></div>
      </section> */}
    </>
  );
}
