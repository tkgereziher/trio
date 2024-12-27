import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
const API_URL = Api.USER_BURL;
import useSnackStore from "@/stores/snack";
import useLoginStore from "../login";
const snack = useSnackStore();
const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    user: null,
  }),

  actions: {
    async fetchUsers(role = null) {
      await axios
        .get(API_URL + `?role=${role}`)
        .then((response) => {
          this.users = response.data;
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

    async fetchUser(id) {
      await axios
        .get(API_URL + `/${id}`)
        .then((response) => {
          this.user = response.data;
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

    async addUser(data) {
      await axios
        .post(API_URL, data)
        .then((response) => {
          this.users.push(response.data);
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async updateUser(data) {
      await axios
        .put(API_URL + `/${data.id}`, data)
        .then((response) => {
          const object = this.users.find(
            (item) => item.id === response.data.id
          );
          if (object) Object.assign(object, response.data);
          else this.user = response.data;
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async trashUser(id) {
      await axios
        .delete(API_URL + `/${id}`)
        .then((response) => {
          this.users = this.users.filter((item) => item.id !== id);
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

export default useUserStore;
