<template>
  <v-card min-height="80vh">
    <v-card-title>
      Active Orders
      <create-new></create-new>
    </v-card-title>
    <v-divider></v-divider>
    <v-img
      height="60vh"
      v-if="loading || !orders.length"
      class="align-center text-center"
    >
      <v-progress-circular
        indeterminate
        v-if="loading"
        color="#14A814"
      ></v-progress-circular>
      <span v-else>No record found.</span>
    </v-img>
    <v-card-text v-else>
      <v-row>
        <v-col cols="12" md="6" v-for="order in orders" :key="order.id">
          <v-card class="d-flex flex-column h-100 bg-white">
            <template v-slot:append>
              <v-menu min-width="200px" rounded width="200">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props"> mdi-dots-vertical </v-icon>
                </template>
                <v-list>
                  <v-list-item prepend-icon="mdi-pencil">Add Item</v-list-item>
                  <v-list-item prepend-icon="mdi-close-circle"
                    >Cancel</v-list-item
                  >
                  <v-list-item prepend-icon="mdi-check-circle"
                    >Done</v-list-item
                  >
                </v-list>
              </v-menu>
            </template>

            <v-list-item
              v-for="item in order.order_items"
              :key="item.id"
              class="py-2"
            >
              <template v-slot:prepend>
                <v-avatar size="45">
                  <v-img
                    style="background: #777"
                    :src="item.product?.file_link"
                  ></v-img>
                </v-avatar>
              </template>
              <template v-slot:append>
                <b>{{ item.quantity }}</b>
                <v-icon
                  size="small"
                  color="info"
                  title="Edit Item"
                  @click="editItem(item)"
                  v-if="order.state == 'new'"
                  >mdi-pencil</v-icon
                >
              </template>
              <v-list-item-title class="text-capitalize">{{
                item.product?.name
              }}</v-list-item-title>
              <v-list-item-subtitle class="mb-2">
                <v-text :class="'text-' + getItemColor(item.state)">
                  {{ getItemStatus(item.state) }}
                </v-text>
              </v-list-item-subtitle>
              <v-divider></v-divider>
            </v-list-item>

            <!-- Add the card actions at the bottom of each card -->
            <v-card-actions class="mt-auto mx-2">
              <v-chip :color="getOrderColor(order.state)">{{
                getOrderStatus(order.state)
              }}</v-chip>
              <v-spacer></v-spacer>
              <span class="text-grey">
                <b class="text-capitalize">{{ order.waiter?.name }}</b> /
                {{ formattedDate(order.created_at) }}</span
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
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

    <v-dialog v-model="editDialog" width="400">
      <v-card>
        <v-card-title> {{ selectedItem?.product?.name }} </v-card-title>
        <v-divider class="mb-3"></v-divider>
        <v-card-text v-if="selectedItem">
          <v-text-field
            type="number"
            variant="outlined"
            v-model="selectedItem.quantity"
            label="Quantity"
          ></v-text-field>
        </v-card-text>
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
            @click="updateItem()"
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
import useOrderItemStore from "@/stores/orderItem";
export default {
  setup() {
    const orderStore = useOrderStore();
    const orderItemStore = useOrderItemStore();
    const orders = computed(() => orderStore.orders);
    const dialog = ref(false);
    const selectedState = ref(null);
    const selectedItemId = ref(null);
    const selectedItem = ref(null);
    const editDialog = ref(false);
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
      editDialog.value = false;
      selectedState.value = null;
      selectedItemId.value = null;
      selectedItem.value = null;
    };

    const formattedDate = (date) => {
      return moment(date).format("HH:MM");
    };

    const editItem = async (item) => {
      selectedItem.value = item;
      editDialog.value = true;
    };

    const updateItem = async () => {
      isSubmitting.value = true;
      try {
        await orderItemStore.updateOrderItem(selectedItem.value);
        closeDialog();
      } catch (error) {
        console.error("Action failed:", error);
      } finally {
        isSubmitting.value = false;
      }
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
      { title: "Waiter", key: "waiter" },
      { title: "Items", key: "items" },
      { title: "Payment", key: "total_price" },
      { title: "Ordered at", key: "created_at" },
      { title: "Actions", key: "actions", sortable: false },
    ];

    const getOrderStatus = (state) => {
      switch (state) {
        case "new":
          return "Pending";
        case "paid":
          return "Paid";
        case "served":
          return "Served";
        case "cancelled":
          return "Cancelled";
        default:
          return "Unknown";
      }
    };
    const getOrderColor = (state) => {
      switch (state) {
        case "new":
          return "warning";
        case "paid":
          return "primary";
        case "served":
          return "success";
        case "cancelled":
          return "red";
        default:
          return "Unknown";
      }
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

    return {
      orders,
      dialog,
      loading,
      isSubmitting,
      rules,
      origins,
      closeDialog,
      updateItemState,
      updateItem,
      headers,
      formattedDate,
      openUpdateStateDialog,
      getItemColor,
      getItemStatus,
      getOrderStatus,
      getOrderColor,
      editItem,
      selectedItem,
      editDialog,
    };
  },
};
</script>

<style scoped>
.v-col {
  display: flex;
  align-items: stretch;
}

.v-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
