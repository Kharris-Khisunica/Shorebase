<template>
  <div class="mb-4">
    <UBreadcrumb
      :items="[
        { label: 'Home', to: '/wo-officer' },
        { label: 'Activity', to: '/wo-officer/activity/actual/list' },
        { label: 'Create Activity' },
      ]"
    />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Create Activity</h1>
  </div>
  <div>
    <ActivityActualForm @submitted="onSubmitted" @error="onError"> </ActivityActualForm>
  </div>
</template>

<script setup lang="ts">
import ActivityActualForm from "~/components/activity/ActivityActualForm.vue";
const toast = useToast();

function onSubmitted(activityActual: ActivityActual) {
  console.log(`Come from index: ${activityActual}`);
  toast.add({
    title: "Berhasil memasukkan aktivitas",
    description: `${activityActual.contractService.service.name} sebanyak ${activityActual.amount} ${activityActual.contractService.uom.name} berhasil dimasukkan`,
    color: "success",
  });
  navigateTo("/wo-officer/activity/actual/list");
}

function onError(message: string) {
  toast.add({
    title: "Gagal mengirimkan order, coba lagi",
    description: message,
    color: "warning",
  });
}
</script>
