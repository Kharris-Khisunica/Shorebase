<template>
  <!--Header-->
  <div class="mb-4">
    <UBreadcrumb
      :items="[{ label: 'Home', to: '/dashboard' }, { label: 'Shorebase Service Type' }]"
    />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Shorebase Service Type</h1>
  </div>

  <!--Table-->

  <EnterpriseTable
    :url="url"
    :columns="columns"
    :create="true"
    :custom-actions="[{label:'View', onClick: (shorebaseServiceType: ShorebaseServiceType) => {
    toast.add({

            title: shorebaseServiceType.name,
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
const url = `${config.public.BACKEND_HOST}/contract-service/service/type`;
const columns: ETColumn<ShorebaseServiceType>[] = [
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
