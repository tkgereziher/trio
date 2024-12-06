<template>
  <v-card-title> Dashboard </v-card-title>
  <v-divider></v-divider>
  <v-img
    v-if="loading || !(waiters && waiters.length)"
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
    <v-card title="Today Orders" class="my-8" border flat>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="6"
            lg="3"
            v-for="waiter in waiters"
            :key="waiter.id"
            :title="getName(waiter)"
          >
            <v-card color="#8a278d" min-height="100" :title="getName(waiter)">
              <v-divider></v-divider>
              <v-card-text class="text-center text-h6">
                {{ waiter.today_orders || 0 }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card title="Today Cash" class="my-8" border flat>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="6"
            lg="3"
            v-for="waiter in waiters"
            :key="waiter.id"
            :title="getName(waiter)"
          >
            <v-card color="#8a278d" min-height="100" :title="getName(waiter)">
              <v-divider></v-divider>
              <v-card-text class="text-center text-h6">
                {{ formattedNumber(waiter.today_cash || 0) }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card title="Today Coins" class="my-8" border flat>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4" v-for="i in 3" :key="i">
            <v-card
              color="#8a278d"
              min-height="100"
              :title="i == 1 ? 'Pending' : i == '2' ? 'Approved' : 'Rejected'"
            >
              <v-divider></v-divider>
              <v-card-text class="text-center text-h6">
                {{
                  i == 1
                    ? coins.pending
                    : i == "2"
                    ? coins.approved
                    : coins.rejected || 0
                }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- <v-row>
      <v-col cols="12" md="6" v-for="waiter in waiters" :key="waiter.id">
        <v-card :title="getName(waiter)" flat border color="#fff">
          <v-card-text>
            <v-row>
              <v-col>
                <v-card color="#8a278d" height="100" title="Today Orders">
                  <v-divider></v-divider>
                  <v-card-text class="text-center">
                    {{ waiter.today_orders || 0 }}
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col>
                <v-card color="#8a278d" height="100" title="Today Cash">
                  <v-card-text class="text-center">
                    {{ waiter.today_cash || 0.0 }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->
  </v-card-text>
</template>

<script>
import useWaiterStore from "@/stores/admin/waiter";
import { ref, computed, onMounted } from "vue";
export default {
  setup() {
    const loading = ref(false);
    const waiterStore = useWaiterStore();
    const waiters = computed(() => waiterStore.waiters?.waiters);
    const coins = computed(() => waiterStore.waiters?.coins);
    const getName = (waiter) => {
      let name = waiter.first_name + " " + waiter.middle_name;
      // if (waiter.last_name) name = name + " " + waiter.last_name;
      return name;
    };

    const formattedNumber = (number) => {
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(number);
    };
    onMounted(async () => {
      loading.value = true;
      try {
        await waiterStore.fetchWaiters("dashboard");
      } finally {
        loading.value = false;
      }
    });
    return {
      waiters,
      coins,
      loading,
      getName,
      formattedNumber,
    };
  },
};
</script>