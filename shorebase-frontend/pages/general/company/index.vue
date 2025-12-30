<template>
  <div class="mb-4">
    <UBreadcrumb
      :items="[{ label: 'Home', to: '/dashboard' }, { label: 'Perusahaan' }]"
    />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Perusahaan</h1>
  </div>

  <EnterpriseTable
    :url="url"
    :columns="columns"
    :create="true"
    :custom-actions="[{ label: 'View', onClick: (company: Company) => {
            toast.add({
                title: company.name,
                color: 'success',
                icon: 'i-lucide-circle-check'
            })
        } }]"
  />
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import z from "zod";
import EnterpriseTable from "~/components/EnterpriseTable.vue";
import type { ETColumn } from "~/types/EnterpriseTable";

const toast = useToast();
const config = useRuntimeConfig();
const url = `${config.public.BACKEND_HOST}/general/company`;
const columns: ETColumn<Company>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
    hidden: false,
    primaryKey: true,

    type: "number",
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Nama",
    hidden: false,
    edit: "enabled",

    type: "text",
    validationType: z.string(),
  },
  {
    id: "internal",
    accessorKey: "internal",
    header: "Internal",
    hidden: false,
    edit: "enabled",
    type: "boolean",
    validationType: z.boolean().optional(),
  },
];
</script>
