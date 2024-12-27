import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
const API_URL = Api.PRODUCT_BURL;
import useSnackStore from "@/stores/snack";
import useLoginStore from "../login";
const snack = useSnackStore();
const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
    product: null,
  }),

  actions: {
    async fetchProducts() {
      await axios
        .get(API_URL)
        .then((response) => {
          this.products = response.data;
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

    async fetchProduct(id) {
      await axios
        .get(API_URL + `/${id}`)
        .then((response) => {
          this.product = response.data;
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

    async addProduct(data) {
      try {
        const response = await axios.post(API_URL, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        this.products.unshift(response.data);
        snack.showMessage(response);
        return response;
      } catch (error) {
        snack.showMessage(error.response);
        return Promise.reject(error);
      }
    },

    async updateProduct(data, id) {
      await axios
        .post(API_URL + `/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          const object = this.products.find(
            (item) => item.id === response.data.id
          );
          if (object) Object.assign(object, response.data);
          else this.product = response.data;
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async trashProduct(id) {
      await axios
        .delete(API_URL + `/${id}`)
        .then((response) => {
          this.products = this.products.filter((item) => item.id !== id);
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

export default useProductStore;
