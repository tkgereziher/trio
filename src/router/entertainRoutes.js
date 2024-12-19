export default [
  {
    path: "/coins",
    name: "coins",
    component: () => import("@/views/entartainment/coins.vue"),
    meta: {
      title: "Coins",
      scope: "Authorized",
      allowedRoles: ["entertainment"],
    },
  },
  {
    path: "/billiards",
    name: "billiards",
    component: () => import("@/views/entartainment/billiards.vue"),
    meta: {
      title: "Billiards",
      scope: "Authorized",
      allowedRoles: ["entertainment"],
    },
  },
  {
    path: "/playstations",
    name: "playstations",
    component: () => import("@/views/entartainment/playstations.vue"),
    meta: {
      title: "Playstations",
      scope: "Authorized",
      allowedRoles: ["entertainment"],
    },
  },
];
