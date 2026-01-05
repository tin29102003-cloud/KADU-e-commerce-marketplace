import Link from "next/link";
import type { TypeCategory } from "@/app/types/type";
import ImgLazy from "../shared/Imglazy";
import clsx from "clsx";
import { TypeCategoryParentItem } from "@/app/types/category";

export default function CategoryItem({
  category,
  className,
}: {
  category: TypeCategoryParentItem | TypeCategory;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "category__item group rounded-lg border border-bd-primary transition-all-300-ease overflow-hidden hover:border-accentColor",
        className
      )}
    >
      <Link
        href={`/collection/all/${category.slug}`}
        className="block h-full relative p-[10px] after:content-[''] after:block after:w-11 after:h-1 after:bg-neutral-150 after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:rounded-t-2xl after:transition-all-300-ease group-hover:after:bg-accentColor group-hover:after:shadow-[0_0_4px_2.5px_#bbdbff,_0_0_4px_3.5px_#deeeff]"
      >
        <div className="category--thumb px-6 ratio-box after:content-[''] after:block after:ratio-1_1">
          <ImgLazy
            src={"http://localhost:5000/" + category.img}
            alt="#!"
            className="img-full !transition-all-300-ease group-hover:scale-110"
            wrapperClassName="ratio-box-img"
          />
        </div>
        <h3 className="mt-2 text-xs text-center font-medium mt-2 line-clamp-2">
          {category.ten_dm}
        </h3>
      </Link>
    </div>
  );
}
