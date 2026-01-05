"use client";
import SelectClient from "@/app/components/user/SelectClient";
import { useFilter } from "@/app/hook/useFilter";
import { useEffect, useState } from "react";
import { CiGrid41 } from "react-icons/ci";

export default function FilterBar() {
  const { pushFilters, removeFilter } = useFilter();
  const [rating, setRating] = useState<string | undefined>(undefined);
  const [isProductSale, setIsProductSale] = useState<string | undefined>(
    undefined
  );
  const [sort, setSort] = useState<string | undefined>(undefined);

  //   filter rating
  useEffect(() => {
    if (!rating) return;
    if (rating !== "default") {
      pushFilters({ rating: rating });
    } else {
      removeFilter(["rating"]);
    }
  }, [rating]);

  //   filter product sale
  useEffect(() => {
    if (!isProductSale) return;
    if (isProductSale !== "default") {
      pushFilters({ is_on_sale: isProductSale });
    } else {
      removeFilter(["is_on_sale"]);
    }
  }, [isProductSale]);

  //   filter sort product
  useEffect(() => {
    if (!sort) return;
    if (sort !== "default") {
      pushFilters({ sort: sort });
    } else {
      removeFilter(["sort"]);
    }
  }, [sort]);

  return (
    <div className="filter--bar flex-y-center gap-x-2 p-[10px] shadow-[0_0_4px_1px_rgba(0,0,0,0.1)] rounded-lg">
      {/* title filter */}
      <div className="filter--bar__title flex-y-center gap-x-2">
        <span className="text-sm whitespace-nowrap">Sắp xếp theo:</span>
        <CiGrid41 className="w-7 h-7" />
      </div>
      {/* list filter */}
      <div className="filter--list grid grid-cols-3 gap-x-3 grow">
        <SelectClient
          className="text-sm h-9"
          options={[
            { value: "1", label: "1 sao" },
            { value: "2", label: "2 sao" },
            { value: "3", label: "3 sao" },
            { value: "4", label: "4 sao" },
            { value: "5", label: "5 sao" },
            { value: "default", label: "Mặc định" },
          ]}
          placeholder="Số sao"
          onChange={(val) => setRating(val?.value)}
        />
        <SelectClient
          className="text-sm h-9"
          options={[
            { value: "true", label: "Sản phẩm sale" },
            { value: "default", label: "Mặc định" },
          ]}
          onChange={(val) => setIsProductSale(val?.value)}
          placeholder="Sản phẩm sale"
        />
        <SelectClient
          className="text-sm h-9"
          options={[
            { value: "price_asc", label: "Giá tăng dần" },
            { value: "price_desc", label: "Giá giảm dần" },
            { value: "newest", label: "Mới nhất" },
            { value: "bestseller", label: "Bán chạy" },
            { value: "popular", label: "Phổ biến nhất" },
            { value: "default", label: "Mặc định" },
          ]}
          placeholder="Sắp xếp theo"
          onChange={(val) => setSort(val?.value)}
        />
        {/* <SelectClient
          className="text-sm h-9"
          options={[
            { value: "Ngày mới nhất", label: "Ngày mới nhất" },
            { value: "Ngày cũ nhất", label: "Ngày cũ nhất" },
          ]}
          placeholder="Tên "
        /> */}
      </div>
    </div>
  );
}
