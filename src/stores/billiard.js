import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
const API_URL = Api.BILLIARD_BURL;
import useSnackStore from "@/stores/snack";
import useLoginStore from "./login";
const snack = useSnackStore();
const useBilliardStore = defineStore("billiard", {
  state: () => ({
    billiards: [],
    billiard: null,
  }),

  actions: {
    async fetchBilliards(initiator = null, date = null) {
      await axios
        .get(API_URL + `?initiator=${initiator}&date=${date}`)
        .then((response) => {
          this.billiards = response.data;
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

    async fetchBilliard(id) {
      await axios
        .get(API_URL + `/${id}`)
        .then((response) => {
          this.billiard = response.data;
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

    async addBilliard(data) {
      await axios
        .post(API_URL, data)
        .then((response) => {
          this.billiards.unshift(response.data);
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async updateBilliard(data) {
      await axios
        .put(API_URL + `/${data.id}`, data)
        .then((response) => {
          const object = this.billiards.find(
            (item) => item.id === response.data.id
          );
          if (object) Object.assign(object, response.data);
          else this.billiard = response.data;
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async trashBilliard(id) {
      await axios
        .delete(API_URL + `/${id}`)
        .then((response) => {
          this.billiards = this.billiards.filter((item) => item.id !== id);
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

export default useBilliardStore;
