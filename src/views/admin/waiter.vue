<template>
  <v-card min-height="80vh">
    <v-card-title>
      Waiters
      <CreateNew @click="openCreateDialog" />
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="waiters"
        class="elevation-1"
        item-key="id"
        :loading="loading"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.name="{ item }">
          <span class="text-capitalize"
            >{{ item.first_name }} {{ item.middle_name }}</span
          >
        </template>

        <template #item.actions="{ item }">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-icon color="primary" dark v-bind="props">
                mdi-dots-vertical
              </v-icon>
            </template>

            <v-list>
              <v-list-item
                prepend-icon="mdi-pencil"
                @click="openUpdateDialog(item)"
              >
                <v-list-item-title> Edit Item </v-list-item-title>
              </v-list-item>
              <v-list-item
                prepend-icon="mdi-delete"
                @click="deleteWaiter(item.id)"
              >
                <v-list-item-title> Delete Item </v-list-item-title>
              </v-list-item>
              <v-list-item prepend-icon="mdi-key" @click="resetCode(item.id)">
                <v-list-item-title> Reset Code </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card-text>

    <!-- Create and Update Dialog -->
    <v-dialog v-model="dialog" max-width="700" persistent>
      <v-card>
        <v-card-title>
          <Close @click="closeDialog" />
          <span v-if="isEditing">Edit</span>
          <span v-else>Add</span>
          {{ title }}
          <v-btn
            @click="isEditing ? updateWaiter() : addWaiter()"
            :color="isEditing ? '#14414b' : '#632097'"
            width="160"
            class="float-right text-none"
            prepend-icon="mdi-check-all"
            :disabled="!valid || isSubmitting"
            :loading="isSubmitting"
            >{{ isEditing ? "Save Changes" : "Save" }}</v-btn
          >
        </v-card-title>
        <v-divider class="mb-3"></v-divider>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12" md="6" class="py-0">
                <v-text-field
                  v-model="waiter.first_name"
                  variant="outlined"
                  density="compact"
                  color="#632097"
                  label="First name"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-text-field
                  v-model="waiter.middle_name"
                  variant="outlined"
                  density="compact"
                  color="#632097"
                  label="Middle name"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-text-field
                  v-model="waiter.last_name"
                  variant="outlined"
                  density="compact"
                  color="#632097"
                  label="Last name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-select
                  v-model="waiter.gender"
                  :items="['Male', 'Female']"
                  variant="outlined"
                  density="compact"
                  color="#632097"
                  label="Sex"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>

              <v-col cols="12" :md="!isEditing ? 6 : 12" class="py-0">
                <v-text-field
                  v-model="waiter.phone"
                  variant="outlined"
                  density="compact"
                  color="#632097"
                  label="Phone"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="py-0" v-if="!isEditing">
                <v-text-field
                  v-model="waiter.code"
                  variant="outlined"
                  density="compact"
                  color="#632097"
                  label="Code"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Reset Code Dialog -->
    <v-dialog v-model="resetCodeDialog" max-width="400px">
      <v-card>
        <v-card-title> Reset Code </v-card-title>
        <v-card-text>
          <v-form ref="codeForm" v-model="codeValid">
            <v-text-field
              v-model="newCode"
              label="New Code"
              required
              :rules="[rules.required]"
              type="number"
            >
            </v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="closeResetCodeDialog">Cancel</v-btn>
          <v-btn
            color="primary"
            @click="resetCodeAction"
            :disabled="!codeValid || isSubmitting"
            >Reset</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="confirmDialog" max-width="400px">
      <v-card>
        <v-card-title>Are you sure?</v-card-title>
        <v-card-actions>
          <v-btn text @click="closeConfirmDialog">Cancel</v-btn>
          <v-btn color="red" @click="confirmAction" :disabled="isSubmitting"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import useWaiterStore from "@/stores/admin/waiter";

