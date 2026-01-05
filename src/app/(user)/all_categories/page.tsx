import CategoryItem from "@/app/components/user/CategoryItem";
import ErrorBlock from "@/app/components/user/ErrorBlock";
import TitleSection from "@/app/components/user/TitleSection";
import categoryServicesServer from "@/app/services/categoryServices-server";
import {
  TypeCategoriesAll,
  TypeCategoriesFilter,
  TypeCategoryParentItem,
} from "@/app/types/category";
import CategoriesAll from "./categoriesAll";

export default async function AllCategories() {
  const result = await Promise.allSettled([
    categoryServicesServer.getAllParent(),
    categoryServicesServer.getAll(),
  ]);

  const [categoriesParentListRes, categoriesAllRes] = result;
  const categoriesParentList: TypeCategoryParentItem[] =
    categoriesParentListRes.status === "fulfilled"
      ? categoriesParentListRes.value.data.data
      : null;

  const categoriesAll: TypeCategoriesAll[] =
    categoriesAllRes.status === "fulfilled"
      ? categoriesAllRes.value.data.data
      : null;

  let categoriesAllFormatted: TypeCategoriesFilter[] = [];
  const handleArrCategory = () => {
    if (!categoriesAll || categoriesAll.length === 0) return;
    const grouped: Record<string, TypeCategoriesAll[]> = categoriesAll.reduce(
      (acc, c) => {
        let charFirst = c.ten_dm[0].toUpperCase();
        if (charFirst === "Đ") charFirst = "D";
        if (!acc[charFirst]) acc[charFirst] = [];
        acc[charFirst].push(c);
        return acc;
      },
      {} as Record<string, TypeCategoriesAll[]>
    );
    //
    categoriesAllFormatted = Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b, "vi"))
      .map((key) => ({
        key,
        items: grouped[key].sort((a, b) =>
          a.ten_dm.localeCompare(b.ten_dm, "vi")
        ),
      }));
  };
  handleArrCategory();
  return (
    <>
      {/* danh mục cha  */}
      <section className="section--categoriesParent section-py">
        <div className="container">
          <div className="categoriesParent">
            <TitleSection title="Danh mục cha" />
            {categoriesParentList ? (
              <ul className="categoriesParent--list grid-col5 mt-base">
                {categoriesParentList.map((item) => (
                  <CategoryItem key={item.id} category={item} />
                ))}
              </ul>
            ) : (
              <ErrorBlock
                desc="Đã có lỗi xảy ra vui lòng thử lại sau."
                className="mt-base"
              />
            )}
          </div>
        </div>
      </section>

      {/* tất cả danh mục  */}
      <CategoriesAll categoriesAll={categoriesAllFormatted} />
    </>
  );
}
