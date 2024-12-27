const SUPER_ADMIN_MENU = [
  {
    title: "Dashboard",
    path: "home",
    icon: "mdi-view-dashboard",
  },
  {
    title: "Admins",
    path: "admins",
    icon: "mdi-account-multiple-plus",
  },
];

const ADMIN_MENU = [
  {
    title: "Dashboard",
    path: "home",
    icon: "mdi-view-dashboard",
  },
  {
    title: "Products",
    path: "products",
    icon: "mdi-food-variant",
  },
  {
    title: "Categories",
    path: "categories",
    icon: "mdi-group",
  },
  {
    type: "divider",
  },
  {
    title: "Barbery Categories",
    path: "barberyCategories",
    icon: "mdi-crosshairs-gps",
  },
  {
    title: "Barbery Services",
    path: "barberyServices",
    icon: "mdi-content-cut",
  },
  {
    title: "Product Requests",
    path: "adminProductRequests",
    icon: "mdi-information",
  },
  {
    type: "divider",
  },
  {
    title: "Coins",
    path: "approvedcoinRequests",
    icon: "mdi-cash",
  },
  {
    title: "Billiard",
    path: "approvedbilliardRequests",
    icon: "mdi-gamepad",
  },
  {
    title: "Playstation",
    path: "approvedplaystationRequests",
    icon: "mdi-gamepad-variant",
  },
  {
    type: "divider",
  },
  {
    title: "Users",
    path: "users",
    icon: "mdi-account-multiple",
  },

  {
    title: "Waiters",
    path: "waiters",
    icon: "mdi-city",
  },
  // {
  //   title: "Barbers",
  //   path: "barbers",
  //   icon: "mdi-account-plus",
  // },
];

const WAITER_MENU = [
  {
    title: "Dashboard",
    path: "home",
    icon: "mdi-view-dashboard",
  },
  {
    title: "Order",
    path: "order",
    icon: "mdi-plus-circle",
  },
  {
    title: "Orders",
    path: "orders",
    icon: "mdi-menu",
  },
];

const CASHIER_MENU = [
  {
    title: "Dashboard",
    path: "home",
    icon: "mdi-view-dashboard",
  },
  {
    title: "Active Orders",
    path: "corders",
    icon: "mdi-menu",
  },
  {
    title: "Coin",
    path: "coinRequests",
    icon: "mdi-cash",
  },
  {
    title: "Billiard",
    path: "billiardRequests",
    icon: "mdi-gamepad",
  },
  {
    title: "Playstation",
    path: "playstationRequests",
    icon: "mdi-gamepad-variant",
  },
];

const KITCHEN_MENU = [
  {
    title: "Dashboard",
    path: "home",
    icon: "mdi-view-dashboard",
  },
  {
    title: "Active Orders",
    path: "korderItems",
    icon: "mdi-menu",
  },
  {
    title: "Product Requests",
    path: "kitchenProductRequests",
    icon: "mdi-information",
  },
];

const BARTENDER_MENU = [
  {
    title: "Dashboard",
    path: "home",
    icon: "mdi-view-dashboard",
  },
  {
    title: "Active Orders",
    path: "borderItems",
    icon: "mdi-menu",
  },
  {
    title: "Product Requests",
    path: "barProductRequests",
    icon: "mdi-information",
  },
];

const ENTETAINMENT_MENU = [
  {
    title: "Dashboard",
    path: "home",
    icon: "mdi-view-dashboard",
  },
  {
    title: "Coin",
    path: "coins",
    icon: "mdi-cash",
  },
  {
    title: "Billiard",
    path: "billiards",
    icon: "mdi-gamepad",
  },
  {
    title: "Playstation",
    path: "playstations",
    icon: "mdi-gamepad-variant",
  },
];

const BARBER_MENU = [
  {
    title: "Barbery Services",
    path: "barbery",
    icon: "mdi-content-cut",
  },
];

const BARBER_CASHIER_MENU = [
  {
    title: "Barbery Requests",
    path: "barberryRequests",
    icon: "mdi-content-cut",
  },
];

const STORE_MENU = [
  {
    title: "Dashboard",
    path: "dashboard",
    icon: "mdi-view-dashboard",
  },
  {
    title: "Imports",
    path: "imports",
    icon: "mdi-food-variant",
  },
  {
    title: "Requests",
    path: "storeProductRequests",
    icon: "mdi-glass-mug",
  },
  {
    type: "divider",
  },
  {
    title: "Materials",
    path: "materials",
    icon: "mdi-kettle",
  },
];

export {
  ADMIN_MENU,
  SUPER_ADMIN_MENU,
  WAITER_MENU,
  CASHIER_MENU,
  KITCHEN_MENU,
  BARTENDER_MENU,
  ENTETAINMENT_MENU,
  BARBER_MENU,
  BARBER_CASHIER_MENU,
  STORE_MENU,
};
