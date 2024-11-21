<template>
  <v-card min-height="80vh">
    <v-card-title>
      {{ title }}s
      <CreateNew @click="openCreateDialog" />
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="users"
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
        <template #item.role="{ item }">
          {{ getRole(item.role) }}
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
                @click="deleteUser(item.id)"
              >
                <v-list-item-title> Delete Item </v-list-item-title>
              </v-list-item>
              <v-list-item
                prepend-icon="mdi-key"
                @click="resetPassword(item.id)"
              >
                <v-list-item-title> Reset Password </v-list-item-title>
              </v-list-item>
              <!-- <v-list-item @click="toggleUserStatus(item)" prepend-icon="mdi-">
                <v-list-item-title>
                  {{ item.state ? "Activate" : "Deactivate" }}
                </v-list-item-title>
              </v-list-item> -->
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
            @click="isEditing ? updateUser() : addUser()"
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
                  v-model="user.first_name"
                  variant="outlined"
                  density="compact"
                  color="#632097"
                  label="First name"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-text-field
                  v-model="user.middle_name"
                  variant="outlined"
                  density="compact"
                  color="#632097"
                  label="Middle name"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-text-field
                  v-model="user.last_name"
                  variant="outlined"
                  density="compact"
                  color="#632097"
                  label="Last name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-select
                  v-model="user.gender"
                  :items="['Male', 'Female']"
                  variant="outlined"
                  density="compact"
                  color="#632097"
                  label="Sex"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-select
                  v-model="user.role"
                  :items="roles"
                  variant="outlined"
                  density="compact"
                  color="#632097"
                  label="Select Role"
                  :rules="[rules.required]"
                  item-title="title"
                  item-value="value"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-text-field
                  v-model="user.phone"
                  variant="outlined"
                  density="compact"
                  color="#632097"
                  label="Phone"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" class="py-0">
                <v-text-field
                  v-model="user.username"
                  variant="outlined"
                  density="compact"
                  color="#632097"
                  label="Username"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <!-- Password Field (only visible for Add) -->
                <v-text-field
                  v-if="!isEditing"
                  v-model="user.password"
                  variant="outlined"
                  density="compact"
                  color="#632097"
                  label="Password"
                  :rules="[rules.required]"
                  required
                  :type="showPassword ? 'text' : 'password'"
                >
                  <template v-slot:append-inner>
                    <v-icon @click="showPassword = !showPassword">{{
                      showPassword ? "mdi-eye-off" : "mdi-eye"
                    }}</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Reset Password Dialog -->
    <v-dialog v-model="resetPasswordDialog" max-width="400px">
      <v-card>
        <v-card-title> Reset Password </v-card-title>
        <v-card-text>
          <v-form ref="passwordForm" v-model="passwordValid">
            <v-text-field
              v-model="newPassword"
              label="New Password"
              required
              :rules="[rules.required]"
              :type="showPassword ? 'text' : 'password'"
            >
              <template v-slot:append-inner>
                <v-icon @click="showPassword = !showPassword">{{
                  showPassword ? "mdi-eye-off" : "mdi-eye"
                }}</v-icon>
              </template>
            </v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="closeResetPasswordDialog">Cancel</v-btn>
          <v-btn
            color="primary"
            @click="resetPasswordAction"
            :disabled="!passwordValid || isSubmitting"
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
import useUserStore from "@/stores/admin/user";

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const userStore = useUserStore();

    const users = computed(() => userStore.users);
    const dialog = ref(false);
    const resetPasswordDialog = ref(false);
    const showPassword = ref(false);
    const confirmDialog = ref(false);
    const user = ref({
      first_name: null,
      middle_name: null,
      last_name: null,
      phone: null,
      role: null,
      username: null,
      password: null,
    });
    const newPassword = ref("");
    const passwordValid = ref(false);
    const valid = ref(false);
    const isEditing = ref(false);
    const isSubmitting = ref(false);
    const actionType = ref(null);
    const selectedUserId = ref(null);
    const loading = ref(false);

    const roles =
      props.role == "superadmin"
        ? [
            { title: "Admin", value: "admin" },
            { title: "Super admin", value: "superadmin" },
          ]
        : [
            { title: "Waiter", value: "waiter" },
            { title: "Cashier", value: "cashier" },
            { title: "Kitchen", value: "kitchen" },
            { title: "Bartender", value: "bartender" },
            { title: "Barber", value: "barber" },
            { title: "Entertainment", value: "entertainment" },
          ];
    const rules = {
      required: (value) => !!value || "Required.",
      email: (value) => /.+@.+\..+/.test(value) || "Must be a valid email.",
    };

    onMounted(async () => {
      loading.value = true;
      try {
        await userStore.fetchUsers(props.role == "superadmin" ? "admin" : null);
      } finally {
        loading.value = false;
      }
    });

    const openCreateDialog = () => {
      user.value = {
        phone: null,
        username: null,
        first_name: null,
        middle_name: null,
        last_name: null,
        password: null,
        role: null,
      };
      isEditing.value = false;
      dialog.value = true;
    };

    const openUpdateDialog = (item) => {
      user.value = { ...item };
      isEditing.value = true;
      dialog.value = true;
    };

    const closeDialog = () => {
      dialog.value = false;
      valid.value = false;
    };

    const addUser = async () => {
      isSubmitting.value = true;
      try {
        await userStore.addUser({ ...user.value });
        closeDialog();
      } catch (error) {
        console.error("Add user failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const updateUser = async () => {
      isSubmitting.value = true;
      try {
        await userStore.updateUser(user.value);
        closeDialog();
      } catch (error) {
        console.error("Update user failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const deleteUser = async (id) => {
      const confirmed = confirm("Are you sure you want to delete this user?");
      if (confirmed) {
        await userStore.deleteUser(id);
      }
    };

    const resetPassword = (id) => {
      selectedUserId.value = id;
      resetPasswordDialog.value = true;
    };

    const resetPasswordAction = async () => {
      isSubmitting.value = true;
      try {
        await userStore.updateUser({
          id: selectedUserId.value,
          password: newPassword.value,
        });
        closeResetPasswordDialog();
      } catch (error) {
        console.error("Password reset failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const closeResetPasswordDialog = () => {
      resetPasswordDialog.value = false;
      newPassword.value = null;
    };

    const toggleUserStatus = (user) => {
      selectedUserId.value = user.id;
      actionType.value = user.is_active ? "deactivate" : "activate"; // Use actionType instead
      confirmDialog.value = true;
    };

    const confirmAction = async () => {
      isSubmitting.value = true;
      try {
        if (actionType.value === "deactivate") {
          await userStore.deactivateUser(selectedUserId.value);
        } else {
          await userStore.activateUser(selectedUserId.value);
        }
      } catch (error) {
        console.error("User status change failed:", error);
      } finally {
        closeConfirmDialog();
        isSubmitting.value = false;
      }
    };

    const closeConfirmDialog = () => {
      confirmDialog.value = false;
    };

    const getRole = (value) => {
      if (typeof value !== "string") {
        return "Unknown";
      }

      const ROLE_VALUES = {
        waiter: "Waiter",
        kitchen: "Kitchen",
        bartender: "Bartender",
        cashier: "Cashier",
        admin: "Admin",
        superadmin: "Super admin",
        entertainment: "Entertainment",
        barber: "Barber",
      };
      return ROLE_VALUES[value.toLowerCase()] || "Unknown";
    };

    const headers = [
      { title: "#", key: "index" },
      { title: "Name", key: "name" },
      { title: "Username", key: "username" },
      { title: "Role", key: "role" },
      { title: "Actions", key: "actions", sortable: false },
    ];

    return {
      users,
      dialog,
      resetPasswordDialog,
      showPassword,
      confirmDialog,
      user,
      newPassword,
      passwordValid,
      valid,
      isEditing,
      isSubmitting,
      roles,
      rules,
      openCreateDialog,
      openUpdateDialog,
      closeDialog,
      addUser,
      updateUser,
      deleteUser,
      resetPassword,
      resetPasswordAction,
      closeResetPasswordDialog,
      toggleUserStatus,
      confirmAction,
      closeConfirmDialog,
      getRole,
      headers,
      loading,
    };
  },
};
</script>