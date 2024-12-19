<template>
  <v-card min-height="80vh">
    <v-card-title>
      Imports
      <CreateNew @click="openCreateDialog" />
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="productImports"
        class="elevation-1"
        item-key="id"
        :loading="loading"
        hide-default-footer
        :items-per-page="productImports.length"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>

        <template #item.actions="{ item }">
          <v-icon color="info" @click="openUpdateDialog(item)" class="mr-2"
            >mdi-pencil</v-icon
          >
          <!-- <v-icon color="red" @click="deleteProductImport(item.id)"
            >mdi-delete</v-icon
          > -->
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
          Import
          <v-btn
            @click="isEditing ? updateProductImport() : addProductImport()"
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
            <v-autocomplete
              v-model="productImport.product_id"
              :items="products"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Select Product"
              :rules="[rules.required]"
              item-title="name"
              item-value="id"
            ></v-autocomplete>
            <v-text-field
              v-model="productImport.amount"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Amount"
              :rules="[rules.required]"
              type="number"
              min="1"
              @update:model-value="updateTotalPrice()"
            ></v-text-field>
            <v-text-field
              v-model="productImport.unit_price"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Unit price"
              :rules="[rules.required]"
              type="number"
              min="1"
              @update:model-value="updateTotalPrice()"
            ></v-text-field>
            <v-text-field
              v-model="productImport.total_price"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Total price"
              type="number"
              readonly
            ></v-text-field>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import useProductImportStore from "@/stores/product/productImport";
import useProductStore from "@/stores/admin/product";

export default {
  setup() {
    const productImportStore = useProductImportStore();
    const productStore = useProductStore();

    const productImports = computed(() => productImportStore.productImports);
    const products = computed(() => productStore.products);

    const dialog = ref(false);
    const loading = ref(false);
    const productImport = ref({
      amount: null,
      product_id: null,
      unit_price: null,
      total_price: 0,
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
        await productImportStore.fetchProductImports();
        await productStore.fetchProducts();
      } finally {
        loading.value = false;
      }
    });

    const openCreateDialog = () => {
      productImport.value = {
        amount: null,
        product_id: null,
        unit_price: null,
        total_price: 0,
      };
      isEditing.value = false;
      dialog.value = true;
    };

    const updateTotalPrice = () => {
      productImport.value.total_price =
        (productImport.value.amount || 0) *
        (productImport.value.unit_price || 0);
    };
    const openUpdateDialog = (item) => {
      productImport.value = { ...item };
      isEditing.value = true;
      dialog.value = true;
    };

    const closeDialog = () => {
      dialog.value = false;
      valid.value = false;
    };

    const addProductImport = async () => {
      isSubmitting.value = true;
      try {
        await productImportStore.addProductImport(productImport.value);
        closeDialog();
      } catch (error) {
        console.error("Import product failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const updateProductImport = async () => {
      isSubmitting.value = true;
      try {
        await productImportStore.updateProductImport(productImport.value);
        closeDialog();
      } catch (error) {
        console.error("Update productImport failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const deleteProductImport = async (id) => {
      const confirmed = confirm(
        "Are you sure you want to delete this productImport?"
      );
      if (confirmed) {
        try {
          await productImportStore.trashProductImport(id);
        } catch (error) {
          console.error("Delete productImport failed:", error);
        }
      }
    };

    const headers = [
      { title: "#", key: "index" },
      { title: "Product", key: "product.name" },
      { title: "Amount", key: "amount" },
      { title: "Unit Price", key: "unit_price" },
      { title: "Total Price", key: "total_price" },
      { title: "Actions", key: "actions", sortable: false },
    ];

    return {
      productImports,
      dialog,
      loading,
      productImport,
      updateTotalPrice,
      valid,
      isEditing,
      isSubmitting,
      rules,
      openCreateDialog,
      openUpdateDialog,
      closeDialog,
      addProductImport,
      updateProductImport,
      deleteProductImport,
      headers,
      products,
    };
  },
};
</script>