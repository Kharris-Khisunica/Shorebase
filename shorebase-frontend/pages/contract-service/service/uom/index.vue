<template>
  <!--Header-->
  <div class="mb-4">
    <UBreadcrumb
      :items="[{ label: 'Home', to: '/dashboard' }, { label: 'Unit of Measurement' }]"
    />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Unit of Measurement</h1>
  </div>

  <!--Table-->

  <EnterpriseTable
    :url="url"
    :columns="columns"
    :create="true"
    :custom-actions="[{label:'View', onClick: (uom: UoM) => {
    toast.add({

            title: uom.name,
            color: 'success',
            icon: 'i-lucide-circle-check'
        
    })
  }}]"
  />
</template>

<script setup lang="ts">
import z from "zod";
import EnterpriseTable from "~/components/EnterpriseTable.vue";
import type { ETColumn } from "~/types/EnterpriseTable";

const toast = useToast();
const config = useRuntimeConfig();
const url = `${config.public.BACKEND_HOST}/contract-service/service/uom`;
const columns: ETColumn<UoM>[] = [
  {
    id: "code",
    accessorKey: "code",
    header: "Code",
    hidden: false,
    primaryKey: true,
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
];
</script>
