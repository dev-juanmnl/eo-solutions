import { ProductCategoryTerm } from "../types/ProductCategoriesType";

export default function getProductsList(response: any) {
  //process product categories list
  let product_categories: ProductCategoryTerm[] = [];
  let tmpProductList = response.data.data;

  while (tmpProductList.length !== 0) {
    let remove = false;
    tmpProductList.forEach((item: any) => {
      let product_category_item: ProductCategoryTerm = {
        id: item.id,
        name: item.attributes.name,
        description:
          item.attributes.description !== null
            ? item.attributes.description.value
            : "",
        alias: item.attributes.path.alias,
        children: [],
        weight: item.attributes.weight,
      };
      if (item.relationships.parent.data[0].id === "virtual") {
        product_categories.push(product_category_item);
        remove = true;
      } else {
        //find the parent
        product_categories.forEach((category_item: ProductCategoryTerm) => {
          if (category_item.id === item.relationships.parent.data[0].id) {
            category_item.children.push(product_category_item);
            remove = true;
          }
        });
      }
      //remove the category from the temporary list
      if (remove)
        tmpProductList = tmpProductList.filter(
          (tmpProduct: any) => tmpProduct.id !== item.id
        );
    });
  }

  //sort submenus
  product_categories.forEach((item: ProductCategoryTerm) => {
    item.children = orderChildrenMenu(item.children);
  });
  return product_categories;
}

function orderChildrenMenu(submenu: ProductCategoryTerm[]) {
  let tmpSubmenu = submenu;
  return tmpSubmenu.sort((a, b) => (a.weight < b.weight ? -1 : 1));
}
