<template>
  <div class="mb-4">
    <UBreadcrumb :items="[{ label: 'Home', to: '/dashboard' }, { label: 'Contract' }]" />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Kontrak</h1>
  </div>

  <EnterpriseTable :url="url" :columns="columns" :create="true" />
</template>

<script setup lang="ts">
import z, { tuple } from "zod";
import EnterpriseTable from "~/components/EnterpriseTable.vue";
import type { ETColumn } from "~/types/EnterpriseTable";

const config = useRuntimeConfig();
const url = `${config.public.BACKEND_HOST}/contract-service/contract`;
const columns: ETColumn<Contract>[] = [
  {
    id: "id",
    primaryKey: true,
    accessorKey: "id",
    header: "ID",
    type: "number",
    hidden: false,
  },
  {
    id: "company.id",
    accessorKey: "company.id",
    form_name: "companyId",
    type: "select",
    hidden: true,
    edit: "enabled",
    header: "Company",
    validationType: z.string(),
    select_option_url: `${config.public.BACKEND_HOST}/general/company/select-options`,
  },
  {
    id: "company.name",
    alias_for_id: "company.id",
    accessorKey: "company.name",
    type: "text",
    hidden: false,
    header: "Perusahaan",
    edit: "disabled",
    select_option_url: `${config.public.BACKEND_HOST}/general/company/select-options`,
  },
  {
    id: "name",
    accessorKey: "name",
    type: "text",
    hidden: false,
    header: "Nama Kontrak",
    validationType: z.string(),
    edit: "enabled",
  },
  {
    id: "contractNumber",
    accessorKey: "contractNumber",
    type: "text",
    hidden: false,
    header: "Nomor Kontrak",
    validationType: z.string(),
    edit: "enabled",
  },
  {
    id: "startDate",
    accessorKey: "startDate",
    type: "date",
    hidden: false,
    header: "Tanggal Mulai",
    validationType: z.string(),
    edit: "enabled",
  },
  {
    id: "endDate",
    accessorKey: "endDate",
    type: "date",
    hidden: false,
    header: "Tanggal Akhir",
    validationType: z.string(),
    edit: "enabled",
  },
];
</script>
