export interface LateralMenuProps {
  showSubMenu: (arg: number, arg2: string) => void;
  selectedCategory: string;
  isVisible: boolean;
  isActive: Boolean;
  setActive: (arg1: boolean) => void;
}
