import Link from "next/link";

export default function AsideMenu() {
  return (
    <aside className="aside--menu w-[220px] px-6 py-8">
      <ul className="sellerMenu--list flex flex-col gap-y-2.5">
        <li className="item text-base">
          <div className="title text-base font-medium">Sản phẩm</div>
          <ul className="megaMenu--list flex flex-col gap-y-1 pl-3 mt-1">
            <li className="item text-sm">
              <Link href="#!">Đăng sản phẩm</Link>
            </li>
            <li className="item text-sm">
              <Link href="#!">Quản lý sản phẩm</Link>
            </li>
          </ul>
        </li>
        <li className="item text-base">
          <div className="title text-base font-medium">Đơn hàng</div>
          <ul className="megaMenu--list flex flex-col gap-y-1 pl-3 mt-1">
            <li className="item text-sm">
              <Link href="#!">Đăng sản phẩm</Link>
            </li>
            <li className="item text-sm">
              <Link href="#!">Đăng sản phẩm</Link>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
  );
}
