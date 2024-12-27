import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
import useLoginStore from "../login";
const API_URL = Api.PRODUCT_BALANCE_BURL;
const useProductBalanceStore = defineStore("productBalance", {
  state: () => ({
    productBalances: [],
  }),

  actions: {
    async fetchProductBalances() {
      await axios
        .get(API_URL)
        .then((response) => {
          this.productBalances = response.data;
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
  },
});

export default useProductBalanceStore;
