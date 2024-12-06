import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
const API_URL = Api.WAITER_BURL;
import useSnackStore from "@/stores/snack";
const snack = useSnackStore();
const useWaiterStore = defineStore("waiter", {
  state: () => ({
    waiters: [],
    waiter: null,
  }),

  actions: {
    async fetchWaiters(initiator = null) {
      await axios
        .get(API_URL + `?initiator=${initiator}`)
        .then((response) => {
          this.waiters = response.data;
          return Promise.resolve();
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    },

    async fetchWaiter(id) {
      await axios
        .get(API_URL + `/${id}`)
        .then((response) => {
          this.waiter = response.data;
          return Promise.resolve();
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    },

    async checkWaiter(code) {
      await axios
        .post(API_URL + "/code", { code: code })
        .then((response) => {
          this.waiter = response.data;
          return Promise.resolve();
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    },
    async addWaiter(data) {
      await axios
        .post(API_URL, data)
        .then((response) => {
          this.waiters.push(response.data);
          this.waiter = response.data;
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async updateWaiter(data) {
      await axios
        .put(API_URL + `/${data.id}`, data)
        .then((response) => {
          const object = this.waiters.find(
            (item) => item.id === response.data.id
          );
          if (object) Object.assign(object, response.data);
          else this.waiter = response.data;
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async trashWaiter(id) {
      await axios
        .delete(API_URL + `/${id}`)
        .then((response) => {
          this.waiters = this.waiters.filter((item) => item.id !== id);
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

export default useWaiterStore;
