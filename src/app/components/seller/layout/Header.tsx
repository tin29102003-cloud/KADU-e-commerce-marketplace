import ImgLazy from "../../shared/Imglazy";
import Link from "next/link";
export default function Header() {
  return (
    <header className="relative z-1 shadow-[0_1px_4px_rgba(0,0,0,0.15)]">
      <div className="header__child flex-between-center py-2 px-6">
        <div className="header--logo">
          <Link href="#!" className="flex-y-center gap-x-2">
            <ImgLazy
              src="/images/logo-datn.png"
              alt="Logo Kadu"
              className="max-h-[50px]"
            />
            <div className="content text-lg text-neutral-700">Seller</div>
          </Link>
        </div>
        <div className="header--action">
          <div className="user flex-y-center gap-x-2">
            <div className="user__img w-10 h-10 rounded-full overflow-hidden">
              <ImgLazy
                className="img-full"
                src="/images/logo-datn.png"
                alt=""
                wrapperClassName="inline-block w-full h-full"
              />
            </div>
            <div className="user__name text-sm capitalize">Nguyên văn A</div>
          </div>
        </div>
      </div>
    </header>
  );
}
