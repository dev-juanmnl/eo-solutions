export interface PaginationProps {
  prev: string;
  next: string;
  last: string;
  first: string;
  changeCurrentPage: (value: string) => void;
}
