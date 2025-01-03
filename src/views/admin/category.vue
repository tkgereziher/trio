<template>
  <v-card min-height="80vh">
    <v-card-title>
      Food Categories
      <CreateNew @click="openCreateDialog" />
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="categories"
        class="elevation-1"
        item-key="id"
        :loading="loading"
        hide-default-footer
        :items-per-page="categories.length"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.origin="{ item }">
          <span class="text-capitalize">{{ item.origin }}</span>
        </template>
        <template #item.actions="{ item }">
          <v-icon color="info" @click="openUpdateDialog(item)" class="mr-2"
            >mdi-pencil</v-icon
          >
          <v-icon color="red" @click="deleteCategory(item.id)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
    </v-card-text>
    <v-dialog v-model="dialog" width="600px">
      <v-form
        ref="form"
        v-model="valid"
        @submit.prevent="isEditing ? updateCategory() : addCategory()"
      >
        <v-card>
          <v-card-title>
            <Close @click="closeDialog" />
            <span v-if="isEditing">Edit</span>
            <span v-else>Add</span>
            Category
            <v-btn
              @click="isEditing ? updateCategory() : addCategory()"
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
              v-model="category.name"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Name"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-select
              v-model="category.origin"
              :items="origins"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Select Origin"
              :rules="[rules.required]"
              item-value="value"
              item-title="text"
            ></v-select>
            <v-textarea
              v-model="category.description"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Description"
              rows="2"
            ></v-textarea>
          </v-card-text>
        </v-card>
      </v-form>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import useCategoryStore from "@/stores/admin/category";

export default {
  setup() {
    const categoryStore = useCategoryStore();
    const categories = computed(() => categoryStore.categories);
    const dialog = ref(false);
    const loading = ref(false);
    const category = ref({ name: null, origin: null, description: null });
    const valid = ref(false);
    const isEditing = ref(false);
    const isSubmitting = ref(false);
    const rules = {
      required: (value) => !!value || "Required.",
      minLength: (value) =>
        (value && value.length >= 3) || "Minimum 3 characters.",
    };

    const origins = [
      { text: "Kitchen", value: "kitchen" },
      { text: "Bartender", value: "bartender" },
    ];

    onMounted(async () => {
      loading.value = true;
      try {
        await categoryStore.fetchCategories();
      } finally {
        loading.value = false;
      }
    });

    const openCreateDialog = () => {
      category.value = { name: null, origin: null, description: null };
      isEditing.value = false;
      dialog.value = true;
    };

    const openUpdateDialog = (item) => {
      category.value = { ...item };
      isEditing.value = true;
      dialog.value = true;
    };

    const closeDialog = () => {
      dialog.value = false;
      valid.value = false;
    };

    const addCategory = async () => {
      isSubmitting.value = true;
      try {
        await categoryStore.addCategory(category.value);
        closeDialog();
      } catch (error) {
        console.error("Add category failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const updateCategory = async () => {
      isSubmitting.value = true;
      try {
        await categoryStore.updateCategory(category.value);
        closeDialog();
      } catch (error) {
        console.error("Update category failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const deleteCategory = async (id) => {
      const confirmed = confirm(
        "Are you sure you want to delete this category?"
      );
      if (confirmed) {
        try {
          await categoryStore.trashCategory(id);
        } catch (error) {
          console.error("Delete category failed:", error);
        }
      }
    };

    const headers = [
      { title: "#", key: "index" },
      { title: "Name", key: "name" },
      { title: "From", key: "origin" },
      { title: "Actions", key: "actions", sortable: false },
    ];

    return {
      categories,
      dialog,
      loading,
      category,
      valid,
      isEditing,
      isSubmitting,
      rules,
      origins,
      openCreateDialog,
      openUpdateDialog,
      closeDialog,
      addCategory,
      updateCategory,
      deleteCategory,
      headers,
    };
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
