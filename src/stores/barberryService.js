import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
const API_URL = Api.BARBERRY_SERVICE_BURL;
import useSnackStore from "@/stores/snack";
import useLoginStore from "./login";
const snack = useSnackStore();
const useBarberryServiceStore = defineStore("barberryService", {
  state: () => ({
    barberryServices: [],
    barberryService: null,
  }),

  actions: {
    async fetchBarberryServices(initiator = null) {
      await axios
        .get(API_URL + `?initiator=${initiator}`)
        .then((response) => {
          this.barberryServices = response.data;
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

    async fetchBarberryService(id) {
      await axios
        .get(API_URL + `/${id}`)
        .then((response) => {
          this.barberryService = response.data;
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

    async addBarberryService(data) {
      await axios
        .post(API_URL, data)
        .then((response) => {
          this.barberryServices.unshift(response.data);
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async updateBarberryService(data) {
      await axios
        .put(API_URL + `/${data.id}`, data)
        .then((response) => {
          const object = this.barberryServices.find(
            (item) => item.id === response.data.id
          );
          if (object) Object.assign(object, response.data);
          else this.barberryService = response.data;
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async trashBarberryService(id) {
      await axios
        .delete(API_URL + `/${id}`)
        .then((response) => {
          this.barberryServices = this.barberryServices.filter(
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

export default useBarberryServiceStore;
