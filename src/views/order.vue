<template>
  <v-card min-height="80vh">
    <v-card-title
      >Order
      <v-btn
        @click="showDialog"
        :color="isEditing ? '#14414b' : '#632097'"
        width="160"
        class="float-right text-none"
        prepend-icon="mdi-check-all"
        >{{ isEditing ? "Save Changes" : "Save" }}</v-btn
      >
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-expansion-panels v-model="panel">
            <v-expansion-panel
              v-for="category in categories"
              :key="category.id"
            >
              <v-expansion-panel-title>{{
                category.name
              }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list-item
                  v-for="product in category.products"
                  :key="product.id"
                  class="py-2 my-2"
                  border
                  @click="addItem(product)"
                >
                  <template v-slot:prepend>
                    <v-avatar size="45">
                      <v-img
                        style="background: #777"
                        :src="product.file_link"
                      ></v-img>
                    </v-avatar>
                  </template>
                  <template v-slot:append>
                    <v-icon
                      color="primary"
                      icon="mdi-plus"
                      size="25"
                      @click="addItem(product)"
                    ></v-icon>
                  </template>
                  <v-list-item-title>{{ product.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    product.price
                  }}</v-list-item-subtitle>
                </v-list-item>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col cols="12" md="6">
          <v-table>
            <thead>
              <tr>
                <th class="text-left">Item</th>
                <th class="text-left">Quanity</th>
                <th class="text-left">Unit Price</th>
                <th class="text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>{{ product.name }}</td>
                <td>
                  <v-text-field
                    v-model="product.quantity"
                    density="compact"
                    variant="outlined"
                    type="number"
                    class="mt-2"
                  ></v-text-field>
                </td>
                <td>{{ product.price }}</td>
                <td>
                  <v-icon title="Remove Item" @click="removeItem(product.id)"
                    >mdi-close</v-icon
                  >
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>{{ getTotalPrice() }}</strong>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-card-text>

    <v-dialog v-model="waiterDialog" width="400">
      <v-card>
        <v-card-title> Enetr your code </v-card-title>
        <v-divider class="mb-3"></v-divider>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <p
              class="text-red text-small mb-3 text-center"
              v-if="showCodeError"
            >
              Incorrect code! Please enter correct code.
            </p>
            <v-text-field
              v-model="waiterCode"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Code"
              :rules="[rules.required]"
              type="number"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <Close @click="closeDialog" />
          <v-spacer></v-spacer>
          <v-btn
            @click="checkWaiterCode()"
            :color="'#632097'"
            width="160"
            class="float-right text-none"
            prepend-icon="mdi-check-all"
            :disabled="!waiterCode || isSubmitting"
            :loading="isSubmitting"
            variant="flat"
            >{{ Ok }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import useOrderStore from "@/stores/order";
import useCategoryStore from "@/stores/admin/category";
import useWaiterStore from "@/stores/admin/waiter";
export default {
  setup() {
    const orderStore = useOrderStore();
    const categoryStore = useCategoryStore();
    const waiterStore = useWaiterStore();
    const rules = {
      required: (value) => !!value || "Required.",
    };
    const panel = ref(null);
    const isSubmitting = ref(false);
    const waiterCode = ref(null);
    const waiterDialog = ref(false);
    const products = ref([]);
    const isEditing = ref(false);
    const showCodeError = ref(false);
    const loading = ref(false);

    onMounted(async () => {
      loading.value = true;
      try {
        await categoryStore.fetchCategories("order");
      } finally {
        loading.value = false;
      }
    });

    const categories = computed(() => categoryStore.categories);

    const showDialog = () => {
      waiterDialog.value = true;
      waiterCode.value = null;
    };

    const closeDialog = () => {
      waiterCode.value = null;
      waiterDialog.value = false;
    };
    const checkWaiterCode = async () => {
      isSubmitting.value = true;
      showCodeError.value = false;
      try {
        await waiterStore.checkWaiter(waiterCode.value);
        addOrder();
      } catch (error) {
        showCodeError.value = true;
        console.error("Add order failed:", error);
      }
    };

    const addOrder = async () => {
      isSubmitting.value = true;
      try {
        await orderStore.addOrder({
          waiter_id: waiterStore.waiter.id,
          order_items: products.value,
        });
        closeDialog();
      } catch (error) {
        console.error("Add order failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const getTotalPrice = () => {
      return products.value.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);
    };

    const addItem = async (product) => {
      const productExists = products.value.find(
        (item) => item.id == product.id
      );
      if (!productExists)
        products.value.push({
          id: product.id,
          name: product.name,
          quantity: 1,
          price: product.price,
        });
    };
    const removeItem = async (productId) => {
      products.value = products.value.filter((item) => item.id != productId);
    };

    const updateOrder = async () => {
      isSubmitting.value = true;
      try {
        await orderStore.updateOrder(order.value);
        closeDialog();
      } catch (error) {
        console.error("Update order failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };
    return {
      loading,
      showCodeError,
      panel,
      waiterCode,
      isSubmitting,
      isEditing,
      waiterDialog,
      categories,
      rules,
      products,
      addItem,
      getTotalPrice,
      removeItem,
      updateOrder,
      addOrder,
      closeDialog,
      checkWaiterCode,
      showDialog,
    };
  },
};
</script>