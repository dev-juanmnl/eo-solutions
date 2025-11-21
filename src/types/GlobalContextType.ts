export interface IGlobal {
  lang: string;
}
export type GlobalContextType = {
  global: IGlobal;
  menuLoaded: boolean;
  productCategoriesLoaded: boolean;
  pagesListLoaded: boolean;
  categories: any;
  changeLanguage: (value: string) => void;
  setLanguage: (value: string) => void;
  updateProductCategories: (value: string) => void;
  updatePagestList: (value: string) => void;
  updateNewsList: (value: string) => void;
  updateProductList: (value: string) => void;
  updateMenuItems: (value: string) => void;
  updateMenuItemsSync: (value: string) => void;
  updatePagesListSync: (value: string) => void;
  updateProductCategoriesSync: (value: string) => void;
};
