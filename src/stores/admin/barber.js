import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
const API_URL = Api.BARBER_BURL;
import useSnackStore from "@/stores/snack";
import useLoginStore from "../login";
const snack = useSnackStore();
const useBarberStore = defineStore("barber", {
  state: () => ({
    barbers: [],
    barber: null,
  }),

  actions: {
    async fetchBarbers(initiator = null) {
      await axios
        .get(API_URL + `?initiator=${initiator}`)
        .then((response) => {
          this.barbers = response.data;
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

    async fetchBarber(id) {
      await axios
        .get(API_URL + `/${id}`)
        .then((response) => {
          this.barber = response.data;
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

    async addBarber(data) {
      await axios
        .post(API_URL, data)
        .then((response) => {
          this.barbers.push(response.data);
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async updateBarber(data) {
      await axios
        .put(API_URL + `/${data.id}`, data)
        .then((response) => {
          const object = this.barbers.find(
            (item) => item.id === response.data.id
          );
          if (object) Object.assign(object, response.data);
          else this.barber = response.data;
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async trashBarber(id) {
      await axios
        .delete(API_URL + `/${id}`)
        .then((response) => {
          this.barbers = this.barbers.filter((item) => item.id !== id);
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

export default useBarberStore;
