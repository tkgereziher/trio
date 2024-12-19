import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
const API_URL = Api.PLAYSTATION_BURL;
import useSnackStore from "@/stores/snack";
const snack = useSnackStore();
const usePlaystationStore = defineStore("playstation", {
  state: () => ({
    playstations: [],
    playstation: null,
  }),

  actions: {
    async fetchPlaystations(initiator = null, date = null) {
      await axios
        .get(API_URL + `?initiator=${initiator}&date=${date}`)
        .then((response) => {
          this.playstations = response.data;
          return Promise.resolve();
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    },

    async fetchPlaystation(id) {
      await axios
        .get(API_URL + `/${id}`)
        .then((response) => {
          this.playstation = response.data;
          return Promise.resolve();
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    },

    async addPlaystation(data) {
      await axios
        .post(API_URL, data)
        .then((response) => {
          this.playstations.unshift(response.data);
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async updatePlaystation(data) {
      await axios
        .put(API_URL + `/${data.id}`, data)
        .then((response) => {
          const object = this.playstations.find(
            (item) => item.id === response.data.id
          );
          if (object) Object.assign(object, response.data);
          else this.playstation = response.data;
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async trashPlaystation(id) {
      await axios
        .delete(API_URL + `/${id}`)
        .then((response) => {
          this.playstations = this.playstations.filter(
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

export default usePlaystationStore;
