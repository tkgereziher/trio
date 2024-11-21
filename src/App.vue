<template>
  <v-app color="#DDD" style="background-color: #eee !important">
  
    <master-layout
      v-if="accessToken != null"
    ></master-layout>
    <guest-layout v-else></guest-layout>
    <ResponseMessage />
  </v-app>
</template>
<script>
import MasterLayout from "./components/layouts/MasterLayout.vue";
import GuestLayout from "./components/layouts/GuestLayout.vue";
import useLoginStore from "@/stores/login";
import ResponseMessage from "@/components/snack.vue";
export default {
  name: "#app",
  components: {
    MasterLayout,
    GuestLayout,
    ResponseMessage,
  },
  data() {
    return {
      layout: "public",
      loginStore: useLoginStore()
    };
  },
  methods: {
  },
  computed: {
    accessToken(){
      return this.loginStore.accessToken
    }
  },

  watch: {
    $route(to) {
      document.title = to.meta.title + " . " + "Trio";
    },
  },
};
</script>

<style>
body {
  background-color: #fff !important;
}
</style>
