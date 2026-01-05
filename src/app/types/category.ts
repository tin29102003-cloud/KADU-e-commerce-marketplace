export interface TypeCategoryParentItem {
  id: number;
  ten_dm: string;
  img: string;
  slug: string;
  stt: string;
  parent_id: number;
}

export interface TypeCategoriesAll {
  id: number;
  ten_dm: string;
  parent_id: number;
  slug: string;
  children: TypeCategoryParentItem[];
}

export interface TypeCategoriesFilter {
  key: string;
  items: TypeCategoriesAll[];
}
