<template>
  <div class="mb-4">
    <UBreadcrumb
      :items="[{ label: 'Home', to: '/dashboard' }, { label: 'Sub Contractor' }]"
    />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Sub Contractor</h1>
  </div>

  <EnterpriseTable :url="url" :columns="columns" :create="true" />
</template>

<script setup lang="ts">
import z from "zod";
import EnterpriseTable from "~/components/EnterpriseTable.vue";
import type { ETColumn } from "~/types/EnterpriseTable";

const config = useRuntimeConfig();
const url = `${config.public.BACKEND_HOST}/contract-service/contract/sub-contractor`;
const columns: ETColumn<SubContractor>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
    hidden: false,
    primaryKey: true,
    type: "number",
  },
  {
    id: "contract.name",
    header: "Contract",
    accessorFn: (row) => row.contract.name,
    form_name: "contractId",
    edit: "enabled",
    type: "autofill",
    validationType: z.coerce.number(),
    autofill_url: `${config.public.BACKEND_HOST}/contract-service/contract/autofill-options`,
    autofill_value_field: "id",
    autofill_label_field: "name",
    autofill_target_fields: {
      company: { readOnly: true, label: "company.name", value: "company.name" },
      startDate: "startDate",
      endDate: "endDate",
    },
  },
  {
    id: "company",
    accessorKey: "company.name",
    hidden: true,
    edit: "enabled",
    type: "text",
    header: "Contractor",
    validationType: z.string(),
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
    header: "Sub Kontraktor",

    hidden: false,
    edit: "disabled",
    type: "text",
    validationType: z.string(),
    select_option_url: `${config.public.BACKEND_HOST}/general/company/select-options`,
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
