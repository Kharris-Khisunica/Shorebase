<template>
  <div class="mb-4">
    <UBreadcrumb
      :items="[{ label: 'Home', to: '/dashboard' }, { label: 'Timesheet Type' }]"
    />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Timesheet Type</h1>
  </div>

  <EnterpriseTable :url="url" :columns="columns" :create="true" />
</template>

<script setup lang="ts">
import z from "zod";
import EnterpriseTable from "~/components/EnterpriseTable.vue";
import type { ETColumn } from "~/types/EnterpriseTable";

const config = useRuntimeConfig();
const url = `${config.public.BACKEND_HOST}/timesheet/type`;
const columns: ETColumn<TimesheetType>[] = [
  {
    id: "code",
    accessorKey: "code",
    header: "Code",
    hidden: false,
    primaryKey: true,
    type: "text",
    edit: "enabled",
    validationType: z.string(),
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Nama",
    hidden: false,
    type: "text",
    edit: "enabled",
    validationType: z.string(),
  },
];
</script>
