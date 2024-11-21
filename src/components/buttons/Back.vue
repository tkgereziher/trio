<template>
  <v-btn
    :to="to ? { name: to } : ''"
    variant="plain"
    prepend-icon="mdi-arrow-left"
  >
    {{ $route.meta.title }}
  </v-btn>
</template>
<script>
export default {
  props: {
    to: String,
  },
  methods: {
    click() {
      this.$router.go(-1);
    },
  },
};
</script>
