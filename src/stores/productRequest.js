import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
const API_URL = Api.PRODUCT_REQUEST_BURL;
import useSnackStore from "@/stores/snack";
import useLoginStore from "./login";
const snack = useSnackStore();
const useproductRequestStore = defineStore("productRequest", {
  state: () => ({
    productRequests: [],
    productRequest: null,
  }),

  actions: {
    async fetchProductRequests(initiator = null, date = null) {
      await axios
        .get(API_URL + `?initiator=${initiator}&date=${date}`)
        .then((response) => {
          this.productRequests = response.data;
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

    async fetchProductRequest(id) {
      await axios
        .get(API_URL + `/${id}`)
        .then((response) => {
          this.productRequest = response.data;
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

    async addProductRequest(data) {
      await axios
        .post(API_URL, data)
        .then((response) => {
          this.productRequests.unshift(response.data);
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async updateProductRequest(data) {
      await axios
        .put(API_URL + `/${data.id}`, data)
        .then((response) => {
          const object = this.productRequests.find(
            (item) => item.id === response.data.id
          );
          if (object) Object.assign(object, response.data);
          else this.productRequest = response.data;
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async trashProductRequest(id) {
      await axios
        .delete(API_URL + `/${id}`)
        .then((response) => {
          this.productRequests = this.productRequests.filter(
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

export default useproductRequestStore;
