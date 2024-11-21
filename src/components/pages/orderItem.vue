<template>
  <v-card min-height="80vh">
    <v-card-title>Active Orders </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="orderItems"
        class="elevation-1"
        item-key="id"
        :loading="loading"
      >
        <template #item.waiter="{ item }">
          <span class="text-capitalize">{{ item.order?.waiter?.name }}</span>
        </template>
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.status="{ item }">
          <v-chip :color="getItemColor(item.state)" size="small">{{
            getItemStatus(item.state)
          }}</v-chip>
        </template>
        <template #item.created_at="{ item }">
          {{ formattedDate(item.created_at) }}
        </template>
        <template #item.actions="{ item }">
          <v-btn
            color="primary"
            size="small"
            prepend-icon="mdi-check-all"
            variant="tonal"
            @click="openUpdateStateDialog(item.id, 'in_progress')"
            v-if="item.state == 'new' && role == 'kitchen'"
            >Accept</v-btn
          >
          <v-btn
            color="success"
            size="small"
            class="ml-1"
            prepend-icon="mdi-check-circle"
            variant="tonal"
            @click="openUpdateStateDialog(item.id, 'ready_for_pickup')"
            v-if="
              (role == 'kitchen' && item.state == 'in_progress') ||
              (role == 'bar' && item.state == 'new')
            "
            >Done</v-btn
          >
          <v-btn
            color="red"
            size="small"
            class="ml-1"
            prepend-icon="mdi-close-circle"
            variant="tonal"
            @click="openUpdateStateDialog(item.id, 'rejected')"
            v-if="item.state == 'new'"
            >Reject</v-btn
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
import useOrderItemStore from "@/stores/orderItem";
import moment from "moment";
export default {
  props: {
    role: {
      type: String,
      required: true,
    },
  },
  setup() {
    const orderItemStore = useOrderItemStore();
    const orderItems = computed(() => orderItemStore.orderItems);
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
        await orderItemStore.fetchOrderItems();
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
    const getItemStatus = (state) => {
      switch (state) {
        case "new":
          return "Pending";
        case "in_progress":
          return "Inprogress";
        case "ready_for_pickup":
          return "Ready";
        case "rejected":
          return "Rejected";
        default:
          return "Unknown";
      }
    };
    const getItemColor = (state) => {
      switch (state) {
        case "new":
          return "info";
        case "in_progress":
          return "primary";
        case "ready_for_pickup":
          return "success";
        case "rejected":
          return "red";
        default:
          return "";
      }
    };
    const updateItemState = async () => {
      isSubmitting.value = true;
      try {
        await orderItemStore.updateOrderItem({
          id: selectedItemId.value,
          state: selectedState.value,
        });
        closeDialog();
      } catch (error) {
        console.error("Action failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const headers = [
      { title: "#", key: "index" },
      { title: "Waiter", key: "waiter" },
      { title: "Item", key: "product.name" },
      { title: "Quantity", key: "quantity" },
      { title: "Ordered at", key: "created_at" },
      { title: "Status", key: "status" },
      { title: "Actions", key: "actions", sortable: false },
    ];

    return {
      orderItems,
      dialog,
      loading,
      isSubmitting,
      rules,
      origins,
      closeDialog,
      updateItemState,
      headers,
      formattedDate,
      getItemStatus,
      getItemColor,
      openUpdateStateDialog,
    };
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
