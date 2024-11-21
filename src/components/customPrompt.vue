<template>
  <v-dialog v-model="isDialogOpen" max-width="500px">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="url"
          :label="urlLabel"
          variant="outlined"
          density="compact"
        />
        <v-text-field
          v-if="hasLabel"
          v-model="label"
          :label="labelText"
          variant="outlined"
          density="compact"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn color="#14414b" @click="cancel">Cancel</v-btn>
        <v-spacer />
        <v-btn color="#632097" @click="confirm" style="width: 150px">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CustomPrompt",
  props: {
    title: {
      type: String,
      default: "Prompt",
    },
    urlLabel: {
      type: String,
      default: "Enter URL",
    },
    hasLabel: {
      type: Boolean,
      default: false,
    },
    labelText: {
      type: String,
      default: "Enter Label",
    },
  },
  data() {
    return {
      isDialogOpen: false,
      url: "",
      label: "",
    };
  },
  methods: {
    open() {
      this.url = "";
      this.label = "";
      this.isDialogOpen = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    confirm() {
      this.isDialogOpen = false;
      this.resolve({ url: this.url, label: this.label });
    },
    cancel() {
      this.isDialogOpen = false;
      this.reject();
    },
  },
};
</script>
