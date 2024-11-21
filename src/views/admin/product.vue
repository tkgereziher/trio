<template>
  <v-card min-height="80vh">
    <v-card-title>
      Products
      <CreateNew @click="openCreateDialog" />
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="products"
        class="elevation-1"
        item-key="id"
        :loading="loading"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.name="{ item }">
          <v-avatar :size="40" class="mr-1">
            <v-img :src="item.file_link" style="background-color: grey"></v-img>
          </v-avatar>
          <span class="text-capitalize">{{ item.name }}</span>
        </template>
        <template #item.actions="{ item }">
          <v-icon color="info" @click="openUpdateDialog(item)" class="mr-2"
            >mdi-pencil</v-icon
          >
          <v-icon color="red" @click="deleteProduct(item.id)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
    </v-card-text>
    <!-- Create and Update Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <Close @click="closeDialog" />
          <span v-if="isEditing">Edit</span>
          <span v-else>Add</span>
          Product
          <v-btn
            @click="isEditing ? updateProduct() : addProduct()"
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
            <v-select
              v-model="product.category_id"
              :items="categories"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Select Category"
              :rules="[rules.required]"
              item-title="name"
              item-value="id"
            ></v-select>
            <v-text-field
              v-model="product.name"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Name"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="product.price"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Unit price"
              :rules="[rules.required]"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model="product.quantity"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Quantity"
              :rules="[rules.required]"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model="attachment"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Image"
              type="file"
              @update:model-value="uploadFile"
            ></v-text-field>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import useProductStore from "@/stores/admin/product";
import useCategoryStore from "@/stores/admin/category";

export default {
  setup() {
    const productStore = useProductStore();
    const categoryStore = useCategoryStore();

    const products = computed(() => productStore.products);
    const categories = computed(() => categoryStore.categories);

    const dialog = ref(false);
    const loading = ref(false);
    const attachment = ref("");
    const product = ref({
      name: null,
      category_id: null,
      quantity: null,
      price: null,
      description: null,
      attachment: null,
    });
    const valid = ref(false);
    const isEditing = ref(false);
    const isSubmitting = ref(false);

    const rules = {
      required: (value) => !!value || "Required.",
    };

    onMounted(async () => {
      loading.value = true;
      try {
        await productStore.fetchProducts();
        await categoryStore.fetchCategories();
      } finally {
        loading.value = false;
      }
    });

    const uploadFile = (evt) => {
      product.value.attachment = evt.target.files[0];
    };
    const openCreateDialog = () => {
      product.value = {
        name: null,
        category_id: null,
        quantity: null,
        price: null,
        description: null,
      };
      isEditing.value = false;
      dialog.value = true;
    };

    const openUpdateDialog = (item) => {
      product.value = { ...item };
      isEditing.value = true;
      dialog.value = true;
    };

    const closeDialog = () => {
      dialog.value = false;
      valid.value = false;
    };

    const addProduct = async () => {
      isSubmitting.value = true;
      try {
        await productStore.addProduct(product.value);
        closeDialog();
      } catch (error) {
        console.error("Add product failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const updateProduct = async () => {
      isSubmitting.value = true;
      try {
        await productStore.updateProduct(product.value);
        closeDialog();
      } catch (error) {
        console.error("Update product failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const deleteProduct = async (id) => {
      const confirmed = confirm(
        "Are you sure you want to delete this product?"
      );
      if (confirmed) {
        try {
          await productStore.trashProduct(id);
        } catch (error) {
          console.error("Delete product failed:", error);
        }
      }
    };

    const headers = [
      { title: "#", key: "index" },
      { title: "Name", key: "name" },
      { title: "Category", key: "category.name" },
      { title: "Unit Price", key: "price" },
      { title: "Quantity", key: "quantity" },
      { title: "Actions", key: "actions", sortable: false },
    ];

    return {
      products,
      dialog,
      attachment,
      loading,
      product,
      valid,
      isEditing,
      isSubmitting,
      rules,
      openCreateDialog,
      uploadFile,
      openUpdateDialog,
      closeDialog,
      addProduct,
      updateProduct,
      deleteProduct,
      headers,
      categories,
    };
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
