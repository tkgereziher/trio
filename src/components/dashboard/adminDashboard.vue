<template>
  <v-card-title> Dashboard </v-card-title>
  <v-divider></v-divider>
  <v-progress-linear
    indeterminate
    v-if="loading"
    :height="1"
  ></v-progress-linear>
  <v-card-text class="mb-n3">
    <v-row>
      <v-col cols="12" md="6" llg="4" class="pb-0">
        <v-select
          density="compact"
          variant="outlined"
          label="Filter by"
          :items="['Waiter', 'Category', 'Date']"
          v-model="filterBy"
          @update:model-value="resetFilters"
          multiple
        ></v-select>
      </v-col>
      <v-col
        cols="12"
        md="6"
        llg="4"
        class="py-0 pt-md-3"
        v-if="filterBy && filterBy.includes('Waiter')"
      >
        <v-select
          density="compact"
          variant="outlined"
          label="Select Waiter"
          :items="waiters"
          v-model="filters.waiter_id"
          item-value="id"
          :item-title="(item) => item.first_name + ' ' + item.middle_name"
          @update:model-value="fetchDashboardItems()"
          clearable
        ></v-select>
      </v-col>
      <v-col
        cols="12"
        md="6"
        llg="4"
        class="py-0 pt-md-3"
        v-if="filterBy && filterBy.includes('Category')"
      >
        <v-select
          density="compact"
          variant="outlined"
          label="Select Category"
          :items="categories"
          v-model="filters.category_id"
          item-value="id"
          item-title="name"
          @update:model-value="fetchDashboardItems()"
          clearable
        ></v-select>
      </v-col>
      <v-col
        cols="12"
        md="6"
        llg="4"
        class="py-0 pt-md-3"
        v-if="filterBy && filterBy.includes('Date')"
      >
        <v-row>
          <v-col>
            <v-text-field
              density="compact"
              variant="outlined"
              type="date"
              v-model="filters.date_from"
              label="Date from"
              @update:model-value="fetchDashboardItems()"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              density="compact"
              variant="outlined"
              type="date"
              v-model="filters.date_to"
              label="Date to"
              @update:model-value="fetchDashboardItems()"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card-text>

  <v-card-text class="mt-10">
    <v-row>
      <v-col>
        <v-card
          :title="
            (filters && filters.date_from ? 'Total' : 'Today') + ' Orders'
          "
          color="#8a278d"
          min-height="180"
          border
          flat
        >
          <v-divider></v-divider>
          <v-card-text class="text-center mt-5 text-h5">
            <v-progress-circular
              indeterminate
              color="white"
              v-if="isFetching"
            ></v-progress-circular>
            <span v-else>
              {{ dashboardItems.total_orders || 0 }}
            </span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          :title="(filters && filters.date_from ? 'Total' : 'Today') + ' Cash'"
          color="#8a278d"
          min-height="180"
          border
          flat
        >
          <v-divider></v-divider>
          <v-card-text class="text-center mt-5 text-h5">
            <v-progress-circular
              indeterminate
              color="white"
              v-if="isFetching"
            ></v-progress-circular>
            <span v-else>{{
              formattedNumber(dashboardItems.total_cash || 0)
            }}</span></v-card-text
          >
        </v-card>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script>
import useDashboardStore from "@/stores/admin/dashboard";
import useWaiterStore from "@/stores/admin/waiter";
import useCategoryStore from "@/stores/admin/category";
import { ref, computed, onMounted } from "vue";
export default {
  setup() {
    const loading = ref(false);
    const isFetching = ref(false);
    const waiterStore = useWaiterStore();
    const dashboardStore = useDashboardStore();
    const categoryStore = useCategoryStore();
    const filterBy = ref([]);
    const filters = ref({
      category_id: null,
      waiter_id: null,
      date_from: null,
      date_to: null,
    });
    const categories = computed(() => categoryStore.categories);
    const waiters = computed(() => waiterStore.waiters?.waiters);
    const dashboardItems = computed(() => dashboardStore.dashboardItems);

    const getName = (waiter) => {
      let name = waiter.first_name + " " + waiter.middle_name;
      // if (waiter.last_name) name = name + " " + waiter.last_name;
      return name;
    };

    const resetFilters = () => {
      filters.value = {
        category_id: filterBy.value.includes("Category")
          ? filters.value.category_id
          : null,
        waiter_id: filterBy.value.includes("Waiter")
          ? filters.value.waiter_id
          : null,
        date_from: filterBy.value.includes("Date")
          ? filters.value.date_from
          : null,
        date_to: filterBy.value.includes("Date") ? filters.value.date_to : null,
      };
    };
    const formattedNumber = (number) => {
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(number);
    };
    const fetchDashboardItems = async () => {
      isFetching.value = true;
      try {
        await dashboardStore.fetchDashboardItems({
          filterBy: filterBy.value,
          filters: filters.value,
        });
      } finally {
        isFetching.value = false;
      }
    };

    onMounted(async () => {
      loading.value = true;
      try {
        fetchDashboardItems();
        await waiterStore.fetchWaiters("dashboard");
        await categoryStore.fetchCategories("dashboard");
      } finally {
        loading.value = false;
      }
    });

    return {
      loading,
      isFetching,
      filterBy,
      filters,
      dashboardItems,
      waiters,
      categories,
      getName,
      formattedNumber,
      resetFilters,
      fetchDashboardItems,
    };
  },
};
</script>