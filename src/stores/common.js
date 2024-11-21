import { defineStore } from "pinia";
const useCommonStore = defineStore("common", {
  state: () => ({
    windowWidth: window.innerWidth,
    drawer: {
      show: true,
      temporary: false,
    },
    notification: {
      status: null,
      message: "",
      show: false
    },
    basePath: "",
    app: null
  }),
  getters: {
    getDrawerStatus: (state) => {
      return state.drawer;
    },
    getNotification: (state) => {
      return state.notification;
    },
    getWinowWidth: (state) => {
      return state.windowWidth;
    },
    getBasePath: (state) => {
      return state.basePath;
    },
    getApp: state => {
      return state.app
    }
  },
  actions: {
    refreshApp() {
      this.app = localStorage.getItem('app')
    },
    setApp(app) {
      localStorage.setItem('app', app);
      this.app = app;
    },
    setWindowWidth(val) {
      this.windowWidth = val;
    },
    setDrawerStatus(val) {
      this.drawer = val;
    },
    setBasePath(val) {
      this.basePath = val;
    },
    setNotification(message, status) {
      this.notification = {
        status: status,
        message: message,
      };
    },
  },
});

export default useCommonStore;
