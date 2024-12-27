import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
const API_URL = Api.MATERIAL_BURL;
import useSnackStore from "@/stores/snack";
import useLoginStore from "../login";
const snack = useSnackStore();
const useMaterialStore = defineStore("material", {
  state: () => ({
    materials: [],
    material: null,
  }),

  actions: {
    async fetchMaterials() {
      await axios
        .get(API_URL)
        .then((response) => {
          this.materials = response.data;
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

    async fetchMaterial(id) {
      await axios
        .get(API_URL + `/${id}`)
        .then((response) => {
          this.material = response.data;
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

    async addMaterial(data) {
      await axios
        .post(API_URL, data)
        .then((response) => {
          this.materials.push(response.data);
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async updateMaterial(data) {
      await axios
        .put(API_URL + `/${data.id}`, data)
        .then((response) => {
          const object = this.materials.find(
            (item) => item.id === response.data.id
          );
          if (object) Object.assign(object, response.data);
          else this.material = response.data;
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async trashMaterial(id) {
      await axios
        .delete(API_URL + `/${id}`)
        .then((response) => {
          this.materials = this.materials.filter((item) => item.id !== id);
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

export default useMaterialStore;
