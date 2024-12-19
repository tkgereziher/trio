<template>
  <v-card-title> Dashboard </v-card-title>
  <v-divider></v-divider>

  <v-img
    class="align-center text-center"
    v-if="loading || !productBalances.length"
    height="60vh"
  >
    <v-progress-circular
      indeterminate
      v-if="loading"
      color="#8a278d"
    ></v-progress-circular>
    <p v-else>No record found.</p>
  </v-img>
  <v-card-text class="ma-5" v-else>
    <v-row align="stretch" class="gap-2">
      <v-col
        cols="6"
        md="4"
        lg="3"
        v-for="item in productBalances"
        :key="item"
        class="d-flex"
      >
        <v-card color="#8a278d" border flat class="flex-grow-1">
          <v-card-text
            class="text-capitalize text-body-1"
            :title="item.product?.name"
          >
            {{ item.product?.name }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text class="text-center mt-2 text-h5">
            <v-progress-circular
              indeterminate
              color="white"
              v-if="loading"
            ></v-progress-circular>
            <span v-else>{{
              formattedNumber(item.remaining_amount || 0)
            }}</span></v-card-text
          >
        </v-card>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
import useProductBalanceStore from "@/stores/product/productBalance";
import { ref, computed, onMounted } from "vue";
export default {
  setup() {
    const loading = ref(false);
    const productBalanceStore = useProductBalanceStore();
    const productBalances = computed(() => productBalanceStore.productBalances);

    const formattedNumber = (number) => {
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(number);
    };

    onMounted(async () => {
      loading.value = true;
      try {
        await productBalanceStore.fetchProductBalances();
      } finally {
        loading.value = false;
      }
    });

    return {
      loading,
      productBalances,
      formattedNumber,
    };
  },
};
</script>