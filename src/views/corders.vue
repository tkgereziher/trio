<template>
  <v-card min-height="80vh" :loading="loading">
    <v-card-title> Active Orders </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="orders"
        class="elevation-1"
        item-key="id"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.items="{ item }">
          <v-table class="my-2">
            <tbody>
              <tr
                v-for="(product, i) in item.order_items"
                :key="product.id"
                class="py-0 my-n3"
              >
                <!-- <td>{{ i + 1 }}.</td> -->
                <td>
                  {{ product.product.name }}
                  <v-chip :color="getItemColor(product.state)" size="x-small">{{
                    getItemStatus(product.state)
                  }}</v-chip>
                </td>
                <td
                  :class="product.state == 'rejected' ? 'text-linethrough' : ''"
                >
                  <b>{{
                    Number(product.quantity * product.unit_price).toFixed(2)
                  }}</b>
                </td>
              </tr>
            </tbody>
          </v-table>
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import useOrderStore from "@/stores/order";
import moment from "moment";
import { FETCHING_INTERVAL } from "@/constants/";

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

    onMounted(() => {
      const audio = new Audio("/src/assets/notify.m4a");
      let userInteracted = ref(false);

      // Enable audio after user interaction
      const enableAudio = () => {
        userInteracted.value = true;
        audio.muted = true;
        audio
          .play()
          .then(() => {
            audio.pause(); // Pause to prepare for future playback
            audio.muted = false;
          })
          .catch((err) => console.error("Audio initialization failed", err));
        window.removeEventListener("click", enableAudio);
      };

      window.addEventListener("click", enableAudio);

      const fetchOrders = async () => {
        loading.value = true;
        try {
          await orderStore.fetchOrders();
          if (userInteracted.value) {
            audio.play().catch((err) => {
              console.error("Audio play failed", err);
            });
          }
        } finally {
          loading.value = false;
        }
      };

      // Initial fetch
      fetchOrders();

      // Fetch every 3 minutes
      const intervalId = setInterval(fetchOrders, FETCHING_INTERVAL);

      onUnmounted(() => {
        clearInterval(intervalId);
        window.removeEventListener("click", enableAudio);
      });
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
    const headers = [
      { title: "#", key: "index" },
      { title: "Waiter", key: "waiter.name" },
      { title: "Items", key: "items" },
      { title: "Payment", key: "price" },
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
      getItemColor,
      getItemStatus,
      headers,
      formattedDate,
      openUpdateStateDialog,
    };
  },
};
</script>

<style scoped>
.text-linethrough {
  text-decoration: line-through;
}
</style>
