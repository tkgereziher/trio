<template>
  <v-card min-height="80vh">
    <v-card-title>
      Barbers
      <CreateNew @click="openCreateDialog" />
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="barbers"
        class="elevation-1"
        item-key="id"
        :loading="loading"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.name="{ item }">
          <span class="text-capitalize"
            >{{ item.first_name }} {{ item.middle_name }}
            {{ item.last_name }}</span
          >
        </template>
        <template #item.actions="{ item }">
          <v-icon color="info" @click="openUpdateDialog(item)" class="mr-2"
            >mdi-pencil</v-icon
          >
          <!-- <v-icon color="red" @click="deleteBarber(item.id)"
            >mdi-delete</v-icon
          > -->
        </template>
      </v-data-table>
    </v-card-text>
    <!-- Create and Update Dialog -->
    <v-dialog v-model="dialog" width="500">
      <v-form
        ref="form"
        v-model="valid"
        @submit.prevent="isEditing ? updateBarber() : addBarber()"
        ><v-card>
          <v-card-title>
            <Close @click="closeDialog" />
            <span v-if="isEditing">Edit</span>
            <span v-else>Add</span>
            Barber
            <v-btn
              @click="isEditing ? updateBarber() : addBarber()"
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
              v-model="barber.first_name"
              variant="outlined"
              density="compact"
              color="#632097"
              label="First name"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="barber.middle_name"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Middle name"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="barber.last_name"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Last name"
            ></v-text-field>
            <v-select
              v-model="barber.sex"
              :items="['Male', 'Female']"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Last name"
              :rules="[rules.required]"
            ></v-select>
            <v-text-field
              v-model="barber.phone"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Phone"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-form>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import useBarberStore from "@/stores/admin/barber";

export default {
  setup() {
    const barberStore = useBarberStore();
    const barbers = computed(() => barberStore.barbers);
    const dialog = ref(false);
    const loading = ref(false);
    const barber = ref({
      first_name: null,
      middle_name: null,
      last_name: null,
      sex: "Male",
      phone: null,
    });
    const valid = ref(false);
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
        await barberStore.fetchBarbers();
      } finally {
        loading.value = false;
      }
    });

    const openCreateDialog = () => {
      barber.value = {
        first_name: null,
        middle_name: null,
        last_name: null,
        sex: "Male",
        phone: null,
      };
      isEditing.value = false;
      dialog.value = true;
    };

    const openUpdateDialog = (item) => {
      barber.value = { ...item };
      isEditing.value = true;
      dialog.value = true;
    };

    const closeDialog = () => {
      dialog.value = false;
      valid.value = false;
    };

    const addBarber = async () => {
      isSubmitting.value = true;
      try {
        await barberStore.addBarber(barber.value);
        closeDialog();
      } catch (error) {
        console.error("Add barber failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const updateBarber = async () => {
      isSubmitting.value = true;
      try {
        await barberStore.updateBarber(barber.value);
        closeDialog();
      } catch (error) {
        console.error("Update barber failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const deleteBarber = async (id) => {
      const confirmed = confirm("Are you sure you want to delete this barber?");
      if (confirmed) {
        try {
          await barberStore.trashBarber(id);
        } catch (error) {
          console.error("Delete barber failed:", error);
        }
      }
    };

    const headers = [
      { title: "#", key: "index" },
      { title: "Name", key: "name" },
      { title: "Sex", key: "sex" },
      { title: "Phone", key: "phone" },
      { title: "Actions", key: "actions", sortable: false },
    ];

    return {
      barbers,
      dialog,
      loading,
      barber,
      valid,
      isEditing,
      isSubmitting,
      rules,
      openCreateDialog,
      openUpdateDialog,
      closeDialog,
      addBarber,
      updateBarber,
      deleteBarber,
      headers,
    };
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
