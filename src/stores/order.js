import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
const API_URL = Api.ORDER_BURL;
import useSnackStore from "@/stores/snack";
import useLoginStore from "./login";
const snack = useSnackStore();
const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [],
    order: null,
  }),

  actions: {
    async fetchOrders() {
      await axios
        .get(API_URL)
        .then((response) => {
          this.orders = response.data;
          return Promise.resolve();
        })
        .catch((error) => {
          if (error.status == 401) {
            const loginStore = useLoginStore();
            loginStore.logout();
          }
          return Promise.reject(error);
        });
    },

    async fetchOrder(id) {
      await axios
        .get(API_URL + `/${id}`)
        .then((response) => {
          this.order = response.data;
          return Promise.resolve();
        })
        .catch((error) => {
          if (error.status == 401) {
            const loginStore = useLoginStore();
            loginStore.logout();
          }
          return Promise.reject(error);
        });
    },

    async addOrder(data) {
      await axios
        .post(API_URL, data)
        .then((response) => {
          this.orders.unshift(response.data);
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async updateOrder(data) {
      await axios
        .put(API_URL + `/${data.id}`, data)
        .then((response) => {
          const object = this.orders.find(
            (item) => item.id === response.data.id
          );
          if (object) Object.assign(object, response.data);
          else this.order = response.data;
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async updateOrderState(id, state) {
      await axios
        .put(API_URL + `/${id}/state/${state}`)
        .then((response) => {
          // this.orders = this.orders.filter((item) => item.id !== id);
          const object = this.orders.find(
            (item) => item.id === response.data.id
          );
          if (object) Object.assign(object, response.data);
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async trashOrder(id) {
      await axios
        .delete(API_URL + `/${id}`)
        .then((response) => {
          this.orders = this.orders.filter((item) => item.id !== id);
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

export default useOrderStore;
