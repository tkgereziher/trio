<template>
  <v-btn color="#632097" class="float-right" @click="click" flat rounded>
    <v-icon>mdi-plus-circle</v-icon> &nbsp; {{ title ?? "Create" }} New</v-btn
  >
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
    },
  },
  methods: {
    click() {
      this.$emit("click");
    },
  },
};
</script>
