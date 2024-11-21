<template>
  <v-btn
    @click="$emit('click')"
    :color="update ? '#14414b' : '#632097'"
    width="160"
    class="float-right"
    prepend-icon="mdi-check-all"
    :loading="loading"
    :disabled="disabled"
    >{{ update ? "Save Changes" : "Save" }}</v-btn
  >
</template>
<script>
export default {
  props: {
    update: Boolean,
    disabled: Boolean,
    loading: Boolean,
  },
};
</script>
