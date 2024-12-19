export default [
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
    path: "/barbery-categories",
    name: "barberyCategories",
    component: () => import("@/views/admin/barberryCategory.vue"),
    meta: {
      title: "Barbery Categories",
      scope: "Authorized",
      allowedRoles: ["admin"],
    },
  },
  {
    path: "/barbery-services",
    name: "barberyServices",
    component: () => import("@/views/barberryServices.vue"),
    meta: {
      title: "Barbery Services",
      scope: "Authorized",
      allowedRoles: ["admin"],
    },
  },
  {
    path: "/products",
    name: "products",
    component: () => import("@/views/admin/product.vue"),
    meta: {
      title: "Products",
      scope: "Authorized",
      allowedRoles: ["admin"],
    },
  },

  //Requests
  {
    path: "/approved-coin-requests",
    name: "approvedcoinRequests",
    component: () => import("@/views/admin/coinRequests.vue"),
    meta: {
      title: "Coin",
      scope: "Authorized",
      allowedRoles: ["admin"],
    },
  },
  {
    path: "/approved-billiard-requests",
    name: "approvedbilliardRequests",
    component: () => import("@/views/admin/billiardRequests.vue"),
    meta: {
      title: "Billiard",
      scope: "Authorized",
      allowedRoles: ["admin"],
    },
  },
  {
    path: "/approved-playstation-requests",
    name: "approvedplaystationRequests",
    component: () => import("@/views/admin/playstationRequests.vue"),
    meta: {
      title: "Playstation",
      scope: "Authorized",
      allowedRoles: ["admin"],
    },
  },
];
