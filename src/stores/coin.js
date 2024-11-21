import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
const API_URL = Api.COIN_BURL;
import useSnackStore from "@/stores/snack";
const snack = useSnackStore();
const useCoinStore = defineStore("coin", {
  state: () => ({
    coins: [],
    coin: null,
  }),

  actions: {
    async fetchCoins(initiator = null) {
      await axios
        .get(API_URL + `?initiator=${initiator}`)
        .then((response) => {
          this.coins = response.data;
          return Promise.resolve();
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    },

    async fetchCoin(id) {
      await axios
        .get(API_URL + `/${id}`)
        .then((response) => {
          this.coin = response.data;
          return Promise.resolve();
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    },

    async addCoin(data) {
      await axios
        .post(API_URL, data)
        .then((response) => {
          this.coins.unshift(response.data);
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async updateCoin(data) {
      await axios
        .put(API_URL + `/${data.id}`, data)
        .then((response) => {
          const object = this.coins.find(
            (item) => item.id === response.data.id
          );
          if (object) Object.assign(object, response.data);
          else this.coin = response.data;
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async trashCoin(id) {
      await axios
        .delete(API_URL + `/${id}`)
        .then((response) => {
          this.coins = this.coins.filter((item) => item.id !== id);
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

export default useCoinStore;
