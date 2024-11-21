import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
const API_URL = Api.ORDER_ITEM_BURL;
import useSnackStore from "@/stores/snack";
const snack = useSnackStore();
const useOrderItemStore = defineStore("orderItem", {
  state: () => ({
    orderItems: [],
    orderItem: null,
  }),

  actions: {
    async fetchOrderItems() {
      await axios
        .get(API_URL)
        .then((response) => {
          this.orderItems = response.data;
          return Promise.resolve();
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    },

    async fetchOrderItem(id) {
      await axios
        .get(API_URL + `/${id}`)
        .then((response) => {
          this.orderItem = response.data;
          return Promise.resolve();
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    },

    async addOrderItem(data) {
      await axios
        .post(API_URL, data)
        .then((response) => {
          this.orderItems.unshift(response.data);
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async updateOrderItem(data) {
      await axios
        .put(API_URL + `/${data.id}`, data)
        .then((response) => {
          const object = this.orderItems.find(
            (item) => item.id === response.data.id
          );
          if (object) Object.assign(object, response.data);
          else this.orderItem = response.data;
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async trashOrderItem(id) {
      await axios
        .delete(API_URL + `/${id}`)
        .then((response) => {
          this.orderItems = this.orderItems.filter((item) => item.id !== id);
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },
  },
});

export default useOrderItemStore;
