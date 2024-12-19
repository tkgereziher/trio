export default [
  {
    path: "/imports",
    name: "imports",
    component: () => import("@/views/product/imports.vue"),
    meta: {
      title: "Product Imports",
      scope: "Authorized",
      allowedRoles: ["store"],
    },
  },

  {
    path: "/kitchen-product-requests",
    name: "kitchenProductRequests",
    component: () => import("@/views/product/kitchenRequests.vue"),
    meta: {
      title: "Product Requests",
      scope: "Authorized",
      allowedRoles: ["kitchen"],
    },
  },

  {
    path: "/bar-product-requests",
    name: "barProductRequests",
    component: () => import("@/views/product/barRequests.vue"),
    meta: {
      title: "Product Requests",
      scope: "Authorized",
      allowedRoles: ["bartender"],
    },
  },

  {
    path: "/admin-product-requests",
    name: "adminProductRequests",
    component: () => import("@/views/product/adminRequests.vue"),
    meta: {
      title: "Product Requests",
      scope: "Authorized",
      allowedRoles: ["admin"],
    },
  },

  {
    path: "/store-product-requests",
    name: "storeProductRequests",
    component: () => import("@/views/product/storeRequests.vue"),
    meta: {
      title: "Product Requests",
      scope: "Authorized",
      allowedRoles: ["store"],
    },
  },
];
