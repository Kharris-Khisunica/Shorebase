<template>
  <div class="mb-4">
    <UBreadcrumb
      :items="[
        { label: 'Home', to: '/dashboard' },
        { label: 'Shorebase Service Product' },
      ]"
    />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Shorebase Service Product</h1>
  </div>

  <EnterpriseTable :url="url" :columns="columns" :create="true" />
</template>

<script setup lang="ts">
import z from "zod";
import EnterpriseTable from "~/components/EnterpriseTable.vue";
import type { ETColumn } from "~/types/EnterpriseTable";

const config = useRuntimeConfig();
const url = `${config.public.BACKEND_HOST}/contract-service/service/product`;
const columns: ETColumn<ShorebaseServiceProduct>[] = [
  {
    id: "id",
    type: "number",
    primaryKey: true,
    accessorKey: "id",
    hidden: false,
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
  {
    id: "uom.code",
    type: "select",
    accessorKey: "uom.code",
    form_name: "uomCode",
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
    accessorFn: (row) => row.uom?.name || "",
    header: "Uom",
    validationType: z.string(),
    edit: "disabled",
    hidden: false,
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/service/uom/select-options`,
  },
];
</script>
