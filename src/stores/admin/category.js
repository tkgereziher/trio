import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
const API_URL = Api.CATEGORY_BURL;
import useSnackStore from "@/stores/snack";
const snack = useSnackStore();
const useCategoryStore = defineStore("category", {
  state: () => ({
    categories: [],
    category: null,
  }),

  actions: {
    async fetchCategories(initiator = null) {
      await axios
        .get(API_URL + `?initiator=${initiator}`)
        .then((response) => {
          this.categories = response.data;
          return Promise.resolve();
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    },

    async fetchCategory(id) {
      await axios
        .get(API_URL + `/${id}`)
        .then((response) => {
          this.category = response.data;
          return Promise.resolve();
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    },

    async addCategory(data) {
      await axios
        .post(API_URL, data)
        .then((response) => {
          this.categories.push(response.data);
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async updateCategory(data) {
      await axios
        .put(API_URL + `/${data.id}`, data)
        .then((response) => {
          const object = this.categories.find(
            (item) => item.id === response.data.id
          );
          if (object) Object.assign(object, response.data);
          else this.category = response.data;
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async trashCategory(id) {
      await axios
        .delete(API_URL + `/${id}`)
        .then((response) => {
          this.categories = this.categories.filter((item) => item.id !== id);
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

export default useCategoryStore;
