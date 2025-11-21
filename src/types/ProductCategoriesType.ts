export interface ProductCategoryTerm {
  id: string;
  name: string;
  description: string;
  alias: string;
  children: ProductCategoryTerm[];
  weight: number;
}
