<template>
  <div class="mb-4">
    <UBreadcrumb :items="[{ label: 'Home', to: '/dashboard' }, { label: 'Posisi' }]" />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Service</h1>
  </div>

  <EnterpriseTable :url="url" :columns="columns" :create="true" />
</template>

<script setup lang="ts">
import z from "zod";
import EnterpriseTable from "~/components/EnterpriseTable.vue";
import type { ETColumn } from "~/types/EnterpriseTable";

const config = useRuntimeConfig();
const url = `${config.public.BACKEND_HOST}/contract-service/service`;
const columns: ETColumn<ShorebaseService>[] = [
  {
    id: "id",
    primaryKey: true,
    accessorKey: "id",
    type: "number",
    hidden: false,
  },
  {
    type: "text",
    id: "code",
    accessorKey: "code",
    header: "Kode",
    validationType: z.string(),
    edit: "enabled",
    hidden: false,
  },
  {
    type: "text",
    id: "name",
    accessorKey: "name",
    header: "Nama",
    validationType: z.string(),
    edit: "enabled",
    hidden: false,
  },
  {
    id: "uom.code",
    type: "select",
    accessorKey: "uom.code",
    form_name: "default_uom_code",
    header: "Uom",
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/service/uom/select-options`,
  },
  {
    id: "uom.name",
    alias_for_id: "uom.code",
    type: "text",
    accessorKey: "uom.name",
    header: "Uom",
    validationType: z.string(),
    edit: "disabled",
    hidden: false,
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/service/uom/select-options`,
  },
  {
    id: "shorebaseServiceType.code",
    type: "select",
    accessorKey: "ssType.code",
    form_name: "shorebaseServiceTypeCode",
    header: "Tipe Service",
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/service/type/select-options`,
  },
  {
    id: "shorebaseServiceType.name",
    alias_for_id: "ssType.code",
    type: "text",
    accessorKey: "ssType.name",
    header: "Tipe Service",
    validationType: z.string(),
    edit: "disabled",
    hidden: false,
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/service/type/select-options`,
  },
  {
    id: "defaultPricePerUom",
    type: "number",
    accessorKey: "defaultPricePerUom",
    header: "Harga Default",
    validationType: z.number(),
    edit: "enabled",
    hidden: false,
  },
  {
    id: "active",
    type: "boolean",
    accessorKey: "active",
    header: "Aktif",
    validationType: z.boolean().optional(),
    edit: "enabled",
    hidden: false,
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
  {
    id: "desc",
    type: "text",
    accessorKey: "description",
    header: "Deskripsi",
    validationType: z.string().optional(),
    edit: "enabled",
    hidden: false,
  },
];
</script>
