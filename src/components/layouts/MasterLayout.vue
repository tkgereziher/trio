<template>
  <div
    style="
      background-image: url(/bg.png);
      background-repeat: repeat;
      height: 100vh;
    "
  >
    <v-navigation-drawer
      temporary
      width="320"
      height="100vh"
      :touchless="show"
      v-model="showMobileNav"
    >
      <div>
        <v-app-bar-title class="pl-2 pt-4 pb-5">
          <v-list-item
            :to="userHome"
            style="
              font-size: 1.5rem;
              color: green !important;
              font-weight: bolder;
            "
          >
            Trio Sportbar & Launge
          </v-list-item>
        </v-app-bar-title>
      </div>
      <v-divider></v-divider>
      <v-list dense>
        <div v-for="item in menuItems" :key="item">
          <v-divider
            v-if="item.type == 'divider'"
            class="mt-2 mb-2"
          ></v-divider>

          <v-list-item
            class="SelectedTile"
            active-class="SelectedTile-active"
            :to="{ name: item.path }"
            link
            rounded="0"
            v-else
          >
            <template v-slot:prepend>
              <v-icon variant="text" :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title class="ListItemClass">
              {{ item.title }}
            </v-list-item-title>
            <v-tooltip activator="parent" location="start" v-if="rail">{{
              item.title
            }}</v-tooltip>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="#171717" height="75" elevation="1">
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          @click.stop="toggleRail"
          v-if="show"
          size="x-large"
        ></v-app-bar-nav-icon>
        <v-app-bar-nav-icon
          @click.stop="showMobileNav = !showMobileNav"
          size="x-large"
          v-else
        ></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title style="margin-left: -5px">
        <a
          :to="userHome"
          style="
            font-size: 1.5rem;
            color: white !important;
            font-weight: bolder;
            cursor: pointer;
          "
        >
          Trio Sports Bar & Lounge
        </a>
      </v-app-bar-title>

      &nbsp;
      <v-menu min-width="200px" rounded width="200">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="#632097" size="45">
              <span class="text-h5 text-uppercase" style="font-weight: 700">{{
                getInitials
              }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item link class="text-capitalize">{{
            getUsername
          }}</v-list-item>
          <v-divider></v-divider>
          <v-list-item link @click="signOut">Logout</v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      :rail="rail"
      permanent
      width="320"
      height="100vh"
      rail-width="60"
      touchless
      v-model="show"
      color="#ebe1f3"
    >
      <v-list dense>
        <!-- <div>
          <v-list-item
            title="Dashboard"
            :to="{ name: 'home' }"
            link
            style="font-size: 20px"
            rounded="0"
          >
            <template v-slot:prepend>
              <v-icon variant="text" icon="mdi-view-dashboard-outline"></v-icon>
            </template>
            <v-tooltip activator="parent" location="start" size="" v-if="rail"
              >Dashboard</v-tooltip
            >
          </v-list-item>
        </div> -->
        <div v-for="item in menuItems" :key="item">
          <v-divider
            v-if="item.type == 'divider'"
            class="mt-2 mb-2"
          ></v-divider>
          <v-list-item
            class="SelectedTile"
            active-class="SelectedTile-active"
            :to="{ name: item.path }"
            link
            style="font-size: 20px"
            rounded="0"
            v-else
          >
            <template v-slot:prepend>
              <v-icon variant="text" :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title class="ListItemClass">
              {{ item.title }}
            </v-list-item-title>
            <v-tooltip activator="parent" location="start" v-if="rail">{{
              item.title
            }}</v-tooltip>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-container fluid id="main-body">
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-container>

    <v-dialog v-model="logoutDialog" width="130" persistent>
      <v-card rounded>
        <v-img height="130" class="align-center text-center">
          <v-progress-circular
            indeterminate
            color="#14A814"
            :size="50"
          ></v-progress-circular>
          <br />
          Logging out...
        </v-img>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapActions } from "pinia";
import useLoginStore from "@/stores/login";
import useCommonStore from "@/stores/common";
import { CONFIG } from "@/constants";
import {
  SUPER_ADMIN_MENU,
  ADMIN_MENU,
  WAITER_MENU,
  KITCHEN_MENU,
  CASHIER_MENU,
  BARTENDER_MENU,
  BARBER_MENU,
  BARBER_CASHIER_MENU,
  ENTETAINMENT_MENU,
  STORE_MENU,
} from "@/constants/Menu";

export default {
  data: () => ({
    rail: false,
    CONFIG: CONFIG,
    show: window.innerWidth >= 768,
    showMobileNav: false,
    userHome: "/",
    group: null,
    logoutDialog: false,
    SUPER_ADMIN_MENU: SUPER_ADMIN_MENU,
    ADMIN_MENU: ADMIN_MENU,
    WAITER_MENU: WAITER_MENU,
    CASHIER_MENU: CASHIER_MENU,
    KITCHEN_MENU: KITCHEN_MENU,
    BARTENDER_MENU: BARTENDER_MENU,
    ENTETAINMENT_MENU: ENTETAINMENT_MENU,
    STORE_MENU: STORE_MENU,
    BARBER_MENU: BARBER_MENU,
    BARBER_CASHIER_MENU: BARBER_CASHIER_MENU,
    commonStore: useCommonStore(),
    loginStore: useLoginStore(),
  }),
  created() {
    this.rail = localStorage.getItem("rail") === "true";
    this.commonStore.refreshApp();
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize() {
      this.show = window.innerWidth >= 768;
      this.showMobileNav = false;
    },
    // ...mapActions(useIdentityStore, ["fetchMyDetail"]),
    ...mapActions(useLoginStore, ["logout"]),

    signOut() {
      this.logoutDialog = true;
      this.logout().finally(() => {
        this.logoutDialog = false;
      });
    },
    toggleRail() {
      localStorage.removeItem("rail");
      localStorage.setItem("rail", !this.rail);
      this.rail = !this.rail;
    },
  },
  computed: {
    getUsername() {
      return this.loginStore.username;
    },
    getInitials() {
      return this.loginStore.username?.charAt(0);
    },
    app() {
      return this.commonStore.app;
    },

    menuItems() {
      switch (this.loginStore.userRole) {
        case "admin":
          return this.ADMIN_MENU;
        case "superamin":
          return this.SUPER_ADMIN_MENU;
        case "waiter":
          return this.WAITER_MENU;
        case "cashier":
          return this.CASHIER_MENU;
        case "kitchen":
          return this.KITCHEN_MENU;
        case "bartender":
          return this.BARTENDER_MENU;
        case "entertainment":
          return this.ENTETAINMENT_MENU;
        case "barber":
          return this.BARBER_MENU;
        case "barber_cashier":
          return this.BARBER_CASHIER_MENU;
        case "store":
          return this.STORE_MENU;
        default:
          return [];
      }
    },
  },
};
</script>
