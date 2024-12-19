<template>
  <v-card min-height="85vh">
    <super-admin-dashboard v-if="userRole == ROLE_VALUES.SUPERADMIN" />
    <admin-dashboard v-else-if="userRole == ROLE_VALUES.ADMIN" />
    <barber-dashboard v-else-if="userRole == ROLE_VALUES.BARBER" />
    <bar-dashboard v-else-if="userRole == ROLE_VALUES.BARTENDER" />
    <cashier-dashboard v-else-if="userRole == ROLE_VALUES.CASHIER" />
    <kitchen-dashboard v-else-if="userRole == ROLE_VALUES.KITCHEN" />
    <waiter-dashboard v-else-if="userRole == ROLE_VALUES.WAITER" />
    <store-dashboard v-else-if="userRole == ROLE_VALUES.STORE" />
  </v-card>
</template>

<script>
import useLoginStore from "@/stores/login";
import superAdminDashboard from "@/components/dashboard/adminDashboard.vue";
import adminDashboard from "@/components/dashboard/adminDashboard.vue";
import barberDashboard from "@/components/dashboard/barberDashboard.vue";
import barDashboard from "@/components/dashboard/barDashboard.vue";
import cashierDashboard from "@/components/dashboard/cashierDashboard.vue";
import kitchenDashboard from "@/components/dashboard/kitchenDashboard.vue";
import waiterDashboard from "@/components/dashboard/waiterDashboard.vue";
import storeDashboard from "@/components/dashboard/storeDashboard.vue";
import { ROLE_VALUES } from "@/constants/";

export default {
  components: {
    superAdminDashboard,
    adminDashboard,
    barberDashboard,
    barDashboard,
    cashierDashboard,
    kitchenDashboard,
    waiterDashboard,
    storeDashboard,
  },
  data() {
    return {
      loginStore: useLoginStore(),
      ROLE_VALUES: ROLE_VALUES,
    };
  },

  computed: {
    userRole() {
      return this.loginStore.userRole;
    },
  },
};
</script>