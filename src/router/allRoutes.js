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

  {
    path: "/barbery-requests",
    name: "barberryRequests",
    component: () => import("@/views/barberryRequests.vue"),
    meta: {
      title: "Barbery Requests",
      scope: "Authorized",
      allowedRoles: ["barber_cashier"],
    },
  },
  {
    path: "/barbery",
    name: "barbery",
    component: () => import("@/views/barberry.vue"),
    meta: {
      title: "Barbery Services",
      scope: "Authorized",
      allowedRoles: ["barber"],
    },
  },

  //Cashier
  {
    path: "/cashier-orders",
    name: "corders",
    component: () => import("@/views/corders.vue"),
    meta: { title: "Orders", scope: "Authorized", allowedRoles: ["cashier"] },
  },
  {
    path: "/coin-requests",
    name: "coinRequests",
    component: () => import("@/views/cashier/coinRequests.vue"),
    meta: {
      title: "Coin Requests",
      scope: "Authorized",
      allowedRoles: ["cashier"],
    },
  },
  {
    path: "/billiard-requests",
    name: "billiardRequests",
    component: () => import("@/views/cashier/billiardRequests.vue"),
    meta: {
      title: "Billiard Requests",
      scope: "Authorized",
      allowedRoles: ["cashier"],
    },
  },
  {
    path: "/playstation-requests",
    name: "playstationRequests",
    component: () => import("@/views/cashier/playstationRequests.vue"),
    meta: {
      title: "Playstation Requests",
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
    meta: { title: "New Order", scope: "Authorized", allowedRoles: ["waiter"] },
  },
  {
    path: "/orders/:id/edit",
    name: "orderEdit",
    component: () => import("@/views/order.vue"),
    meta: {
      title: "Edit Order",
      scope: "Authorized",
      allowedRoles: ["waiter"],
    },
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
];
