export interface filterItemI {
  name: string;
  id: any;
}
export interface ProductListProps {
  subtitles: filterItemI[];
  brands: filterItemI[];
  categories: filterItemI[];
  updateFilter: (value: any, type: string) => void;
  resetFilter: () => void;
}
