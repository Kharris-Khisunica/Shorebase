<template>
  <div class="mb-4">
    <UBreadcrumb
      :items="[{ label: 'Home', to: '/dashboard' }, { label: 'User Position' }]"
    />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">User Position</h1>
  </div>

  <EnterpriseTable :url="url" :columns="columns" :create="true" />
</template>

<script setup lang="ts">
import z from "zod";
import EnterpriseTable from "~/components/EnterpriseTable.vue";
import type { ETColumn } from "~/types/EnterpriseTable";

const config = useRuntimeConfig();
const url = `${config.public.BACKEND_HOST}/position/user-position`;
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
    id: "user.id",
    accessorKey: "user.id",
    form_name: "userId",
    header: "User",

    hidden: true,
    edit: "enabled",
    type: "select",
    validationType: z.string(),
    select_option_url: `${config.public.BACKEND_HOST}/general/user/select-options`
  },
  {
    id: "user.name",
    alias_for_id: "user.id",
    accessorKey: "user.name",
    header: "User",

    hidden: false,
    edit: "disabled",
    type: "text",
    validationType: z.string(),
    select_option_url: `${config.public.BACKEND_HOST}/general/user/select-options`
  },
  {
    id: "jobPosition.id",
    accessorKey: "jobPosition.id",
    form_name: "jobPositionId",
    header: "Posisi",

    hidden: true,
    edit: "enabled",
    type: "select",
    validationType: z.string(),
    select_option_url: `${config.public.BACKEND_HOST}/general/job-position/select-options`,
  },
  {
    id: "jobPosition.company.id",
    accessorKey: "jobPosition.company.id",
    hidden: true,
    edit: "disabled",
    type: "select",
    select_option_url: `${config.public.BACKEND_HOST}/general/company/select-options`,
  },
  {
    id: "jobPosition.company.name",
    accessorKey: "jobPosition.company.name",
    alias_for_id: "jobPosition.company.id",
    header: "Perusahaan",

    hidden: false,
    edit: "disabled",
    type: "text",
    select_option_url: `${config.public.BACKEND_HOST}/general/company/select-options`,
  },
  {
    id: "jobPosition.jobTitle.id",
    accessorKey: "jobPosition.jobTitle.id",
    hidden: true,
    edit: "disabled",
    type: "text",
    select_option_url: `${config.public.BACKEND_HOST}/position/job-title/select-options`,
  },
  {
    id: "jobPosition.jobTitle.name",
    accessorKey: "jobPosition.jobTitle.name",
    alias_for_id: "jobPosition.jobTitle.id",
    header: "Jabatan",

    hidden: false,
    edit: "disabled",
    type: "text",
    select_option_url: `${config.public.BACKEND_HOST}/position/job-title/select-options`,
  },
];
</script>
