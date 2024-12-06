<template>
  <v-card-title> Dashboard </v-card-title>
  <v-divider></v-divider>
  <v-img
    v-if="loading || !barbers.length"
    height="60vh"
    class="text-center align-center"
  >
    <v-progress-circular
      indeterminate
      color="#8a278d"
      v-if="loading"
    ></v-progress-circular>
    <span v-else>No record found.</span>
  </v-img>
  <v-card-text v-else>
    <v-row>
      <v-col cols="12" md="5" v-for="barber in barbers" :key="barber.id">
        <v-card color="#8a278d" height="190">
          <v-card-text class="text-h6">{{ getName(barber) }}</v-card-text>
          <v-divider></v-divider>
          <v-card-text>
            <v-list-item title="Today services">
              <template v-slot:append
                >{{ barber.today_services || 0 }}
              </template>
            </v-list-item>
            <v-list-item title="Today cash">
              <template v-slot:append>{{ barber.today_cash || 0.0 }} </template>
            </v-list-item>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
import useBarberStore from "@/stores/admin/barber";
import { ref, computed, onMounted } from "vue";
export default {
  setup() {
    const loading = ref(false);
    const barberStore = useBarberStore();
    const barbers = computed(() => barberStore.barbers);
    const getName = (barber) => {
      let name = barber.first_name + " " + barber.middle_name;
      if (barber.last_name) name = name + " " + barber.last_name;
      return name;
    };
    onMounted(async () => {
      loading.value = true;
      try {
        await barberStore.fetchBarbers("dashboard");
      } finally {
        loading.value = false;
      }
    });
    return {
      barbers,
      loading,
      getName,
    };
  },
};
</script>