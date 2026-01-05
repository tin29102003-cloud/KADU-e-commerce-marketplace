"use client";

import TitleSection from "@/app/components/user/TitleSection";
import { Link as ScrollLink, Element } from "react-scroll";
import { useState, useEffect } from "react";
import { TypeCategoriesAll, TypeCategoriesFilter } from "@/app/types/category";
import ErrorBlock from "@/app/components/user/ErrorBlock";
import Link from "next/link";
import clsx from "clsx";

export default function CategoriesAll({
  categoriesAll,
}: {
  categoriesAll: TypeCategoriesFilter[];
}) {
  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(97 + i)
  );

  return (
    <section className="section--allCategories section-py">
      <div className="container">
        <div className="allCategories">
          <TitleSection title="Tất cả danh mục" />
          <div className="wrap mt-base">
            <ul className="filterChar--list flex-y-center gap-2 justify-around">
              {alphabet.map((char, i) => (
                <li key={i} className="item text-sm">
                  <ScrollLink
                    to={char.toUpperCase()}
                    smooth={true}
                    duration={500}
                    className={clsx(
                      "cursor-pointer",
                      categoriesAll.some(
                        (item) => item.key === char.toUpperCase()
                      )
                        ? "text-accentColor"
                        : "opacity-50"
                    )}
                  >
                    {char}
                  </ScrollLink>
                </li>
              ))}
            </ul>
            {/*  */}
            {categoriesAll ? (
              <div className="categoriesFilter--list flex flex-col mt-base">
                {categoriesAll.map((item, i) => (
                  <Element key={i} name={item.key} className="item">
                    <div className="char--category text-2xl font-semibold">
                      {item.key}
                    </div>
                    <div className="wrap--mainCategories flex flex-col gap-y-4 mt-6">
                      {item.items.length > 0 &&
                        item.items.map((categories) => (
                          <div key={categories.id} className="group--item">
                            <div className="title--parent text-lg font-semibold text-accentColor">
                              <Link href={`collection/all/${categories.slug}`}>
                                {categories.ten_dm}
                              </Link>
                            </div>
                            {categories.children.length > 0 && (
                              <ul className="categoriesChild--list grid grid-cols-4 gap-base mt-3">
                                {categories.children.map((categoriesChild) => (
                                  <li key={categoriesChild.id} className="item">
                                    <Link
                                      href={`collection/all/${categoriesChild.slug}`}
                                      className="text-sm text-neutral-800 hover:opacity-70 transition-all-300-ease"
                                    >
                                      {categoriesChild.ten_dm}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                    </div>
                  </Element>
                ))}
              </div>
            ) : (
              <ErrorBlock
                desc="Đã có lỗi xảy ra vui lòng thử lại sau."
                className="mt-base"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
