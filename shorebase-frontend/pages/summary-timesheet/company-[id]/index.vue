<template>
  <div class="mb-4">
    <UBreadcrumb :items="breadcrumbItems" />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">
      Summary Timesheet {{ company?.name }}
    </h1>
  </div>

  <div>
    <UButton
      @click="summaryTimesheetFormOpen = true; summaryTimesheetEditMode = false; Object.keys(summaryTimesheetState).forEach((k: string) => (summaryTimesheetState as any)[k] = undefined); Object.assign(summaryTimesheetState, { companyId: parseInt(route.params.id as string) }); "
    >
      Tambah
    </UButton>
  </div>

  <div class="mt-3">
    <div>
      <UTable
        :data="summaryTimesheets"
        :columns="summaryTimesheetColumns"
        class="border border-gray-200 overflow-visible"
        :ui="{
          base: 'overflow-visible',
          td: 'border border-gray-200',
        }"
      >
        <template #contract-cell="{ row }">
          {{ row.original.code }}
        </template>

        <template #periodStartDate-cell="{ row }">
          {{ row.original.periodStartDate }}
        </template>

        <template #periodEndDate-cell="{ row }">
          {{ row.original.periodEndDate }}
        </template>

        <template #code-cell="{ row }">
          <UButton
            variant="link"
            :padded="false"
            :to="`/summary-timesheet/company-${company?.id}/${row.original.id}/detail`"
          >
            {{ row.original.code }}
          </UButton>
        </template>

        <template #action-cell="{ row }">
          <UDropdownMenu :items="getActionItems(row.original)">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-ellipsis-vertical-20-solid"
            />
          </UDropdownMenu>
        </template>
      </UTable>
    </div>
  </div>

  <div>
    <!-- Create or Edit Modal -->
    <UModal
      :title="!summaryTimesheetEditMode ? 'Tambah' : 'Edit'"
      v-model:open="summaryTimesheetFormOpen"
      fullscreen
      class="m-8"
    >
      <template #body>
        <UForm
          :schema="summaryTimesheetSchema"
          :state="summaryTimesheetState"
          class="w-full space-y-4"
          ref="summaryTimesheetFormRef"
          @submit="onSubmit"
          @error="onFormError"
        >
          <h3>
            <strong>{{ company?.name }}</strong>
          </h3>

          <UFormField
            label="Tanggal Awal"
            name="startTimesheetSummaryDate"
            class="w-full"
            required
          >
            <UInput
              v-model="summaryTimesheetState.periodStartDate"
              type="date"
              class="w-full"
              :disabled="summaryTimesheetEditMode"
            />
          </UFormField>

          <UFormField
            label="Tanggal Akhir"
            name="endTimesheetSummaryDate"
            class="w-full"
            required
          >
            <UInput
              v-model="summaryTimesheetState.periodEndDate"
              type="date"
              class="w-full"
              :disabled="summaryTimesheetEditMode"
            />
          </UFormField>

          <UFormField label="Kontrak" name="contract" class="w-full" required>
            <EnterpriseSelect
              :authorized="true"
              @update:model-value="
                summaryTimesheetState.contractId = parseInt($event?.value);
                summaryTimesheetState.contractSelectOption = $event;
              "
              :model-value="summaryTimesheetState.contractSelectOption"
              :url="`${config.public.BACKEND_HOST}/contract-service/contract/select-options`"
              :disabled="summaryTimesheetEditMode"
            ></EnterpriseSelect>
          </UFormField>

          <UFormField label="Tanggal Penerbitan" name="issueDate" class="w-full" required>
            <UInput
              v-model="summaryTimesheetState.issueDate"
              type="date"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Nomor Summary Timesheet" name="code" class="w-full" required>
            <UInput v-model="summaryTimesheetState.code" class="w-full"></UInput>
          </UFormField>
        </UForm>
      </template>

      <template #footer="{ close }">
        <div class="flex flex-1 justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            @click="summaryTimesheetFormOpen = false"
            >Batal</UButton
          >
          <UButton
            color="neutral"
            type="submit"
            loading-auto
            v-if="!summaryTimesheetEditMode"
            @click="summaryTimesheetFormRef?.submit()"
            >Buat Summary Timesheet</UButton
          >
          <UButton
            color="neutral"
            type="submit"
            loading-auto
            v-else-if="summaryTimesheetEditMode"
            @click="summaryTimesheetFormRef?.submit()"
            >Simpan</UButton
          >
        </div>
      </template>
    </UModal>
  </div>

  <div>
    <UModal v-model:open="summaryTimesheetDeleteModalOpen" class="m-8">
      <template #header>
        <h3 class="text-lg font-semibold">Delete Summary Timesheet</h3>
      </template>

      <template #body>
        <p>Apakah anda yakin ingin menghapus summary timesheet ini ?</p>
      </template>

      <template #footer>
        <UButton
          color="neutral"
          variant="outline"
          @click="summaryTimesheetDeleteModalOpen = false"
        >
          Batal
        </UButton>

        <UButton color="error" @click="onDelete">Hapus</UButton>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { FormError, FormErrorEvent, TableColumn } from "@nuxt/ui";
