<template>
  <div class="mb-4">
    <UBreadcrumb :items="[{ label: 'Home', to: '/customer' }, { label: 'Activity' }]" />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">List Activity Plan</h1>
  </div>
  <div>
    <UButton color="primary" to="/customer/order" class="mb-4">Order</UButton>

    <ActivityPlannedList></ActivityPlannedList>
  </div>
</template>
<script setup lang="ts">
import ActivityPlannedList from "~/components/activity/ActivityPlannedList.vue";
import { useActivityStore } from "~/stores/activity";

const activityStore = useActivityStore();
const activityPlanneds = computed(() => activityStore.activityPlanneds);
</script>
