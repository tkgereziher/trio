<template>
  <div>
    <v-snackbar
      :model-value="snack.isOpen"
      location="bottom right"
      :color="snack.form.status == 1 ? 'success' : 'primary'"
      @update:modelValue="
        !snack.isOpen == true ? (snack.isOpen = true) : (snack.isOpen = false)
      "
    >
      <span class="text-body-1">{{
        snack.form.message ? snack.form.message : ""
      }}</span>
    </v-snackbar>

    <!-- <span class="text-body-1" v-if="snack.form.message">
          {{ snack.form.message}} 
        </span>
        <v-progress-circular indeterminate v-else></v-progress-circular>
      </v-snackbar> -->
  </div>
</template>

<script setup>
import useSnackStore from "@/stores/snack.js";

const snack = new useSnackStore();
</script>
