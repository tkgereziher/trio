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
    title: "Products",
    path: "products",
    icon: "mdi-format-indent-increase",
  },
  {
    title: "Categories",
    path: "categories",
    icon: "mdi-account-multiple-plus",
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
    icon: "mdi-account-multiple",
  },
];
const WAITER_MENU = [
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
    title: "Active Orders",
    path: "corders",
    icon: "mdi-menu",
  },
  {
    title: "Coin Requests",
    path: "coinRequests",
    icon: "mdi-coin",
  },
];

const KITCHEN_MENU = [
  {
    title: "Active Orders",
    path: "korderItems",
    icon: "mdi-menu",
  },
];

const BARTENDER_MENU = [
  {
    title: "Active Orders",
    path: "borderItems",
    icon: "mdi-menu",
  },
];

const ENTETAINMENT_MENU = [
  {
    title: "Coins",
    path: "coins",
    icon: "mdi-account-multiple",
  },
];

const BARBER_MENU = [];

export {
  ADMIN_MENU,
  SUPER_ADMIN_MENU,
  WAITER_MENU,
  CASHIER_MENU,
  KITCHEN_MENU,
  BARTENDER_MENU,
  ENTETAINMENT_MENU,
  BARBER_MENU,
};
