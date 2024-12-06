import { createRouter, createWebHistory } from "vue-router";
import allRoutes from "./allRoutes";
import useLoginStore from "@/stores/login";
import { ROLE_VALUES } from "@/constants/";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...allRoutes,
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/Login.vue"),
      meta: {
        title: "Login",
        scope: "NonAuth",
      },
    },
    {
      path: "/",
      name: "home",
      component: () => import("@/views/dashboard.vue"),
      meta: {
        title: "Home",
        scope: "Authorized",
      },
    },
    {
      path: "/",
      name: "dashboard",
      component: () => import("@/views/dashboard.vue"),
      meta: {
        title: "Dashboard",
        scope: "Authorized",
      },
    },
  ],
});

const roleRedirects = {
  [ROLE_VALUES.ENTERTAINMENT]: "coins",
  [ROLE_VALUES.BARTENDER]: "dashboard",
  [ROLE_VALUES.KITCHEN]: "dashboard",
  [ROLE_VALUES.CASHIER]: "dashboard",
  [ROLE_VALUES.WAITER]: "orders",
  [ROLE_VALUES.ADMIN]: "dashboard",
  [ROLE_VALUES.BARBER]: "barbery",
  [ROLE_VALUES.STORE]: "products",
  [ROLE_VALUES.BARBER_CASHIER]: "barberryRequests",
  [ROLE_VALUES.SUPERADMIN]: "dashboard",
};

router.beforeEach((to, from, next) => {
  const { scope, allowedRoles } = to.meta;
  const store = useLoginStore();

  // Handle the case where the route is public (no auth required)
  if (scope === "Public") {
    return next();
  }

  // Ensure the token is fetched and available
  store
    .fetchAccessToken()
    .then(() => {
      const isAuthenticated = store.accessToken;
      const userRole = store.userRole;
      // If no token and route requires authentication
      if (!isAuthenticated) {
        if (scope === "NonAuth") {
          return next(); // Allow access to non-authenticated routes like login
        }
        return next({ name: "login" });
      }

      // Token is available, check role-based access
      if (scope === "NonAuth") {
        return next({ name: "home" }); // Redirect logged-in users from NonAuth routes (like login)
      }

      if (to.name === "home") {
        const redirectTo = roleRedirects[userRole] || "dashboard"; // Default to root if no match
        if (
          [
            ROLE_VALUES.STORE,
            ROLE_VALUES.BARBER_CASHIER,
            ROLE_VALUES.BARBER,
            ROLE_VALUES.WAITER,
            ROLE_VALUES.ENTERTAINMENT,
          ].includes(userRole)
        )
          return next({ name: redirectTo });
        else return next();
      }

      // Admin role check: If allowedRoles are defined, check if the user role is in the allowed roles for this route
      if (allowedRoles && !allowedRoles.includes(userRole)) {
        return next({ name: "home" }); // Redirect non-authorized users
      }

      // Generic auth route check
      return next(); // Allow access to authenticated users and those in allowedRoles
    })
    .catch(() => {
      // Handle case if fetching access token fails
      return next({ name: "login" });
    });
});

export default router;
