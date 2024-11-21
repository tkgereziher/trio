<template>
  <v-card flat>
    <v-row>
      <v-col cols="12" lg="10">
        <v-toolbar color="#fff">
          <template v-slot:title>
            <v-btn
              color="#632097"
              class="mr-2 ml-n3"
              @click="
                step == 1 ? $router.push({ name: 'welcome' }) : (step -= 1)
              "
              icon
            >
              <v-icon
                size="x-large"
                :icon="step == 1 ? 'mdi-close' : 'mdi-arrow-left'"
              ></v-icon>
            </v-btn>
            <strong>Login</strong>
          </template>
        </v-toolbar>
        <v-card-text class="pt-0">
          <div>
            <v-btn
              type="submit"
              variant="outlined"
              block
              :to="{ name: 'signup' }"
              class="mb-4"
              prepend-icon="mdi-google"
            >
              Sign in with Google</v-btn
            >
            <v-btn
              type="submit"
              color="primary"
              variant="outlined"
              block
              :to="{ name: 'signup' }"
              class="mb-4"
              prepend-icon="mdi-facebook"
            >
              Sign in with Facebook</v-btn
            >
          </div>
          <p class="text-center mb-4">Or</p>
          <v-form
            fast-fail
            @submit.prevent="signIn"
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <div v-if="step == 1">
              <div class="mb-3">
                <span class="text-red mb-5" v-if="getIdentificationError">{{
                  getIdentificationError
                }}</span>
              </div>
              <v-text-field
                variant="outlined"
                color="#632097"
                v-model="login_name"
                :rules="[rules.required]"
                density="compact"
                label="Username, phone, or email"
              >
              </v-text-field>
              <v-btn
                type="submit"
                :loading="loading"
                color="#632097"
                prepend-icon="mdi-lock"
                block
              >
                Login</v-btn
              >
            </div>
            <div v-else>
              <div class="mb-3">
                <span class="text-red pb-5" v-if="getLoginError">{{
                  getLoginError
                }}</span>
              </div>
              <v-text-field
                variant="outlined"
                :type="show_password ? 'text' : 'password'"
                color="#632097"
                v-model="record.password"
                :rules="[rules.required]"
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

              <v-checkbox
                label="Remember me"
                v-model="remember_me"
              ></v-checkbox>
              <v-btn
                type="submit"
                :loading="loading"
                color="#632097"
                prepend-icon="mdi-lock"
                block
              >
                Sign in</v-btn
              >
            </div>
            <div class="text-center mt-2">
              <v-btn variant="plain" :to="{ name: 'forgetPassword' }"
                >Forget password?</v-btn
              >
            </div>

            <v-row v-if="step == 1">
              <v-col cols="6" class="text-right mt-2">
                Don't have account?
              </v-col>
              <v-col cols="6" sm="4" md="2" class="text-left">
                <v-btn
                  color="primary"
                  block
                  variant="plain"
                  :to="{ name: 'signup' }"
                  class="align-left"
                >
                  <span class="text-left">Sign up</span></v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import { mapState, mapActions } from "pinia";
import useLoginStore from "@/stores/account/login";

export default {
  data() {
    return {
      step: 1,
      myLabel: null,
      valid: true,
      login_name: null,
      record: {
        identity_id: null,
        password: null,
      },
      show_password: false,
      remember_me: false,
      loading: false,
      rules: {
        required: (value) => !!value || "This Field is required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
        email: (em) => /.+@.+\..+/.test(em) || "E-mail must be valid.",
        emailMatch: () => `The email and password you entered don't match`,
      },
    };
  },
  methods: {
    ...mapActions(useLoginStore, ["Login", "checkIdentity"]),
    signIn() {
      this.$refs.form.validate();
      if (this.$refs.form.isValid) {
        if (this.step == 1) {
          this.loading = true;
          this.checkIdentity({ login_name: this.login_name })
            .then((response) => {
              this.loading = false;
              if (this.getAccount) {
                this.step++;
                this.record.identity_id = this.getAccount.identity_id;
              }
            })
            .catch((error) => {
              this.loading = false;
            });
        } else {
          this.loading = true;
          this.Login(this.record)
            .then((response) => {
              this.loading = false;
            })
            .catch((error) => {
              this.loading = false;
            });
        }
      }
    },
  },
  computed: mapState(useLoginStore, [
    "getLoginError",
    "getLoggingIn",
    "getIdentificationError",
    "getAccount",
  ]),
};
</script>

<style scoped>
.login {
  padding: 1.5rem;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
}
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
img {
  width: 3rem;
  height: 3rem;
}
</style>
