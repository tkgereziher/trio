import { defineStore } from "pinia";
import axios from "axios";
import Api from "@/constants/Api";
import router from "@/router/";
import { useCookies } from "vue3-cookies";

const API_URL_ReQ = Api.USER_BURL + "/user/password/request";
const API_URL_ReS = Api.USER_BURL + "/user/password/reset";

const API_URL = Api.USER_BURL;

const useLoginStore = defineStore("login", {
  state: () => ({
    accessToken: null,
    loggingIn: false,
    loginError: null,
    userID: null,
    employee: [],
    expDate: null,
    userRole: null,
    username: null,
    statusMessage: "",
  }),

  actions: {
    async Login(loginData) {
      this.loginError = null;
      const response = await axios
        .post(API_URL + "/login", {
          ...loginData,
        })
        .catch((error) => {
          if (!error.response) {
            this.loginError = "Something went wrong.";
          } else {
            this.loginError = "Incorrect credential.";
          }
          return Promise.reject(error);
        });

      var responseData = response.data;
      if (responseData) {
        if (!localStorage.getItem("rail")) localStorage.setItem("rail", false);

        const { cookies } = useCookies();
        this.accessToken = responseData.access_token;
        axios.defaults.headers.common.Authorization = `Bearer ${this.accessToken}`;

        this.username = responseData.user.username;
        this.userRole = responseData.user.role;
        cookies.set("Authorization", this.accessToken, "1y");
        cookies.set("username", this.username, "1y");
        cookies.set("userRole", this.userRole, "1y");
        router.push({ name: "home" });
        return Promise.resolve();
      }
    },

    async fetchAccessToken() {
      const { cookies } = useCookies();
      this.accessToken = cookies.get("Authorization");
      this.username = cookies.get("username");
      this.userRole = cookies.get("userRole");
    },

    async logout() {
      await axios.post(API_URL + "/logout").finally(() => {
        const { cookies } = useCookies();
        cookies.remove("Authorization");
        axios.defaults.headers.common.Authorization = null;

        this.accessToken = null;
        router.push({ name: "login" });
        return Promise.resolve();
      });
    },

    requestResetPassword(email) {
      return axios.post(API_URL_ReQ, email).then(
        () => {
          this.statusMessage = "Request has ben sent.";
          return Promise.resolve();
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    resetPassword(object) {
      return axios.post(API_URL_ReS + `/${object.token}`, object).then(
        () => {
          this.statusMessage = "Password has ben rested.";
          return Promise.resolve();
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    changeUserPassword(object) {
      return axios.put(API_URL + "/change-password", object).then(
        () => {
          this.statusMessage = "Password has ben changed.";
          return Promise.resolve();
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
  },
});

export default useLoginStore;
