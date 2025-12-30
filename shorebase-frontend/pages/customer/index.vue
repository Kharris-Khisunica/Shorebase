<template>
  <div class="mb-4">
    <h1 class="font-bold text-xl sm:text-3xl">Welcome to Barokah Shorebase System</h1>
  </div>
  <div>
    <div class="w-fit grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
      <UCard variant="subtle" class="max-w-64">
        <template #header>
          <h3 class="h-8">Order Activity</h3>
        </template>

        <p class="min-h-20">Pesan kegiatan.</p>

        <template #footer>
          <div class="max-h-8 w-full flex flex-row justify-end">
            <UButton color="primary" to="/customer/order">Buka</UButton>
          </div>
        </template>
      </UCard>

      <UCard variant="subtle" class="max-w-64">
        <template #header>
          <h3 class="h-8">List Planned Activity</h3>
        </template>

        <p class="min-h-20">Daftar kegiatan yang telah dipesan.</p>

        <template class="max-h-8" #footer>
          <div class="w-full flex flex-row justify-end">
            <UButton color="primary" to="/customer/activity-list">Buka</UButton>
          </div>
        </template>
      </UCard>
      <UCard variant="subtle" class="max-w-64">
        <template #header>
          <h3 class="h-8">Timesheet</h3>
        </template>

        <p class="min-h-20">Liat Timesheet harian.</p>

        <template class="max-h-8" #footer>
          <div class="w-full flex flex-row justify-end">
            <UButton color="primary" to="/customer/timesheet">Buka</UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
