import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
const API_URL = Api.EMPLOYEE_BURL;
import useSnackStore from "@/stores/snack";
import useLoginStore from "../login";
const snack = useSnackStore();
const useEmployeeStore = defineStore("employee", {
  state: () => ({
    employees: [],
    employee: null,
  }),

  actions: {
    async fetchEmployees(initiator = null) {
      await axios
        .get(API_URL + `?initiator=${initiator}`)
        .then((response) => {
          this.employees = response.data;
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

    async fetchEmployee(id) {
      await axios
        .get(API_URL + `/${id}`)
        .then((response) => {
          this.employee = response.data;
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

    async addEmployee(data) {
      await axios
        .post(API_URL, data)
        .then((response) => {
          this.employees.push(response.data);
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async updateEmployee(data) {
      await axios
        .put(API_URL + `/${data.id}`, data)
        .then((response) => {
          const object = this.employees.find(
            (item) => item.id === response.data.id
          );
          if (object) Object.assign(object, response.data);
          else this.employee = response.data;
          snack.showMessage(response);
          return Promise.resolve();
        })
        .catch((error) => {
          snack.showMessage(error.response);
          return Promise.reject(error);
        });
    },

    async trashEmployee(id) {
      await axios
        .delete(API_URL + `/${id}`)
        .then((response) => {
          this.employees = this.employees.filter((item) => item.id !== id);
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

export default useEmployeeStore;
