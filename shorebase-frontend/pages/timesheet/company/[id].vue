<template>
  <div class="mb-4">
    <UBreadcrumb :items="breadcrumbItems" />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Timesheet {{ company?.name }}</h1>
  </div>

  <div>
    <UButton
      @click="timesheetFormOpen = true; timesheetEditMode = false; Object.keys(timesheetState).forEach((k: string) => (timesheetState as any)[k] = undefined); Object.assign(timesheetState, { companyId: parseInt(route.params.id as string) }); timesheetState.activities = []"
    >
      Tambah
    </UButton>
  </div>

  <div class="mt-3">
    <div>
      <UTable
        :data="timesheets"
        :columns="timesheetColumns"
        class="border border-gray-200 overflow-visible"
        :ui="{
          base: 'overflow-visible',
          td: 'border border-gray-200',
        }"
      >
        <template #activity-cell="{ row }">
          <ol class="list-decimal list-inside">
            <li
              v-for="tsActivity in row.original.timesheetActivities"
              :key="tsActivity.id"
            >
              {{ tsActivity.activity.code }} -
              {{ tsActivity.activity.shorebaseService?.name }}
            </li>
          </ol>
        </template>

        <template #totalAmount-cell="{ row }">
          {{ row.original.totalAmount }}
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
      :title="!timesheetEditMode ? 'Tambah' : 'Edit'"
      v-model:open="timesheetFormOpen"
      fullscreen
      class="m-8"
    >
      <template #body>
        <UForm
          :schema="timesheetSchema"
          :state="timesheetState"
          class="w-full space-y-4"
          ref="timesheetFormRef"
          @submit="onSubmit"
          @error="onFormError"
        >
          <h3>
            <strong>{{ company?.name }}</strong>
          </h3>

          <UFormField label="Tanggal" name="timesheetDate" class="w-full" required>
            <UInput v-model="timesheetState.issueDate" type="date" class="w-full" />
          </UFormField>

          <!-- Service masih tampilin semua -->
          <UFormField label="Service" name="shorebaseServiceId" class="w-full">
            <EnterpriseSelect
              :authorized="true"
              @update:model-value="
                timesheetState.shorebaseServiceId = parseInt($event?.value) || undefined;
                timesheetState.shorebaseServiceSelectOption = $event;
              "
              :model-value="timesheetState.shorebaseServiceSelectOption"
              :url="`${config.public.BACKEND_HOST}/contract-service/service/select-options`"
            />
          </UFormField>

          <UFormField label="Nomor Timesheet" name="code" class="w-full">
            <UInput v-model="timesheetState.code" class="w-full"></UInput>
          </UFormField>

          <UFormField label="Deskripsi" name="desc" class="w-full">
            <UInput v-model="timesheetState.description" class="w-full"></UInput>
          </UFormField>

          <UFormField label="Activity" class="w-full">
            <UTable
              :data="timesheetState.activities"
              :columns="timesheetActivityColumns"
              class="border border-gray-200 overflow-visible"
              :ui="{
                base: 'overflow-visible',
                tbody: 'my-table-tbody',
                td: 'border border-gray-200',
              }"
            >
              <template #activityId-cell="{ row }">
                <UFormField>
                  <EnterpriseAutofill
                    :authorized="true"
                    @update:model-value="
                      row.original.activityId = parseInt($event?.value)
                    "
                    @update:full-object="handleActivitySelect(row.original, $event)"
                    :model-value="row.original.activitySelectOption"
                    :url="`${config.public.BACKEND_HOST}/activity/autofill-options`"
                    :custom-filter="activityCustomFilter"
                    label-field="code"
                  />
                </UFormField>
              </template>

              <template #serviceName-cell="{ row }">
                {{ row.original.serviceName }}
              </template>

              <template #amount-cell="{ row }">
                {{ row.original.amount }}
              </template>

              <template #uomCode-cell="{ row }">
                {{ row.original.uomCode }}
              </template>

              <template #remark-cell="{ row }">
                <UFormField>
                  <UInput v-model="row.original.remark" />
                </UFormField>
              </template>

              <template #delete-cell="{ row }">
                <UButton
                  @click="timesheetState.activities?.splice(row.index, 1)"
                  color="error"
                  >Delete</UButton
                >
              </template>
            </UTable>
            <UButton
              class="mt-2"
              @click="timesheetState.activities?.push({serviceName: undefined, uomCode: undefined, amount: undefined, remark: '' } as TimesheetActivitySchema)"
              >Tambah</UButton
            >
          </UFormField>
        </UForm>
      </template>

      <template #footer="{ close }">
        <div class="flex flex-1 justify-end gap-2">
          <UButton color="neutral" variant="outline" @click="timesheetFormOpen = false"
            >Batal</UButton
          >
          <UButton
            color="neutral"
            type="submit"
            loading-auto
            @click="timesheetFormRef?.submit()"
            >Simpan</UButton
          >
        </div>
      </template>
    </UModal>
  </div>

  <div>
    <UModal v-model:open="timesheetDeleteModalOpen" class="m-8">
      <template #header>
        <h3 class="text-lg font-semibold">Delete Timesheet</h3>
      </template>

      <template #body>
        <p>Apakah anda yakin ingin menghapus timesheet ini ?</p>
      </template>

      <template #footer>
        <UButton
          color="neutral"
          variant="outline"
          @click="timesheetDeleteModalOpen = false"
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
const toast = useToast();

