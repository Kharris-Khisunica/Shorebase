<template>
  <div>
    <UBreadcrumb :items="[{ label: 'Home', to: '/wo-officer' }, { label: 'Activity' }]" />
    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Activity Summary</h1>
  </div>

  <div>
    <ActivitySummary></ActivitySummary>
  </div>
</template>

<script setup lang="ts">
import ActivitySummary from "~/components/summary/ActivitySummary.vue";
</script>
