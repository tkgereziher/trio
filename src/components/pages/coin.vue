<template>
  <v-card min-height="80vh">
    <v-card-title
      >Coin Requests
      <create-new
        @click="openCreateDialog"
        v-if="role && role == 'entertainment'"
      />
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="coins"
        class="elevation-1"
        item-key="id"
        :loading="loading"
      >
        <template #item.user="{ item }">
          <span class="text-capitalize">{{ item.user?.name }}</span>
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
          <span v-if="role && role == 'entertainment'">
            <v-icon
              color="info"
              v-if="item.state == 'new'"
              @click="openUpdateDialog(item)"
              class="mr-2"
              >mdi-pencil</v-icon
            >
            <v-icon
              color="red"
              v-if="item.state == 'new'"
              @click="openUpdateStateDialog(item.id, 'delete')"
              >mdi-delete</v-icon
            >
          </span>
          <span v-if="role && role == 'cashier'">
            <v-btn
              color="primary"
              size="small"
              prepend-icon="mdi-check-all"
              variant="tonal"
              @click="openUpdateStateDialog(item.id, 'approved')"
              v-if="item.state == 'new'"
              >Approve</v-btn
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
          </span>
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

    <!-- Create and Update Dialog -->
    <v-dialog v-model="formDialog" width="400">
      <v-form
        ref="form"
        v-model="valid"
        @submit.prevent="isEditing ? updateCoin() : addCoin()"
      >
        <v-card>
          <v-card-title>
            <Close @click="closeDialog" />
            <span v-if="isEditing">Edit</span>
            <span v-else>Add</span>
            Coin
            <v-btn
              @click="isEditing ? updateCoin() : addCoin()"
              :color="isEditing ? '#14414b' : '#632097'"
              width="160"
              class="float-right text-none"
              prepend-icon="mdi-check-all"
              :disabled="!valid || isSubmitting"
              :loading="isSubmitting"
              type="submit"
              >{{ isEditing ? "Save Changes" : "Save" }}</v-btn
            >
          </v-card-title>
          <v-divider class="mb-3"></v-divider>
          <v-card-text>
            <v-text-field
              v-model="coin.amount"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Amount"
              :rules="[rules.required]"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-form>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import useCoinStore from "@/stores/coin";
import moment from "moment";
export default {
  props: {
    role: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const coinStore = useCoinStore();
    const coins = computed(() => coinStore.coins);
    const dialog = ref(false);
    const valid = ref(false);
    const formDialog = ref(false);
    const selectedState = ref(null);
    const selectedItemId = ref(null);
    const coin = ref({ amount: null });
    const loading = ref(false);
    const isEditing = ref(false);
    const isSubmitting = ref(false);
    const rules = {
      required: (value) => !!value || "Required.",
      minLength: (value) =>
        (value && value.length >= 3) || "Minimum 3 characters.",
    };

    onMounted(async () => {
      loading.value = true;
      try {
        await coinStore.fetchCoins(props.role);
      } finally {
        loading.value = false;
      }
    });

    const openCreateDialog = () => {
      coin.value = { amount: null };
      isEditing.value = false;
      formDialog.value = true;
    };
    const openUpdateDialog = (item) => {
      coin.value = { ...item };
      isEditing.value = true;
      formDialog.value = true;
    };
    const addCoin = async () => {
      isSubmitting.value = true;
      try {
        await coinStore.addCoin(coin.value);
        closeDialog();
      } catch (error) {
        console.error("Add coin failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const updateCoin = async () => {
      isSubmitting.value = true;
      try {
        await coinStore.updateCoin(coin.value);
        closeDialog();
      } catch (error) {
        console.error("Update coin failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };
    const openUpdateStateDialog = (itemId, state) => {
      dialog.value = true;
      selectedItemId.value = itemId;
      selectedState.value = state;
    };

    const closeDialog = () => {
      dialog.value = false;
      selectedState.value = null;
      selectedItemId.value = null;
      formDialog.value = false;
    };

    const formattedDate = (date) => {
      return moment(date).format("MMM DD, YYYY");
    };
    const getItemStatus = (state) => {
      switch (state) {
        case "new":
          return "Pending";
        case "approved":
          return "Approved";
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
        case "approved":
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
        if (selectedState.value == "delete")
          await coinStore.trashCoin(selectedItemId.value);
        else
          await coinStore.updateCoin({
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

    const headers =
      props.role == "cashier"
        ? [
            { title: "#", key: "index", sortable: false },
            { title: "User", key: "user" },
            { title: "# of coins", key: "amount", sortable: false },
            { title: "Requested at", key: "created_at", sortable: false },
            { title: "Status", key: "status", sortable: false },
            { title: "Actions", key: "actions", sortable: false },
          ]
        : [
            { title: "#", key: "index", sortable: false },
            { title: "# of coins", key: "amount", sortable: false },
            { title: "Requested at", key: "created_at", sortable: false },
            { title: "Status", key: "status", sortable: false },
            { title: "Actions", key: "actions", sortable: false },
          ];

    return {
      coins,
      dialog,
      loading,
      isEditing,
      valid,
      isSubmitting,
      rules,
      closeDialog,
      updateItemState,
      headers,
      formattedDate,
      getItemStatus,
      getItemColor,
      openUpdateStateDialog,
      coin,
      addCoin,
      updateCoin,
      openCreateDialog,
      openUpdateDialog,
      formDialog,
    };
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
