import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
import useLoginStore from "../login";
const API_URL = Api.DASHBOARD_BURL;
const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    dashboardItems: [],
  }),

  actions: {
    async fetchDashboardItems(data) {
      await axios
        .post(API_URL, data)
        .then((response) => {
          this.dashboardItems = response.data;
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
  },
});

export default useDashboardStore;
