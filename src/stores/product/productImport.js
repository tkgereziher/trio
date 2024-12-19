import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
const API_URL = Api.PRODUCT_IMPORT_BURL;
import useSnackStore from "@/stores/snack";
const snack = useSnackStore();
const useProductImportStore = defineStore("productImport", {
  state: () => ({
    productImports: [],
    productImport: null,
  }),

  actions: {
    async fetchProductImports() {
      await axios
        .get(API_URL)
        .then((response) => {
          this.productImports = response.data;
          return Promise.resolve();
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    },

    async fetchProductImport(id) {
      await axios
        .get(API_URL + `/${id}`)
        .then((response) => {
          this.productImport = response.data;
          return Promise.resolve();
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    },

    async addProductImport(data) {
      try {
        const response = await axios.post(API_URL, data);
        this.productImports.unshift(response.data);
        snack.showMessage(response);
        return response;
      } catch (error) {
        snack.showMessage(error.response);
        return Promise.reject(error);
      }
    },

    async updateProductImport(data) {
      await axios
        .put(API_URL + `/${data.id}`, data)
        .then((response) => {
          const object = this.productImports.find(
            (item) => item.id === response.data.id
          );
          if (object) Object.assign(object, response.data);
          else this.productImport = response.data;
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async trashProductImport(id) {
      await axios
        .delete(API_URL + `/${id}`)
        .then((response) => {
          this.productImports = this.productImports.filter(
            (item) => item.id !== id
          );
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

export default useProductImportStore;
