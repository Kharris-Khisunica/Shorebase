<template>
  <div class="mb-4">
    <UBreadcrumb
      :items="[{ label: 'Home', to: '/dashboard' }, { label: 'Shorebase Service Price' }]"
    />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Shorebase Service Price</h1>
  </div>

  <EnterpriseTable :url="url" :columns="columns" :create="true" />
</template>

<script setup lang="ts">
import z from "zod";
import EnterpriseTable from "~/components/EnterpriseTable.vue";
import type { ETColumn } from "~/types/EnterpriseTable";

const config = useRuntimeConfig();
const url = `${config.public.BACKEND_HOST}/contract-service/service/price`;
const columns: ETColumn<ShorebaseServicePrice>[] = [
  {
    id: "id",
    type: "number",
    primaryKey: true,
    accessorKey: "id",
    hidden: false,
  },
  {
    id: "shorebaseService.id",
    type: "select",
    accessorKey: "shorebaseService.id",
    form_name: "shorebaseServiceId",
    header: "Service",
    edit: "enabled",
    hidden: true,
    validationType: z.string(),
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/service/select-options`,
  },
  {
    id: "shorebaseService.name",
    type: "text",
    accessorKey: "shorebaseService.name",
    alias_for_id: "shorebaseService.id",
    header: "Service",
    validationType: z.string(),
    edit: "disabled",
    hidden: false,
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/service/select-options`,
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
    id: "pricePerUom",
    type: "number",
    accessorKey: "pricePerUom",
    header: "Harga",
    edit: "enabled",
    hidden: false,
    validationType: z.number(),
  },
  {
    id: "startDate",
    type: "date",
    accessorKey: "startDate",
    header: "Waktu awal berlaku",
    validationType: z.string().optional(),
    edit: "enabled",
    hidden: false,
  },
  {
    id: "endDate",
    type: "date",
    accessorKey: "endDate",
    header: "Waktu akhir berlaku",
    validationType: z.string().optional(),
    edit: "enabled",
    hidden: false,
  },
];
</script>