import { useSortable } from "@vueuse/integrations/useSortable.mjs";
import { DateTime } from "luxon";
import { routerViewLocationKey } from "vue-router";
import z from "zod";
import type { ESOption } from "~/types/EnterpriseSelect";
import type { ETColumn } from "~/types/EnterpriseTable";
import * as XLSX from "xlsx";
import { exportSTToExcel } from "~/composables/exportToExcel";
const toast = useToast();

const config = useRuntimeConfig();

const route = useRoute();

const companyFetch = await useAuthorizedFetch<Company>(
  `${config.public.BACKEND_HOST}/general/company/${route.params.id}`
);
const company = computed(() => companyFetch.data?.value);

const {
  data: summaryTimesheetData,
  refresh: refreshSummaryTimesheets,
} = await useAuthorizedFetch<SummaryTimesheet[]>(
  `${config.public.BACKEND_HOST}/summary-timesheet/company/${route.params.id}`
);

const summaryTimesheetFormRef = useTemplateRef("summaryTimesheetFormRef");
const summaryTimesheetEditMode = ref(false);
const summaryTimesheetFormOpen = ref(false);
const summaryTimesheetDeleteModalOpen = ref(false);
const summaryTimesheetToDelete = ref<SummaryTimesheet | null>(null);

// const stComponentSchema = z.object({
//   id: z.number().optional(),
//   shorebaseServiceId: z.number(),
//   uomCode: z.string(),
//   amount: z.number(),
//   remark: z.string(),
// });
// type STComponentSchema = z.output<typeof stComponentSchema>;

const summaryTimesheetSchema = z.object({
  //  timesheets: z.array(stComponentSchema),
  companyId: z.number(),
  periodStartDate: z.string(),
  periodEndDate: z.string(),
  issueDate: z.string().readonly(),
  code: z.string(),
  contractId: z.number().readonly(),
  contractSelectOption: z
    .object({ value: z.string(), label: z.string() })
    .nullable()
    .optional(),
});
type SummaryTimesheetSchema = z.output<typeof summaryTimesheetSchema>;

const summaryTimesheetState = reactive<Partial<SummaryTimesheetSchema & { id: number }>>({
  //  timesheets: [],
});

const summaryTimesheetColumns: ETColumn<SummaryTimesheet>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
    type: "number",
    primaryKey: true,
    hidden: false,
  },
  {
    id: "contract",
    accessorKey: "contract",
    header: "Kontrak",
    hidden: false,
    type: "text",
    validationType: z.string(),
  },
  {
    id: "periodStart",
    accessorKey: "periodStartDate",
    header: "Awal Periode",
    hidden: false,
    type: "date",
    validationType: z.string(),
    edit: "enabled",
  },
  {
    id: "periodEnd",
    accessorKey: "periodEndDate",
    header: "Akhir Periode",
    hidden: false,
    type: "date",
    validationType: z.string(),
    edit: "enabled",
  },
  {
    id: "code",
    accessorKey: "code",
    header: "Nomor Summary Timesheet",
    hidden: false,
    type: "text",
    validationType: z.string(),
    onClick: () => navigateTo(`${route.path}/detail`),
  },
  {
    id: "issueDate",
    accessorKey: "issueDate",
    header: "Tanggal Issue",
    hidden: false,
    type: "date",
    validationType: z.string(),
    edit: "enabled",
  },
  { id: "action", header: "Action", type: "void" },
];

