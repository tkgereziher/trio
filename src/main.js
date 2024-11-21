import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
import "vuetify/styles";
import vuetify from "./plugins/vuetify";
app.use(vuetify);

import axios from "axios";
import VueAxios from "vue-axios";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

axios.defaults.headers.common.Authorization =
  "Bearer " + cookies.get("Authorization");

app.use(VueAxios, axios);
app.use(createPinia());
app.use(router);

import VueTelInput from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";
app.use(VueTelInput);

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
app.component("VueDatePicker", VueDatePicker);

import ahazEditor from "@/components/editors/ahazEditor.vue";
import CreateNew from "@/components/buttons/CreateNew.vue";
import Back from "@/components/buttons/Back.vue";
import Close from "@/components/buttons/Close.vue";
import SaveOrUpdate from "@/components/buttons/SaveOrUpdate.vue";

app
  .component("CreateNew", CreateNew)
  .component("Back", Back)
  .component("Close", Close)
  .component("SaveOrUpdate", SaveOrUpdate)
  .component("AhazEditor", ahazEditor);

import { PDFPlugin } from "vue3-pdfmake";
app.use(PDFPlugin);

import "./assets/main.css";

app.mount("#app");
