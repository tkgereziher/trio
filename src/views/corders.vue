<template>
  <v-card min-height="80vh">
    <v-card-title> Active Orders </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="orders"
        class="elevation-1"
        item-key="id"
        :loading="loading"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.items="{ item }">
          <p
            v-for="(product, i) in item.order_items"
            :key="product.id"
            class="py-1"
          >
            {{ i + 1 }}. {{ product.product.name }}
          </p>
        </template>

        <template #item.created_at="{ item }">
          {{ formattedDate(item.created_at) }}
        </template>
        <template #item.actions="{ item }">
          <v-btn
            color="success"
            size="small"
            class="ml-1"
            prepend-icon="mdi-check-circle"
            variant="tonal"
            @click="openUpdateStateDialog(item.id, 'paid')"
            v-if="item.state == 'new'"
            >Paid</v-btn
          >
        </template>
      </v-data-table>
    </v-card-text>
    <v-dialog v-model="dialog" width="400">
      <v-card>
        <v-card-title> Are you sure? </v-card-title>
        <v-divider class="mb-3"></v-divider>
        <v-card-actions>
          <v-btn
            @click="closeDialog"
            color="info"
            class="float-right text-none"
            prepend-icon="mdi-close-circle"
            variant="text"
            >Close</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            @click="updateItemState"
            color="#14A814"
            class="float-right text-none"
            prepend-icon="mdi-check-all"
            :loading="isSubmitting"
            variant="flat"
            :disabled="isSubmitting"
            >Ok</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import useOrderStore from "@/stores/order";
import moment from "moment";
export default {
  setup() {
    const orderStore = useOrderStore();
    const orders = computed(() => orderStore.orders);
    const dialog = ref(false);
    const selectedState = ref(null);
    const selectedItemId = ref(null);
    const loading = ref(false);
    const isSubmitting = ref(false);
    const rules = {
      required: (value) => !!value || "Required.",
      minLength: (value) =>
        (value && value.length >= 3) || "Minimum 3 characters.",
    };

    const origins = ["Kitchen", "Bar Tender"];

    onMounted(async () => {
      loading.value = true;
      try {
        await orderStore.fetchOrders();
      } finally {
        loading.value = false;
      }
    });

    const openUpdateStateDialog = (itemId, state) => {
      dialog.value = true;
      selectedItemId.value = itemId;
      selectedState.value = state;
    };

    const closeDialog = () => {
      dialog.value = false;
      selectedState.value = null;
      selectedItemId.value = null;
    };

    const formattedDate = (date) => {
      return moment(date).format("HH:MM");
    };

    const updateItemState = async () => {
      isSubmitting.value = true;
      try {
        await orderStore.updateOrderState(
          selectedItemId.value,
          selectedState.value
        );
        closeDialog();
      } catch (error) {
        console.error("Action failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const headers = [
      { title: "#", key: "index" },
      { title: "Waiter", key: "waiter.name" },
      { title: "Items", key: "items" },
      { title: "Payment", key: "total_price" },
      { title: "Ordered at", key: "created_at" },
      { title: "Actions", key: "actions", sortable: false },
    ];

    return {
      orders,
      dialog,
      loading,
      isSubmitting,
      rules,
      origins,
      closeDialog,
      updateItemState,
      headers,
      formattedDate,
      openUpdateStateDialog,
    };
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