const contractCustomFilter = computed(() => {
  const filter = {
    startDate: summaryTimesheetState.periodStartDate,
    endDate: summaryTimesheetState.periodEndDate,
    companyId: summaryTimesheetState.companyId!,
  };

  return JSON.stringify(filter);
});

// function handleActivitySelect(row: STComponentSchema, activityObject: Activity) {
//   row.activitySelectOption = {
//     value: activityObject.id.toString(),
//     label: activityObject.code,
//   };
//   row.serviceName = activityObject.shorebaseService?.name;
//   row.uomCode = activityObject.uom?.code;
//   row.amount = activityObject.actualAmount ?? 0;
//   row.activityObject = activityObject;
// }

function setEdit(summaryTimesheet: SummaryTimesheet) {
  summaryTimesheetState.id = summaryTimesheet.id;
  summaryTimesheetState.code = summaryTimesheet.code;
  summaryTimesheetState.periodStartDate = summaryTimesheet.periodStartDate;
  summaryTimesheetState.periodEndDate = summaryTimesheet.periodEndDate;
  summaryTimesheetState.issueDate = summaryTimesheet.issueDate;
  summaryTimesheetState.companyId = summaryTimesheet.company.id;

  summaryTimesheetState.contractId = summaryTimesheet.contract.id;
  summaryTimesheetState.contractSelectOption = {
    value: summaryTimesheet.contract.id.toString(),
    label: summaryTimesheet.contract.contractNumber,
  };
}

async function onSubmit() {
  console.log("Ini masuk submit");

  let endpoint = `${config.public.BACKEND_HOST}/summary-timesheet`;
  if (summaryTimesheetEditMode.value) {
    console.log("Ini masuk edit");
    endpoint = `${config.public.BACKEND_HOST}/summary-timesheet/${summaryTimesheetState.id}`;
  }
  const { error } = await useAuthorizedFetch(endpoint, {
    method: "post",
    body: {
      code: summaryTimesheetState.code,
      periodStartDate: summaryTimesheetState.periodStartDate,
      periodEndDate: summaryTimesheetState.periodEndDate,
      issueDate: summaryTimesheetState.issueDate,
      companyId: route.params.id,
      contractId: summaryTimesheetState.contractId,
    },
  });

  if (error.value) {
    toast.add({
      title: "Save Error",
      description: error.value.message,
      color: "error",
    });
  } else {
    summaryTimesheetFormOpen.value = false;
    await refreshSummaryTimesheets();
  }
}

async function onDelete() {
  if (!summaryTimesheetToDelete.value) {
    return;
  }

  const endpoint = `${config.public.BACKEND_HOST}/summary-timesheet/${summaryTimesheetToDelete.value.id}`;

  const { error } = await useAuthorizedFetch(endpoint, {
    method: "delete",
  });

  if (error.value) {
    toast.add({
      title: "Delete Error",
      description: error.value.message,
      color: "error",
    });
  } else {
    summaryTimesheetDeleteModalOpen.value = false;
    summaryTimesheetToDelete.value = null;
    await refreshSummaryTimesheets();
    toast.add({
      title: "Delete Berhasil",
      color: "success",
    });
  }
}

const summaryTimesheets = computed(() => summaryTimesheetData?.value || []);

const breadcrumbItems = computed(() => [
  { label: "Home", to: "/dashboard" },
  { label: "Summary Timesheet", to: `/summary-timesheet` },
  { label: company?.value?.name || "" },
]);

const getActionItems = (row: SummaryTimesheet) => {
  return [
    [
      {
        label: "Edit",
        icon: "i-heroicons-pencil-20-solid",
        onClick: () => {
          summaryTimesheetFormOpen.value = true;
          summaryTimesheetEditMode.value = true;
          setEdit(row);
        },
      },
      {
        label: "Delete",
        icon: "i-heroicons-trash-20-solid",
        onClick: () => {
          summaryTimesheetDeleteModalOpen.value = true;
          summaryTimesheetToDelete.value = row;
        },
      },
      {
        label: "Export ke Excel",
        icon: "i-heroicons-file-20-solid",
        onClick: () => {
          exportSTToExcel(row.id);
        },
      },
    ],
  ];
};

async function onFormError(event: FormErrorEvent) {
  console.error("FORM VALIDATION ERRORS:", event.errors);
  // The first error message
  const firstError = event.errors[0].message;
  toast.add({
    title: "Validation Error",
    description: firstError,
    color: "error",
  });
}
</script>