export default {
  setup() {
    const waiterStore = useWaiterStore();

    const waiters = computed(() => waiterStore.waiters);
    const dialog = ref(false);
    const resetCodeDialog = ref(false);
    const confirmDialog = ref(false);
    const waiter = ref({
      first_name: null,
      middle_name: null,
      last_name: null,
      gender: "Female",
      phone: null,
      code: null,
    });
    const newCode = ref("");
    const codeValid = ref(false);
    const valid = ref(false);
    const isEditing = ref(false);
    const isSubmitting = ref(false);
    const actionType = ref(null);
    const selectedWaiterId = ref(null);
    const loading = ref(false);

    const rules = {
      required: (value) => !!value || "Required.",
      email: (value) => /.+@.+\..+/.test(value) || "Must be a valid email.",
    };

    onMounted(async () => {
      loading.value = true;
      try {
        await waiterStore.fetchWaiters();
      } finally {
        loading.value = false;
      }
    });

    const openCreateDialog = () => {
      waiter.value = {
        first_name: null,
        middle_name: null,
        last_name: null,
        gender: null,
        phone: null,
        code: null,
      };
      isEditing.value = false;
      dialog.value = true;
    };

    const openUpdateDialog = (item) => {
      waiter.value = { ...item };
      isEditing.value = true;
      dialog.value = true;
    };

    const closeDialog = () => {
      dialog.value = false;
      valid.value = false;
    };

    const addWaiter = async () => {
      isSubmitting.value = true;
      try {
        await waiterStore.addWaiter({ ...waiter.value });
        closeDialog();
      } catch (error) {
        console.error("Add waiter failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const updateWaiter = async () => {
      isSubmitting.value = true;
      try {
        await waiterStore.updateWaiter(waiter.value);
        closeDialog();
      } catch (error) {
        console.error("Update waiter failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const deleteWaiter = async (id) => {
      const confirmed = confirm("Are you sure you want to delete this waiter?");
      if (confirmed) {
        await waiterStore.deleteWaiter(id);
      }
    };

    const resetCode = (id) => {
      selectedWaiterId.value = id;
      resetCodeDialog.value = true;
    };

    const resetCodeAction = async () => {
      isSubmitting.value = true;
      try {
        await waiterStore.updateWaiter({
          id: selectedWaiterId.value,
          code: newCode.value,
        });
        closeResetCodeDialog();
      } catch (error) {
        console.error("Code reset failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const closeResetCodeDialog = () => {
      resetCodeDialog.value = false;
      newCode.value = null;
    };

    const toggleWaiterStatus = (waiter) => {
      selectedWaiterId.value = waiter.id;
      actionType.value = waiter.is_active ? "deactivate" : "activate"; // Use actionType instead
      confirmDialog.value = true;
    };

    const confirmAction = async () => {
      isSubmitting.value = true;
      try {
        if (actionType.value === "deactivate") {
          await waiterStore.deactivateWaiter(selectedWaiterId.value);
        } else {
          await waiterStore.activateWaiter(selectedWaiterId.value);
        }
      } catch (error) {
        console.error("Waiter status change failed:", error);
      } finally {
        closeConfirmDialog();
        isSubmitting.value = false;
      }
    };

    const closeConfirmDialog = () => {
      confirmDialog.value = false;
    };
    const headers = [
      { title: "#", key: "index" },
      { title: "Name", key: "name" },
      { title: "Phine", key: "phone" },
      { title: "Actions", key: "actions", sortable: false },
    ];

    return {
      waiters,
      dialog,
      resetCodeDialog,
      confirmDialog,
      waiter,
      newCode,
      codeValid,
      valid,
      isEditing,
      isSubmitting,
      rules,
      openCreateDialog,
      openUpdateDialog,
      closeDialog,
      addWaiter,
      updateWaiter,
      deleteWaiter,
      resetCode,
      resetCodeAction,
      closeResetCodeDialog,
      toggleWaiterStatus,
      confirmAction,
      closeConfirmDialog,
      headers,
      loading,
    };
  },
};
</script>