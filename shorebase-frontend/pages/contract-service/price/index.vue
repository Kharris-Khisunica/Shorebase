<template>
  <div class="mb-4">
    <UBreadcrumb
      :items="[{ label: 'Home', to: '/dashboard' }, { label: 'Contract Service Price' }]"
    />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Contract Service Price</h1>
  </div>

  <EnterpriseTable :url="url" :columns="columns" :create="true" />
</template>

<script setup lang="ts">
import z from "zod";
import EnterpriseTable from "~/components/EnterpriseTable.vue";
import type { ETColumn } from "~/types/EnterpriseTable";

const config = useRuntimeConfig();
const url = `${config.public.BACKEND_HOST}/contract-service/price`;
const columns: ETColumn<ContractServicePrice>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
    hidden: false,
    primaryKey: true,

    type: "number",
  },
  {
    id: "contractService.code",
    header: "Contract Service",
    accessorKey: "contractService.code",
    form_name: "contractServiceId",
    edit: "enabled",
    type: "autofill",
    validationType: z.number(),
    autofill_url: `${config.public.BACKEND_HOST}/contract-service/autofill-options`,
    autofill_value_field: "id",
    autofill_label_field: "code",
    autofill_target_fields: {
      startDate: "startDate",
      endDate: "endDate",
    },
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
