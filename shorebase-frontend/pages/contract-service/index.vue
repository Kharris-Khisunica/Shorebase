<template>
  <div class="mb-4">
    <UBreadcrumb
      :items="[{ label: 'Home', to: '/dashboard' }, { label: 'Contract Service' }]"
    />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Contract Service</h1>
  </div>

  <EnterpriseTable :url="url" :columns="columns" :create="true" />
</template>

<script setup lang="ts">
import z from "zod";
import EnterpriseTable from "~/components/EnterpriseTable.vue";
import type { ETColumn } from "~/types/EnterpriseTable";

const config = useRuntimeConfig();
const url = `${config.public.BACKEND_HOST}/contract-service`;
const columns: ETColumn<ContractService>[] = [
  {
    id: "id",
    primaryKey: true,
    accessorKey: "id",
    type: "number",
    hidden: false,
  },
  {
    id: "contract.name",
    header: "Nama Kontrak",
    accessorFn: (row) => row.contract.name || "",
    form_name: "contractId",
    edit: "enabled",
    type: "autofill",
    validationType: z.coerce.number(),
    autofill_url: `${config.public.BACKEND_HOST}/contract-service/contract/autofill-options`,
    autofill_value_field: "id",
    autofill_label_field: "name",
    autofill_target_fields: {
      companyId: { value: "company.id", label: "company.name", readOnly: true },
      startDate: "startDate",
      endDate: "endDate",
    },
  },
  {
    id: "shorebaseService.name",
    header: "Shorebase Service",
    accessorFn: (row) => row.shorebaseService?.name || "",
    form_name: "shorebaseServiceId",
    edit: "enabled",
    type: "autofill",
    validationType: z.coerce.number(),
    autofill_url: `${config.public.BACKEND_HOST}/contract-service/service/autofill-options`,
    autofill_value_field: "id", // Value Field untuk Shorebase Service nya
    autofill_label_field: "name", // Label Field untuk shorebase service
    autofill_target_fields: {
      // Form_name : Field
      uomCode: { value: "uom.code", label: "uom.name", readOnly: true },
    },
  },
  {
    id: "company.id",
    accessorKey: "company.id",
    form_name: "companyId",
    header: "Perusahaan",

    hidden: true,
    edit: "enabled",
    type: "select",
    validationType: z.number(),
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
    id: "code",
    accessorKey: "code",
    header: "Code",
    hidden: false,
    edit: "enabled",
    type: "text",
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
    accessorKey: "uom.name",
    header: "Uom",
    validationType: z.string(),
    edit: "disabled",
    hidden: false,
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/service/uom/select-options`,
  },
  {
    id: "sumCalc.code",
    type: "select",
    accessorKey: "sumCalc.code",
    form_name: "sumCalcCode",
    header: "Sum Calc",
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/service/sum-calc/select-options`,
  },
  {
    id: "sumCalc.name",
    alias_for_id: "sumCalc.code",
    type: "text",
    accessorKey: "sumCalc.name",
    header: "Sum Calc",
    validationType: z.string(),
    edit: "disabled",
    hidden: false,
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/service/sum-calc/select-options`,
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
