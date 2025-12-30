<template>
  <div class="mb-4">
    <UBreadcrumb :items="[{ label: 'Home', to: '/dashboard' }, { label: 'Timesheet' }]" />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Summary Timesheet per Perusahaan</h1>
  </div>

  <EnterpriseTable :url="url" :columns="columns" :create="false" />
</template>

<script setup lang="ts">
import z from "zod";
import EnterpriseTable from "~/components/EnterpriseTable.vue";
import type { ETColumn } from "~/types/EnterpriseTable";

const config = useRuntimeConfig();
const url = `${config.public.BACKEND_HOST}/general/company`;
const columns: ETColumn<Company>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
    hidden: false,
    primaryKey: true,

    type: "number",
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Nama",
    hidden: false,
    edit: "disabled",

    type: "text",
    validationType: z.string(),
    onClick: (company: Company) => navigateTo(`/summary-timesheet/company-${company.id}`),
  },
  {
    id: "internal",
    accessorKey: "internal",
    header: "Internal",
    hidden: false,
    edit: "disabled",
    type: "boolean",
    validationType: z.boolean().optional(),
  },
];
</script>
