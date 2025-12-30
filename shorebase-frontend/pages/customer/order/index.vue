<template>
  <div class="mb-4">
    <UBreadcrumb
      :items="[
        { label: 'Home', to: '/customer' },
        { label: 'Activity', to: '/customer/activity-list' },
        { label: 'Order Activity' },
      ]"
    />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Order Activity</h1>
  </div>
  <div>
    <ActivityPlannedOrderForm @submitted="onSubmitted" @error="onError">
    </ActivityPlannedOrderForm>
  </div>
</template>

<script setup lang="ts">
const toast = useToast();

function onSubmitted(activityPlanned: ActivityPlanned) {
  toast.add({
    title: "Berhasil mengirimkan order",
    description: `${activityPlanned.contractService.service.name} sebanyak ${activityPlanned.amount} ${activityPlanned.contractService.uom.name} berhasil dipesan`,
    color: "success",
  });
  navigateTo("/customer/activity-list");
}

function onError(message: string) {
  toast.add({
    title: "Gagal mengirimkan order, coba lagi",
    description: message,
    color: "warning",
  });
}
</script>
