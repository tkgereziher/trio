<template>
  <div style="background-image: url(/bg.png); height: 100vh">
    <v-container fill-height class="d-flex justify-center align-center">
      <v-card flat class="pa-4 login w-100 w-md-50" min-height="90vh">
        <v-card-title>
          <div
            class="text-center"
            style="
              font-size: 2rem;
              color: #632097 !important;
              font-weight: bolder;
            "
          >
            <p class="brand">Trio</p>
            <div>Sports Bar & Lounge</div>
          </div>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-form
            fast-fail
            @submit.prevent="signIn"
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-text-field
              variant="outlined"
              color="#632097"
              v-model="record.username"
              :rules="[rules.required]"
              density="compact"
              class="mb-5 mt-5"
              label="Username"
            ></v-text-field>
            <v-text-field
              variant="outlined"
              :type="show_password ? 'text' : 'password'"
              color="#632097"
              v-model="record.password"
              :rules="[rules.required]"
              class="mb-3"
              density="compact"
              label="Password"
            >
              <template v-slot:append-inner>
                <v-btn
                  icon
                  variant="text"
                  @click="show_password = !show_password"
                >
                  <v-icon icon="mdi-eye-outline" v-if="show_password" />
                  <v-icon icon="mdi-eye-off-outline" v-else />
                </v-btn>
              </template>
            </v-text-field>
            <div class="mt-2 ml-5 mb-0" v-if="showError">
              <span class="text-red">Incorrect username or password!</span>
            </div>
            <v-btn
              type="submit"
              :loading="loading"
              :disabled="loading"
              color="#632097"
              block
              class="mt-2"
              prepend-icon="mdi-lock"
            >
              Sign in
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import useLoginStore from "@/stores/login";
import { CONFIG } from "@/constants/";
export default {
  data() {
    return {
      CONFIG: CONFIG,
      myLabel: null,
      valid: true,
      showError: false,
      record: {
        username: null,
        password: null,
      },
      show_password: false,
      remember_me: false,
      loading: false,
      loginStore: useLoginStore(),
      rules: {
        required: (value) => !!value || "This Field is required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
        email: (em) => /.+@.+\..+/.test(em) || "E-mail must be valid.",
        emailMatch: () => `The email and password you entered don't match`,
      },
    };
  },
  methods: {
    signIn() {
      this.loading = true;
      this.$refs.form.validate().then((success) => {
        this.showError = false;
        if (!success) {
          return;
        }
        this.loginStore
          .Login({
            username: this.record.username,
            password: this.record.password,
          })
          .catch(() => (this.showError = true))
          .finally(() => {
            this.loading = false;
          });
      });
    },
  },
};
</script>

<style scoped>
.container-loading {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex !important;
  justify-content: center;
  align-items: center;
}
.brand {
  font-weight: bolder;
  font-size: 40px;
  text-transform: uppercase;
}
</style>
