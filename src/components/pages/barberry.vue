<template>
  <v-card min-height="80vh">
    <v-card-title
      >Barberry Services
      <create-new @click="openCreateDialog" v-if="role && role == 'barberry'" />
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="barberryServices"
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

        <template #item.created_at="{ item }">
          {{ formattedDate(item.created_at) }}
        </template>
        <template #item.actions="{ item }">
          <span v-if="role && role == 'barberry'">
            <v-icon
              color="info"
              v-if="item.state == 'new'"
              @click="openUpdateDialog(item)"
              class="mr-2"
              >mdi-pencil</v-icon
            >
            <!-- <v-icon
              color="red"
              v-if="item.state == 'new'"
              @click="openUpdateStateDialog(item.id, 'delete')"
              >mdi-delete</v-icon
            > -->
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
        @submit.prevent="
          isEditing ? updateBarberryService() : addBarberryService()
        "
      >
        <v-card>
          <v-card-title>
            <Close @click="closeDialog" />
            <span v-if="isEditing">Edit</span>
            <span v-else>Add</span>
            Record
            <v-btn
              @click="
                isEditing ? updateBarberryService() : addBarberryService()
              "
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
            <v-select
              v-model="barberryService.barberry_category_id"
              variant="outlined"
              density="compact"
              color="#632097"
              :items="categories"
              label="Category"
              item-title="name"
              item-value="id"
              :rules="[rules.required]"
              @update:model-value="onUpdateCategory"
            ></v-select>
            <v-text-field
              v-model="barberryService.price"
              variant="outlined"
              density="compact"
              color="#632097"
              label="price"
              :readonly="true"
              type="number"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-form>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import useBarberryServiceStore from "@/stores/barberryService";
import useBarberryCategoryStore from "@/stores/admin/barberryCategory";
import moment from "moment";
export default {
  props: {
    role: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const barberryServiceStore = useBarberryServiceStore();
    const barberryCategoryStore = useBarberryCategoryStore();
    const barberryServices = computed(
      () => barberryServiceStore.barberryServices
    );
    const categories = computed(() => barberryCategoryStore.categories);

    const dialog = ref(false);
    const valid = ref(false);
    const formDialog = ref(false);
    const selectedState = ref(null);
    const selectedItemId = ref(null);
    const barberryService = ref({ price: null });
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
        await barberryServiceStore.fetchBarberryServices(props.role);
        await barberryCategoryStore.fetchCategories();
      } finally {
        loading.value = false;
      }
    });

    const openCreateDialog = () => {
      barberryService.value = { price: null };
      isEditing.value = false;
      formDialog.value = true;
    };
    const onUpdateCategory = (id) => {
      const selectedCategory = categories.value.find((item) => item.id == id);
      console.log(selectedCategory);
      barberryService.value.price = selectedCategory?.price;
    };
    const openUpdateDialog = (item) => {
      barberryService.value = { ...item };
      isEditing.value = true;
      formDialog.value = true;
    };
    const addBarberryService = async () => {
      isSubmitting.value = true;
      try {
        await barberryServiceStore.addBarberryService(barberryService.value);
        closeDialog();
      } catch (error) {
        console.error("Add barberryService failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const updateBarberryService = async () => {
      isSubmitting.value = true;
      try {
        await barberryServiceStore.updateBarberryService(barberryService.value);
        closeDialog();
      } catch (error) {
        console.error("Update barberryService failed:", error);
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

    const updateItemState = async () => {
      isSubmitting.value = true;
      try {
        if (selectedState.value == "delete")
          await barberryServiceStore.trashBarberryService(selectedItemId.value);
        else
          await barberryServiceStore.updateBarberryService({
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
      props.role == "admin"
        ? [
            { title: "#", key: "index", sortable: false },
            { title: "User", key: "user" },
            { title: "Category", key: "category.name" },
            { title: "Price", key: "price", sortable: false },
            { title: "Date", key: "created_at", sortable: false },
          ]
        : [
            { title: "#", key: "index", sortable: false },
            { title: "Category", key: "category.name" },
            { title: "Price", key: "price", sortable: false },
            { title: "Date", key: "created_at", sortable: false },
            { title: "Actions", key: "actions", sortable: false },
          ];

    return {
      barberryServices,
      categories,
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
      openUpdateStateDialog,
      barberryService,
      addBarberryService,
      updateBarberryService,
      openCreateDialog,
      onUpdateCategory,
      openUpdateDialog,
      formDialog,
    };
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
