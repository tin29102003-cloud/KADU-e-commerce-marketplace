import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer bg-secondaryColor py-10">
      <div className="container">
        <ul className="footer__child grid grid-cols-12 gap-x-5 text-white">
          <li className="col-span-3">
            <div className="logo text-[28px] font-semibold">DATN</div>
            <p className="brand--desc mt-4 text-sm leading-[1.46]">
              Cửa hàng cung cấp trải nghiệm mua sắm trực tuyến nhanh chóng, an
              toàn và thuận tiện, với việc cung các sản phẩm rộng rãi trong các
              danh mục. ... luôn cố gắng cung cấp cho khách hàng của mình ưu đãi
              tốt nhất có thể bao gồm nhiều tùy chọn thanh toán trả hàng miễn
              phí và các dịch vụ khách hàng, các cam kết bảo hành.
            </p>
            {/* payments */}
            <ul className="payment--method flex gap-x-2 mt-3">
              <li>
                <img
                  src="/images/payment-method-1.png"
                  alt=""
                  className="max-w-full h-auto"
                />
              </li>
              <li>
                <img
                  src="/images/payment-method-2.png"
                  alt=""
                  className="max-w-full h-auto"
                />
              </li>
            </ul>
          </li>
          <li className="col-span-3">
            <h3 className="title--footer title-20 font-medium">
              Dịch vụ khách hàng
            </h3>
            {/* menu */}
            <ul className="flex flex-col gap-y-1.5 mt-4">
              <li>
                <Link
                  href="#!"
                  className="relative py-[2px] inline-block transition-all-300-ease border-b border-b-transparent hover:border-b-white"
                >
                  Đơn hàng
                </Link>
              </li>
              <li>
                <Link
                  href="#!"
                  className="relative py-[2px] inline-block transition-all-300-ease border-b border-b-transparent hover:border-b-white"
                >
                  Datn blog
                </Link>
              </li>
              <li>
                <Link
                  href="#!"
                  className="relative py-[2px] inline-block transition-all-300-ease border-b border-b-transparent hover:border-b-white"
                >
                  Hướng dẫn bán hàng
                </Link>
              </li>
              <li>
                <Link
                  href="#!"
                  className="relative py-[2px] inline-block transition-all-300-ease border-b border-b-transparent hover:border-b-white"
                >
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link
                  href="#!"
                  className="relative py-[2px] inline-block transition-all-300-ease border-b border-b-transparent hover:border-b-white"
                >
                  Hướng dẫn mua hàng/ đặt hàng
                </Link>
              </li>
            </ul>
          </li>
          <li className="col-span-3">
            <h3 className="title--footer title-20 font-medium">Tài khoản</h3>
            <ul className="flex flex-col gap-y-1.5 mt-4">
              <li>
                <Link
                  href="#!"
                  className="relative py-[2px] inline-block transition-all-300-ease border-b border-b-transparent hover:border-b-white"
                >
                  Tài khoản của tôi
                </Link>
              </li>
              <li>
                <Link
                  href="#!"
                  className="relative py-[2px] inline-block transition-all-300-ease border-b border-b-transparent hover:border-b-white"
                >
                  Đăng ký / đăng nhập
                </Link>
              </li>
              <li>
                <Link
                  href="#!"
                  className="relative py-[2px] inline-block transition-all-300-ease border-b border-b-transparent hover:border-b-white"
                >
                  Giỏ hàng
                </Link>
              </li>
              <li>
                <Link
                  href="#!"
                  className="relative py-[2px] inline-block transition-all-300-ease border-b border-b-transparent hover:border-b-white"
                >
                  Danh sách yêu thích
                </Link>
              </li>
              <li>
                <Link
                  href="#!"
                  className="relative py-[2px] inline-block transition-all-300-ease border-b border-b-transparent hover:border-b-white"
                >
                  Mua sắm
                </Link>
              </li>
            </ul>
          </li>
          <li className="col-span-3">
            <h3 className="title--footer title-20 font-medium">
              Đăng ký nhận tin
            </h3>
          </li>
        </ul>
      </div>
    </footer>
  );
}
