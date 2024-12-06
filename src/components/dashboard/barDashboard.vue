<template>
  <v-card-title> Dashboard </v-card-title>
  <v-divider></v-divider>
  <v-progress-linear
    indeterminate
    v-if="loading"
    :height="1"
  ></v-progress-linear>

  <v-card-text class="ma-5">
    <v-row align="stretch" class="gap-2">
      <v-col
        cols="6"
        md="4"
        lg="3"
        v-for="(product, i) in [1].concat(dashboardItems?.products)"
        :key="product"
        class="d-flex"
      >
        <v-card
          title="Today Cash"
          color="#8a278d"
          border
          flat
          v-if="i == 0"
          class="flex-grow-1"
        >
          <v-divider></v-divider>
          <v-card-text class="text-center mt-2 text-h5">
            <v-progress-circular
              indeterminate
              color="white"
              v-if="loading"
            ></v-progress-circular>
            <span v-else>{{
              formattedNumber(dashboardItems.total_cash || 0)
            }}</span></v-card-text
          >
        </v-card>
        <v-card color="white" class="flex-grow-1" v-else-if="product">
          <v-card-text class="text-body-1">{{ product.name }}</v-card-text>
          <v-divider></v-divider>
          <v-card-text class="text-center text-h6">{{
            product.total_orders || 0
          }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
import useDashboardStore from "@/stores/admin/dashboard";
import { ref, computed, onMounted } from "vue";
export default {
  setup() {
    const loading = ref(false);
    const dashboardStore = useDashboardStore();
    const dashboardItems = computed(() => dashboardStore.dashboardItems);

    const getName = (waiter) => {
      let name = waiter.first_name + " " + waiter.middle_name;
      // if (waiter.last_name) name = name + " " + waiter.last_name;
      return name;
    };

    const formattedNumber = (number) => {
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(number);
    };

    onMounted(async () => {
      loading.value = true;
      try {
        await dashboardStore.fetchDashboardItems();
      } finally {
        loading.value = false;
      }
    });

    return {
      loading,
      dashboardItems,
      getName,
      formattedNumber,
    };
  },
};
</script>