const config = useRuntimeConfig();

const route = useRoute();

const companyFetch = await useAuthorizedFetch<Company>(
  `${config.public.BACKEND_HOST}/general/company/${route.params.id}`
);
const company = computed(() => companyFetch.data?.value);

const { data: timesheetsData, refresh: refreshTimesheets } = await useAuthorizedFetch<
  Timesheet[]
>(`${config.public.BACKEND_HOST}/timesheet/company/${route.params.id}`);

const timesheetFormRef = useTemplateRef("timesheetFormRef");
const timesheetEditMode = ref(false);
const timesheetFormOpen = ref(false);
const timesheetDeleteModalOpen = ref(false);
const timesheetToDelete = ref<Timesheet | null>(null);

const timesheetActivitySchema = z.object({
  id: z.number().optional(),
  activityId: z.number(),
  activitySelectOption: z
    .object({ value: z.string(), label: z.string() })
    .nullable()
    .optional(),
  serviceName: z.string().optional(),
  amount: z.number().optional(),
  remark: z.string().default(""),
  uomCode: z.string().optional(),
  activityObject: z.any().optional(),
});
type TimesheetActivitySchema = z.output<typeof timesheetActivitySchema>;

const timesheetSchema = z.object({
  shorebaseServiceId: z.number(),
  shorebaseServiceSelectOption: z
    .object({ value: z.string(), label: z.string() })
    .nullable(),
  companyId: z.number(),
  activities: z.array(timesheetActivitySchema),
  issueDate: z.string(),
  code: z.string(),
  description: z.string(),
});
type TimesheetSchema = z.output<typeof timesheetSchema>;

const timesheetState = reactive<Partial<TimesheetSchema & { id: number }>>({
  activities: [],
});

const timesheetColumns: TableColumn<Timesheet>[] = [
  { id: "id", accessorKey: "id", header: "ID" },
  { id: "code", accessorKey: "code", header: "Kode" },
  { id: "activity", header: "Activity" },
  { id: "totalAmount", header: "Total Amount" },
  { id: "issueDate", accessorKey: "issueDate", header: "Tanggal issue" },
  { id: "action", header: "Action" },
];

const timesheetActivityColumns: TableColumn<TimesheetActivitySchema>[] = [
  { id: "activityId", header: "Activity" },
  { id: "serviceName", header: "Service" },
  { id: "amount", header: "Jumlah" },
  { id: "uomCode", header: "UoM" },
  { id: "remark", header: "Remark" },
  { id: "delete", header: "Delete" },
];

const activityCustomFilter = computed(() => {
  const filter = {
    actualStartedAt: timesheetState.issueDate,
    shorebaseServiceId: timesheetState.shorebaseServiceId,
    companyId: timesheetState.companyId!,
    isNotUsedForTimesheet: true,
  };

  return JSON.stringify(filter);
});

function handleActivitySelect(row: TimesheetActivitySchema, activityObject: Activity) {
  row.activitySelectOption = {
    value: activityObject.id.toString(),
    label: activityObject.code,
  };
  row.serviceName = activityObject.shorebaseService?.name;
  row.uomCode = activityObject.uom?.code;
  row.amount = activityObject.actualAmount ?? 0;
  row.activityObject = activityObject;
}

