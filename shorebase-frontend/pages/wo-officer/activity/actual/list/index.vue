<template>
  <div class="mb-4">
    <UBreadcrumb :items="[{ label: 'Home', to: '/wo-officer' }, { label: 'Activity' }]" />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">List Actual Activity</h1>
  </div>
  <div>
    <UButton color="primary" to="/wo-officer/activity/actual/input" class="mb-4"
      >Order</UButton
    >

    <ActivityActualList></ActivityActualList>
  </div>
</template>
<script setup lang="ts">
import ActivityActualList from "~/components/activity/ActivityActualList.vue";
import { useActivityStore } from "~/stores/activity";

const activityStore = useActivityStore();
const activityActuals = computed(() => activityStore.activityActuals);
</script>
