"use client";
import TitleAside from "@/app/components/user/TitleAside";
import { TypeCartItem } from "@/app/types/cart";
import { TypeCategoriesAll } from "@/app/types/category";
import clsx from "clsx";
import Link from "next/link";
import PriceSlider from "@/app/components/user/SliderRange";
import { CiFilter } from "react-icons/ci";
import { CiGrid41 } from "react-icons/ci";
import { FaArrowRotateRight } from "react-icons/fa6";
import BtnPrimary from "@/app/components/user/button/BtnPrimary";
import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
import { formatMoney } from "@/app/utils/helper";
import { TypeTrademark } from "@/app/types/product";
import { keyframes } from "@emotion/react";
import { useFilter } from "@/app/hook/useFilter";
import { useSearchParams, useRouter } from "next/navigation";

export default function BlockAside({
  categoryList,
  slug,
  trademarkList,
  currentDmId,
}: {
  categoryList: {
    parent: {
      id: number;
      ten_dm: string;
      slug: string;
    };
    children: [TypeCategoriesAll];
  };
  slug: string;
  trademarkList: TypeTrademark[] | null;
  currentDmId: number;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { pushFilters, removeFilter } = useFilter();
  const priceSelect = { min: 0, max: 1000000, default: 100000 };

  // default price mi max
  const initMin = searchParams.get("min_price")
    ? Number(searchParams.get("min_price"))
    : priceSelect.min;
  const initMax = searchParams.get("max_price")
    ? Number(searchParams.get("max_price"))
    : priceSelect.default;
  const [arrPrice, setArrPrice] = useState<number[]>([initMin, initMax]);

  //   default ths
  const initThs = searchParams.get("brands")
    ? searchParams.get("brands")!.split(",")
    : [];

  const [arrThs, setArrThs] = useState<string[]>(initThs);

  const handleFilterPrice = () => {
    const minPrice = arrPrice[0];
    const maxPrice = Number(arrPrice[1]);
    pushFilters({ min_price: minPrice, max_price: maxPrice });
  };

  const handleFilterTrademark = (id: string, checked: boolean) => {
    let arrSelect: string[] = [];
    if (checked) {
      arrSelect = [...arrThs, String(id)];
    } else {
      arrSelect = arrThs.filter((v) => String(v) !== String(id));
    }
    setArrThs(arrSelect);
    if (arrSelect.length > 0) {
      pushFilters({ brands: arrSelect.join(",") });
    } else {
      removeFilter(["brands"]);
    }
  };

  //   reset price
  const handleResetPrice = () => {
    removeFilter(["min_price", "max_price"]);
    setArrPrice([priceSelect.min, priceSelect.default]);
  };
  return (
    <aside className="aside--menu col-3">
      <div className="menu--category style-aside">
        <TitleAside title="Danh mục" />
        {categoryList && (
          <ul className="category--list text-textGrayDark mt-5">
            <li className={clsx("item")}>
              <div
                className={clsx(
                  "title--parent flex items-baseline gap-x-2 text-base font-semibold",
                  {
                    active:
                      Number(currentDmId) === Number(categoryList.parent.id),
                  }
                )}
              >
                <Link href={`${categoryList.parent.slug}`}>
                  {categoryList.parent.ten_dm}{" "}
                </Link>
              </div>
              {categoryList.children.length > 0 && (
                <ul className="categoriesChild--list flex flex-col gap-y-2 mt-2.5">
                  {categoryList.children.map((item) => (
                    <li
                      key={item.id}
                      className={clsx(
                        "item flex items-baseline gap-x-2 text-sm",
                        { active: Number(currentDmId) === Number(item.id) }
                      )}
                    >
                      <Link href={`${item.slug}`}>{item.ten_dm}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        )}
      </div>
      {/* filter */}
      <div className="aside--filter mt-base">
        <div className="aside--filter__title flex-y-center gap-x-2 p-[10px] rounded-lg border-[1.5px] border-dashed border-accentColor">
          <CiFilter className="w-7 h-7 fill-accentColor" />
          <TitleAside title="Bộ lọc tìm kiếm" />
        </div>
        {/* seller */}
        <div className="filter--seller style-aside mt-3">
          <TitleAside title="Thương hiệu" />
          <ul className="filter--seller__list mt-5">
            {trademarkList && trademarkList.length > 0
              ? trademarkList.map((item, i) => (
                  <li
                    key={item.id}
                    className="item py-[6px] flex-y-center gap-x-[6px]"
                  >
                    <input
                      type="checkbox"
                      id={`fillter--seller__check${i + 1}`}
                      className="w-[14px] h-[14px] border-[#E0E0E0]"
                      checked={arrThs.includes(String(item.id))}
                      onChange={(e) =>
                        handleFilterTrademark(String(item.id), e.target.checked)
                      }
                    />
                    <label
                      htmlFor={`fillter--seller__check${i + 1}`}
                      className="block w-full text-sm text-textGrayDark font-medium capitalize select-none cursor-pointer"
                    >
                      {item.ten_th}
                    </label>
                  </li>
                ))
              : ""}
          </ul>
        </div>
        {/* shipping */}
        {/* <div className="filter--shipping style-aside mt-base">
          <TitleAside title="Đơn vị vận chuyển " />
          <ul className="filter--shipping__list mt-5">
            {Array.from({ length: 3 }).map((item, i) => (
              <li className="item py-[6px] flex-y-center gap-x-[6px]">
                <input
                  type="checkbox"
                  id={`fillter--shipping__check${i}`}
                  className="w-[14px] h-[14px] border-[#E0E0E0]"
                />
                <label
                  htmlFor={`fillter--shipping__check${i}`}
                  className="block w-full text-sm text-textGrayDark font-medium capitalize select-none cursor-pointer"
                >
                  Giao hàng tiết kiệm
                </label>
              </li>
            ))}
          </ul>
        </div> */}
        {/* priceRange */}
        <div className="filter--priceRange style-aside mt-base">
          <TitleAside title="Khoảng giá " />
          <div className="priceRange--action mt-5">
            <div className="priceRange--action__title flex-between-center">
              <span className="title--min text-sm font-medium">
                {formatMoney(arrPrice[0])}
              </span>
              <span className="title--max text-sm font-medium">
                {formatMoney(arrPrice[1])}
              </span>
            </div>
            <PriceSlider
              defaultPosThumb={{
                min: Number(arrPrice[0]),
                max: Number(arrPrice[1]),
              }}
              min={priceSelect.min}
              max={priceSelect.max}
              classNameBox="priceRange--action__slider"
              onChange={(value) => setArrPrice(value)}
            />
          </div>
          <BtnPrimary
            content="Áp dụng"
            className="w-full mt-3"
            onClick={handleFilterPrice}
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleResetPrice}
              className="text-base text-accentColor"
            >
              <FaArrowRotateRight />
            </button>
          </div>
        </div>
        {/* promotional  */}
        {/* <div className="filter--promotional style-aside mt-base">
          <TitleAside title="Dịch vụ & khuyến mãi " />
          <ul className="filter--promotional__list mt-5">
            {Array.from({ length: 3 }).map((item, i) => (
              <li className="item py-[6px] flex-y-center gap-x-[6px]">
                <input
                  type="checkbox"
                  id={`fillter--promotional__check${i}`}
                  className="w-[14px] h-[14px] border-[#E0E0E0]"
                />
                <label
                  htmlFor={`fillter--promotional__check${i}`}
                  className="block w-full text-sm text-textGrayDark font-medium capitalize select-none cursor-pointer"
                >
                  Đang giảm giá
                </label>
              </li>
            ))}
          </ul>
        </div> */}
      </div>
    </aside>
  );
}
