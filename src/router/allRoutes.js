export default [
  //SuperAdmin
  {
    path: "/",
    name: "home",
    component: () => import("@/views/dashboards/Home.vue"),
    meta: {
      title: "Dashboard",
      scope: "Authorized",
      allowedRoutes: ["superadmin", "admin"],
    },
  },
  {
    path: "/admins",
    name: "admins",
    component: () => import("@/views/admin/admin.vue"),
    meta: {
      title: "Admins",
      scope: "Authorized",
      allowedRoles: ["superadmin"],
    },
  },

  //Admin
  {
    path: "/users",
    name: "users",
    component: () => import("@/views/admin/user.vue"),
    meta: { title: "User", scope: "Authorized", allowedRoles: ["admin"] },
  },

  {
    path: "/waiters",
    name: "waiters",
    component: () => import("@/views/admin/waiter.vue"),
    meta: { title: "Waiters", scope: "Authorized", allowedRoles: ["admin"] },
  },
  {
    path: "/categories",
    name: "categories",
    component: () => import("@/views/admin/category.vue"),
    meta: { title: "Categories", scope: "Authorized", allowedRoles: ["admin"] },
  },
  {
    path: "/products",
    name: "products",
    component: () => import("@/views/admin/product.vue"),
    meta: { title: "Products", scope: "Authorized", allowedRoles: ["admin"] },
  },

  //Cashier
  {
    path: "/casier-orders",
    name: "corders",
    component: () => import("@/views/corders.vue"),
    meta: { title: "Orders", scope: "Authorized", allowedRoles: ["cashier"] },
  },
  {
    path: "/coin-requests",
    name: "coinRequests",
    component: () => import("@/views/coinRequests.vue"),
    meta: {
      title: "Coin Requests",
      scope: "Authorized",
      allowedRoles: ["cashier"],
    },
  },

  //Waiter
  {
    path: "/orders",
    name: "orders",
    component: () => import("@/views/orders.vue"),
    meta: { title: "Orders", scope: "Authorized", allowedRoles: ["waiter"] },
  },
  {
    path: "/orders/new",
    name: "order",
    component: () => import("@/views/order.vue"),
    meta: { title: "Orders", scope: "Authorized", allowedRoles: ["waiter"] },
  },

  //Kitchen
  {
    path: "/kitchen-orders",
    name: "korderItems",
    component: () => import("@/views/activeKitchenOrders.vue"),
    meta: { title: "Orders", scope: "Authorized", allowedRoles: ["kitchen"] },
  },

  //Bar
  {
    path: "/bar-orders",
    name: "borderItems",
    component: () => import("@/views/activeBarOrders.vue"),
    meta: { title: "Orders", scope: "Authorized", allowedRoles: ["bartender"] },
  },

  //Entertainment
  {
    path: "/coins",
    name: "coins",
    component: () => import("@/views/coins.vue"),
    meta: {
      title: "Coins",
      scope: "Authorized",
      allowedRoles: ["entertainment"],
    },
  },
];