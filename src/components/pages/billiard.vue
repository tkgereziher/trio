<template>
  <v-card min-height="80vh">
    <v-card-title>
      <div v-if="role && role == 'entertainment'">
        Billiard
        <create-new @click="openCreateDialog" />
      </div>
      <v-row v-else>
        <v-col>Playstation</v-col>
        <v-col v-if="role && role == 'admin'">
          <v-text-field
            variant="outlined"
            type="date"
            v-model="filterDate"
            hide-details
            density="compact"
            label="Select date"
            @update:model-value="fetchItemsByDate()"
            color="green"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="billiards"
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
        @submit.prevent="isEditing ? updateBilliard() : addBilliard()"
      >
        <v-card>
          <v-card-title>
            <Close @click="closeDialog" />
            <span v-if="isEditing">Edit</span>
            <span v-else>Add</span>
            Billiard
            <v-btn
              @click="isEditing ? updateBilliard() : addBilliard()"
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
              v-model="billiard.minutes"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Amount"
              :rules="[rules.required]"
              @update:model-value="updateTotalPrice()"
            ></v-text-field>
            <v-text-field
              v-model="billiard.total_price"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Total Price"
              readonly
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-form>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import useBilliardStore from "@/stores/billiard";
import moment from "moment";
import { FETCHING_INTERVAL } from "@/constants/";

export default {
  props: {
    role: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const billiardStore = useBilliardStore();
    const billiards = computed(() => billiardStore.billiards);
    const dialog = ref(false);
    const valid = ref(false);
    const filterDate = ref(null);
    const formDialog = ref(false);
    const selectedState = ref(null);
    const selectedItemId = ref(null);
    const billiard = ref({ minutes: null, total_price: null });
    const loading = ref(false);
    const isEditing = ref(false);
    const isSubmitting = ref(false);
    const rules = {
      required: (value) => !!value || "Required.",
      minLength: (value) =>
        (value && value.length >= 3) || "Minimum 3 characters.",
    };

    onMounted(() => {
      fetchBilliards();

      // const intervalId = setInterval(fetchBilliards, FETCHING_INTERVAL);

      // onUnmounted(() => {
      //   clearInterval(intervalId);
      // });
    });

    const fetchBilliards = async () => {
      loading.value = true;
      try {
        await billiardStore.fetchBilliards(props.role, filterDate.value);
      } finally {
        loading.value = false;
      }
    };
    const fetchItemsByDate = () => {
      fetchBilliards();
    };

    const openCreateDialog = () => {
      billiard.value = { minutes: null, total_price: null };
      isEditing.value = false;
      formDialog.value = true;
    };
    const openUpdateDialog = (item) => {
      billiard.value = { ...item };
      isEditing.value = true;
      formDialog.value = true;
    };
    const addBilliard = async () => {
      isSubmitting.value = true;
      try {
        await billiardStore.addBilliard(billiard.value);
        closeDialog();
      } catch (error) {
        console.error("Add billiard failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const updateBilliard = async () => {
      isSubmitting.value = true;
      try {
        await billiardStore.updateBilliard(billiard.value);
        closeDialog();
      } catch (error) {
        console.error("Update billiard failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };
    const openUpdateStateDialog = (itemId, state) => {
      dialog.value = true;
      selectedItemId.value = itemId;
      selectedState.value = state;
    };
    const updateTotalPrice = () => {
      billiard.value.total_price = billiard.value.minutes;
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
          await billiardStore.trashBilliard(selectedItemId.value);
        else
          await billiardStore.updateBilliard({
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
            { title: "Minutes", key: "minutes", sortable: false },
            { title: "Total Price", key: "total_price", sortable: false },
            { title: "Requested at", key: "created_at", sortable: false },
            { title: "Status", key: "status", sortable: false },
            { title: "Actions", key: "actions", sortable: false },
          ]
        : props.role == "admin"
        ? [
            { title: "#", key: "index", sortable: false },
            { title: "User", key: "user" },
            { title: "Minutes", key: "minutes", sortable: false },
            { title: "Total Price", key: "total_price", sortable: false },
            { title: "Requested at", key: "created_at", sortable: false },
            { title: "Status", key: "status", sortable: false },
          ]
        : [
            { title: "#", key: "index", sortable: false },
            { title: "Minutes", key: "minutes", sortable: false },
            { title: "Total Price", key: "total_price", sortable: false },
            { title: "Requested at", key: "created_at", sortable: false },
            { title: "Status", key: "status", sortable: false },
            { title: "Actions", key: "actions", sortable: false },
          ];

    return {
      billiards,
      filterDate,
      fetchItemsByDate,
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
      updateTotalPrice,
      billiard,
      addBilliard,
      updateBilliard,
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
