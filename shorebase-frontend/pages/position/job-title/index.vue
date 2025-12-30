<template>
  <div class="mb-4">
    <UBreadcrumb :items="[{ label: 'Home', to: '/dashboard' }, { label: 'Jabatan' }]" />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Jabatan</h1>
  </div>

  <EnterpriseTable :url="url" :columns="columns" :create="true" />
</template>

<script setup lang="ts">
import z from "zod";
import defineCanMiddleware from "~/middleware/can";
import type { ETColumn } from "~/types/EnterpriseTable";

const config = useRuntimeConfig();

definePageMeta({
  middleware: defineCanMiddleware(["position-edit", "position-view"]),
});

const url = `${config.public.BACKEND_HOST}/position/job-title`;
const columns: ETColumn<JobTitle>[] = [
  {
    id: "id",
    primaryKey: true,
    accessorKey: "id",
    header: "ID",
    hidden: false,

    type: "number",
  },
  {
    id: "code",
    accessorKey: "code",
    form_name: "code",
    header: "Kode Jabatan",
    hidden: false,

    edit: "enabled",
    type: "text",
    validationType: z.string(),
  },
  {
    id: "name",
    accessorKey: "name",
    form_name: "name",
    header: "Jabatan",
    hidden: false,

    edit: "enabled",
    type: "text",
    validationType: z.string(),
  },
];
</script>
