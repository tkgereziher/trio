<template>
  <v-card min-height="80vh">
    <v-card-title>
      {{ isEditing ? "Edit Order" : "New Order" }}
      <v-btn
        @click="showDialog"
        :color="isEditing ? '#14414b' : '#632097'"
        width="200"
        class="float-right text-none"
        prepend-icon="mdi-check-all"
      >
        {{ isEditing ? "Update Order" : "Order" }}
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-card v-if="loading || !categories.length" color="white">
            <v-img min-height="20vh" class="align-center text-center">
              <v-progress-circular
                indeterminate
                color="success"
                v-if="loading"
              ></v-progress-circular>
              <span v-else>No records found!</span>
            </v-img>
          </v-card>
          <v-expansion-panels v-model="panel" v-else>
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
                        :src="product.file_link"
                        style="background: #777"
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
                <th class="text-left">Quantity</th>
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
                <td><strong>Total</strong></td>
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
      <v-form ref="form" v-model="valid" @submit.prevent="checkWaiterCode()">
        <v-card>
          <v-card-title>Enter your code!</v-card-title>
          <v-divider class="mb-3"></v-divider>
          <v-card-text>
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
              type="password"
            ></v-text-field>
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
              variant="flat"
              type="submit"
              :disabled="!waiterCode || isSubmitting"
              :loading="isSubmitting"
              >Ok</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import useOrderStore from "@/stores/order";
import useCategoryStore from "@/stores/admin/category";
import useWaiterStore from "@/stores/admin/waiter";

export default {
  setup() {
    const orderStore = useOrderStore();
    const router = useRouter();
    const route = useRoute();
    const categoryStore = useCategoryStore();
    const waiterStore = useWaiterStore();

    const rules = { required: (value) => !!value || "Required." };
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
        const orderId = route.params.id;
        if (orderId) {
          isEditing.value = true;
          await orderStore.fetchOrder(orderId);

          products.value = order.value.order_items.map((item) => ({
            ...item.product,
          }));
          console.log(products.value);
        }
      } finally {
        loading.value = false;
      }
    });

    const categories = computed(() => categoryStore.categories);
    const order = computed(() => orderStore.order);
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
        isEditing.value ? await updateOrder() : await addOrder();
      } catch (error) {
        showCodeError.value = true;
        console.error("Order submission failed:", error);
      } finally {
        isSubmitting.value = false;
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
        goToOrders();
      } catch (error) {
        console.error("Add order failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const updateOrder = async () => {
      isSubmitting.value = true;
      try {
        await orderStore.updateOrder({
          id: route.params.id,
          waiter_id: waiterStore.waiter.id,
          order_items: products.value,
        });
        closeDialog();
        goToOrders();
      } catch (error) {
        console.error("Update order failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const getTotalPrice = () => {
      return products.value.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
    };

    const goToOrders = () => router.push({ name: "orders" });
    const addItem = (product) => {
      const existingProduct = products.value.find(
        (item) => item.id == product.id
      );
      if (!existingProduct) {
        products.value.push({
          id: product.id,
          name: product.name,
          quantity: 1,
          price: product.price,
        });
      } else {
        existingProduct.quantity = Number(existingProduct.quantity) + 1;
      }
    };
    const removeItem = (productId) => {
      products.value = products.value.filter((item) => item.id != productId);
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
