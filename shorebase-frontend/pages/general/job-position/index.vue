<template>
  <div class="mb-4">
    <UBreadcrumb :items="[{ label: 'Home', to: '/dashboard' }, { label: 'Posisi' }]" />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Posisi</h1>
  </div>

  <EnterpriseTable :url="url" :columns="columns" :create="true" />
</template>

<script setup lang="ts">
import z from "zod";
import EnterpriseTable from "~/components/EnterpriseTable.vue";
import type { ETColumn } from "~/types/EnterpriseTable";

const config = useRuntimeConfig();
const url = `${config.public.BACKEND_HOST}/general/job-position`;
const columns: ETColumn<JobPosition>[] = [
  {
    id: "id",
    primaryKey: true,
    accessorKey: "id",
    header: "ID",

    hidden: false,
    type: "number",
  },
  {
    id: "company.id",
    accessorKey: "company.id",
    form_name: "companyId",
    header: "Perusahaan",

    hidden: true,
    edit: "enabled",
    type: "select",
    validationType: z.string(),
    select_option_url: `${config.public.BACKEND_HOST}/general/company/select-options`,
  },
  {
    id: "company.name",
    alias_for_id: "company.id",
    accessorKey: "company.name",
    header: "Perusahaan",

    hidden: false,
    edit: "disabled",
    type: "text",
    validationType: z.string(),
    select_option_url: `${config.public.BACKEND_HOST}/general/company/select-options`,
  },
  {
    id: "jobTitle.id",
    accessorKey: "jobTitle.id",
    form_name: "jobTitleId",
    header: "Jabatan",

    hidden: true,
    edit: "enabled",
    type: "select",
    validationType: z.string(),
    select_option_url: `${config.public.BACKEND_HOST}/position/job-title/select-options`,
  },
  {
    id: "jobTitle.name",
    alias_for_id: "jobTitle.id",
    accessorKey: "jobTitle.name",
    header: "Jabatan",

    hidden: false,
    edit: "disabled",
    type: "text",
    validationType: z.string(),
    select_option_url: `${config.public.BACKEND_HOST}/position/job-title/select-options`,
  },
];
</script>
