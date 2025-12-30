<template>
  <div class="mb-4">
    <UBreadcrumb :items="[{ label: 'Home', to: '/dashboard' }, { label: 'Equipment' }]" />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Equipment</h1>
  </div>

  <EnterpriseTable :url="url" :columns="columns" :create="true" />
</template>

<script setup lang="ts">
import z from "zod";
import EnterpriseTable from "~/components/EnterpriseTable.vue";
import type { ETColumn } from "~/types/EnterpriseTable";

const config = useRuntimeConfig();
const url = `${config.public.BACKEND_HOST}/activity/equipment`;
const columns: ETColumn<Equipment>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
    hidden: false,
    primaryKey: true,
    type: "number",
  },
  {
    id: "code",
    accessorKey: "code",
    header: "Code",
    hidden: false,
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
