export interface MenuItemType {
  id: string;
  name: string;
  url: string;
  sub_menu: MenuItemType[];
  active: boolean;
}