function handleServiceChange(serviceId?: number, serviceSelectOption?: ESOption) {
  timesheetState.shorebaseServiceId = serviceId;
  timesheetState.shorebaseServiceSelectOption = serviceSelectOption;
}

function setEdit(timesheet: Timesheet) {
  timesheetState.id = timesheet.id;
  timesheetState.code = timesheet.code;
  timesheetState.companyId = timesheet.company?.id;
  timesheetState.shorebaseServiceId = timesheet.shorebaseService?.id;
  timesheetState.shorebaseServiceSelectOption = timesheet.shorebaseService
    ? {
        value: timesheet.shorebaseService.id.toString(),
        label: timesheet.shorebaseService.name || "",
      }
    : undefined;

  timesheetState.issueDate = timesheet.issueDate;
  timesheetState.description = timesheet.description;

  timesheetState.activities = timesheet.timesheetActivities.map((tsActivity) => ({
    id: tsActivity.id,
    activityId: tsActivity.activity.id,
    activitySelectOption: {
      value: tsActivity.activity.id.toString(),
      label: tsActivity.activity.code,
    },
    serviceName: tsActivity.activity.shorebaseService?.name,
    amount: tsActivity.activity.actualAmount ?? 0,
    uomCode: tsActivity.activity.uom?.code,
    remark: tsActivity.remarks || "",
    activityObject: tsActivity.activity,
  }));
}

async function onSubmit() {
  console.log("Ini masuk Submit");

  console.log("Ini timesheet state");
  console.log(timesheetState);
  const { shorebaseServiceId, companyId, code } = timesheetState;
  let endpoint = `${config.public.BACKEND_HOST}/timesheet`;
  if (timesheetEditMode.value) {
    console.log("Ini lagi ngedit");
    endpoint = `${config.public.BACKEND_HOST}/timesheet/${timesheetState.id}`;
  }
  console.log(`endpoint: ${endpoint}`);
  const { error } = await useAuthorizedFetch(endpoint, {
    method: "post",
    body: {
      companyId: companyId || route.params.id,
      shorebaseServiceId,
      code,
      activities: timesheetState.activities?.map((a) => ({
        activityId: a.activityId,
        remark: a.remark,
      })),
      issueDate: timesheetState.issueDate,
      description: timesheetState.description,
    },
  });

  console.log(`error:`);
  console.log(error.value);

  if (error.value) {
    if (error.value.message.includes("Failed to fetch")) {
      toast.add({
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
        color: "warning",
      });
    } else {
      toast.add({
        title: "Save Error",
        description: error.value.message,
        color: "error",
      });
    }
  } else {
    timesheetFormOpen.value = false;
    await refreshTimesheets();
  }
}

async function onDelete() {
  console.log("Ini masuk delete");
  if (!timesheetToDelete.value) {
    return;
  }

  const endpoint = `${config.public.BACKEND_HOST}/timesheet/${timesheetToDelete.value.id}`;

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
    timesheetDeleteModalOpen.value = false;
    timesheetToDelete.value = null;
    await refreshTimesheets();
    toast.add({
      title: "Delete Berhasil",
      color: "success",
    });
  }
}

const timesheets = computed(() => timesheetsData?.value || []);

const breadcrumbItems = computed(() => [
  { label: "Home", to: "/dashboard" },
  { label: "Timesheet", to: `/timesheet` },
  { label: company?.value?.name || "" },
]);

const getActionItems = (row: Timesheet) => {
  return [
    [
      {
        label: "Edit",
        icon: "i-heroicons-pencil-20-solid",
        onClick: () => {
          timesheetFormOpen.value = true;
          timesheetEditMode.value = true;
          setEdit(row);
        },
      },
      {
        label: "Delete",
        icon: "i-heroicons-trash-20-solid",
        onClick: () => {
          timesheetDeleteModalOpen.value = true;
          timesheetToDelete.value = row;
        },
      },
      {
        label: "Export ke Excel",
        icon: "i-heroicons-document-arrow-down-20-solid",
        onClick: async () => {
          const timesheet = (
            await useAuthorizedFetch<Timesheet>(
              `${config.public.BACKEND_HOST}/timesheet/${row.id}`
            )
          ).data;
          if (timesheet.value) {
            exportTimesheetToExcel(timesheet.value);
          } else {
            toast.add({
              title: "Gagal Export",
              color: "error",
            });
          }
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
