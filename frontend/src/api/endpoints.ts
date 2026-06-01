export const ENDPOINTS = {

  user: {
    LOGIN: "/user/login",
    REGISTER: "/user/signup",

  },
   shop: {
    CREATE: "/shop/CreateShop",
    GET_MY_SHOPS: "/shop/myshops",

    GET_CATEGORY: "/shop/category",
    EDIT_CATEGORY: "/shop/category",
    EDIT: "/shop/edit",
    GET_ONE: "/shop/"
  },
  product: {
    CREATE: "/product/create",
    EDIT: "/product/edit",
    DELETE: "/product/prod",
    TRADER_PROD: "/product/prod",
     GET_PROD: "/product/csm/prod"
  },

  order: {
   GET_ORDERS: "/order/orders",
    EDIT_ORDER: "/order/orders",
  }
};