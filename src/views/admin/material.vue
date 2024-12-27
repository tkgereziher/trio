<template>
  <v-card min-height="80vh">
    <v-card-title>
      Materials
      <CreateNew @click="openCreateDialog" />
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="materials"
        class="elevation-1"
        item-key="id"
        :loading="loading"
        hide-default-footer
        :items-per-page="materials.length"
      >
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>
        <template #item.unit="{ item }">
          <span class="text-capitalize">{{ item.unit }}</span>
        </template>
        <template #item.actions="{ item }">
          <v-icon color="info" @click="openUpdateDialog(item)" class="mr-2"
            >mdi-pencil</v-icon
          >
          <v-icon color="red" @click="deleteMaterial(item.id)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
    </v-card-text>
    <v-dialog v-model="dialog" width="600px">
      <v-form
        ref="form"
        v-model="valid"
        @submit.prevent="isEditing ? updateMaterial() : addMaterial()"
      >
        <v-card>
          <v-card-title>
            <Close @click="closeDialog" />
            <span v-if="isEditing">Edit</span>
            <span v-else>Add</span>
            Material
            <v-btn
              @click="isEditing ? updateMaterial() : addMaterial()"
              :color="isEditing ? '#14414b' : '#632097'"
              width="160"
              class="float-right text-none"
              prepend-icon="mdi-check-all"
              :disabled="!valid || isSubmitting"
              :loading="isSubmitting"
              type="submit"
              >{{ isEditing ? "Save Changes" : "Save" }}</v-btn
            >
          </v-card-title>
          <v-divider class="mb-3"></v-divider>
          <v-card-text>
            <v-text-field
              v-model="material.name"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Name"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              v-model="material.unit"
              :items="origins"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Select Origin"
              :rules="[rules.required]"
            ></v-text-field>
            <v-textarea
              v-model="material.description"
              variant="outlined"
              density="compact"
              color="#632097"
              label="Description"
              rows="2"
            ></v-textarea>
          </v-card-text>
        </v-card>
      </v-form>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import useMaterialStore from "@/stores/admin/material";

export default {
  setup() {
    const materialStore = useMaterialStore();
    const materials = computed(() => materialStore.materials);
    const dialog = ref(false);
    const loading = ref(false);
    const material = ref({ name: null, unit: "Number", description: null });
    const valid = ref(false);
    const isEditing = ref(false);
    const isSubmitting = ref(false);
    const rules = {
      required: (value) => !!value || "Required.",
      minLength: (value) =>
        (value && value.length >= 3) || "Minimum 3 characters.",
    };

    const origins = [
      { text: "Kitchen", value: "kitchen" },
      { text: "Bartender", value: "bartender" },
    ];

    onMounted(async () => {
      loading.value = true;
      try {
        await materialStore.fetchMaterials();
      } finally {
        loading.value = false;
      }
    });

    const openCreateDialog = () => {
      material.value = { name: null, unit: "Number", description: null };
      isEditing.value = false;
      dialog.value = true;
    };

    const openUpdateDialog = (item) => {
      material.value = { ...item };
      isEditing.value = true;
      dialog.value = true;
    };

    const closeDialog = () => {
      dialog.value = false;
      valid.value = false;
    };

    const addMaterial = async () => {
      isSubmitting.value = true;
      try {
        await materialStore.addMaterial(material.value);
        closeDialog();
      } catch (error) {
        console.error("Add material failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const updateMaterial = async () => {
      isSubmitting.value = true;
      try {
        await materialStore.updateMaterial(material.value);
        closeDialog();
      } catch (error) {
        console.error("Update material failed:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const deleteMaterial = async (id) => {
      const confirmed = confirm(
        "Are you sure you want to delete this material?"
      );
      if (confirmed) {
        try {
          await materialStore.trashMaterial(id);
        } catch (error) {
          console.error("Delete material failed:", error);
        }
      }
    };

    const headers = [
      { title: "#", key: "index" },
      { title: "Name", key: "name" },
      { title: "Unit", key: "unit" },
      { title: "Actions", key: "actions", sortable: false },
    ];

    return {
      materials,
      dialog,
      loading,
      material,
      valid,
      isEditing,
      isSubmitting,
      rules,
      origins,
      openCreateDialog,
      openUpdateDialog,
      closeDialog,
      addMaterial,
      updateMaterial,
      deleteMaterial,
      headers,
    };
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
