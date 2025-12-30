<template>
  <div class="flex items-center space-x-4">
    <UFormField label="Tanggal Awal - Akhir" name="startedAt" required class="flex-grow">
      <div class="flex items-center space-x-2">
        <UInput
          label="Tanggal Awal"
          v-model="state.startedAt"
          type="date"
          class="w-fit"
        />
        <span class="input-group-add">-</span>
        <UInput label="Tanggal Akhir" v-model="state.endedAt" type="date" class="w-fit" />
      </div>
    </UFormField>

    <UFormField label="Group By" name="groupBy">
      <USelectMenu
        v-model="filterField"
        label-key="label"
        value-key="code"
        :items="groupByOptions"
        class="w-full"
        placeholder="Group By Options..."
      />
    </UFormField>

    <UModal
      v-model:open="isOpen"
      title="Export Timesheet to Excel"
      description="Please choose company name and start and end date."
      :ui="{ footer: 'justify-end' }"
    >
      <UButton label="Export to Excel" class="ml-4" />

      <template #body>
        <UFormField label="Company Name" name="company" required>
          <USelectMenu
            v-model="state.companyCode"
            class="w-full"
            label-key="name"
            value-key="code"
            :items="companies"
          />
        </UFormField>
        <UFormField
          label="Tanggal Awal - Akhir"
          name="startedAt"
          required
          class="flex-grow"
        >
          <div class="flex items-center space-x-2">
            <UInput
              label="Tanggal Awal"
              v-model="state.startedAt"
              type="date"
              class="w-fit"
            />
            <span class="input-group-add">-</span>
            <UInput
              label="Tanggal Akhir"
              v-model="state.endedAt"
              type="date"
              class="w-fit"
            />
          </div>
        </UFormField>
      </template>

      <template #footer="{ close }">
        <UButton label="Cancel" color="error" variant="outline" @click="close" />
        <UButton label="Export" @click="exportToExcel" />
      </template>
    </UModal>
  </div>
  <div>
    <UTable
      :data="filterDateFromActivityActuals"
      :columns="columns"
      sticky
      :grouping="[filterField]"
      :grouping-options="grouping_options"
      class="border border-gray-300 divide-y divide-gray-100 rounded-lg shadow-sm text-center w-full"
    >
      <template #title-cell="{ row }">
        <div v-if="row.getIsGrouped()" class="flex items-center">
          <span class="inline-block" :style="{ width: `calc(${row.depth} * 1rem)` }" />

          <UButton
            variant="outline"
            color="neutral"
            class="mr-2"
            size="xs"
            :icon="row.getIsExpanded() ? 'i-lucide-minus' : 'i-lucide-plus'"
            @click="row.toggleExpanded()"
          />
          <strong v-if="row.groupingColumnId === 'company_name'">
            {{ row.getValue("company_name") }}
          </strong>
          <strong v-else-if="row.groupingColumnId === 'service_name'">
            {{ row.getValue("service_name") }}
          </strong>
        </div>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import z from "zod";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getGroupedRowModel } from "@tanstack/vue-table";
import type { GroupingOptions } from "@tanstack/vue-table";
import { DateTime } from "luxon";

const activityStore = useActivityStore();
const ActivityActuals = computed(() => activityStore.activityActuals);

const schema = z.object({
  companyCode: z.string(),
  contractServiceId: z.number(),
  amount: z.number(),
  startedAt: z.string(),
  endedAt: z.string(),
});
type Schema = z.output<typeof schema>;

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const state = reactive<Partial<Schema>>({
  startedAt: getTodayDate(),
  endedAt: getTodayDate(),
  companyCode: undefined,
});

//Filter Logic - Time
const filterDateFromActivityActuals = computed(() => {
  if (!ActivityActuals.value) {
    return [];
  }

  const filterStartDate = state.startedAt
    ? new Date(state.startedAt)
    : new Date(getTodayDate());
  const filterEndDate = state.endedAt
    ? new Date(`${state.endedAt}`)
    : new Date(getTodayDate());

  return ActivityActuals.value.filter((activity: ActivityActual) => {
    const activityStartDate = new Date(activity.startedAt);
    const activityEndDate = activity.endedAt
      ? new Date(activity.endedAt)
      : new Date(getTodayDate());

    let includeActivity = true;

    if (filterStartDate && filterEndDate) {
      includeActivity =
        activityStartDate <= filterEndDate && activityEndDate >= filterStartDate;
    } else if (filterStartDate && !filterEndDate) {
      includeActivity = activityEndDate >= filterStartDate;
    } else if (!filterStartDate && filterEndDate) {
      includeActivity = activityStartDate <= filterEndDate;
    }

    return includeActivity;
  });
});

// Filter Logic - Company (From filtered Activity)
const filterCompanyFromFilteredActivity = computed(() => {
  return filterDateFromActivityActuals.value.filter((aa: ActivityActual) => {
    return aa.company.code === state.companyCode;
  });
});
// Watchers to ensure startedAt is not after endedAt, and vice-versa
watch(
  () => state.startedAt,
  (newStartedAt) => {
    if (newStartedAt && state.endedAt) {
      const start = new Date(newStartedAt);
      const end = new Date(state.endedAt);
      if (start > end) {
        state.endedAt = newStartedAt; // Adjust end date to be same as new start date if it's earlier
      }
    }
  }
);

watch(
  () => state.endedAt,
  (newEndedAt) => {
    if (newEndedAt && state.startedAt) {
      const start = new Date(state.startedAt);
      const end = new Date(newEndedAt);
      if (end < start) {
        state.startedAt = newEndedAt; // Adjust start date to be same as new end date if it's later
      }
    }
  }
);

// Table Logic
const columns: TableColumn<ActivityActual>[] = [
  {
    id: "title",
    header: "Item",
  },
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) =>
      row.getIsGrouped() ? `${row.getValue("id")} records` : `#${row.getValue("id")}`,
    aggregationFn: "count",
  },
  {
    id: "service_name",
    accessorKey: "contractService.service.name",
    header: "Service",
    aggregationFn: "unique",
  },
  {
    id: "company_name",
    accessorKey: "company.name",
    header: "Company Name",
    aggregationFn: "unique",
  },
  {
    accessorKey: "contractService.uom.name",
    header: "Unit",
    aggregationFn: "unique",
  },
  {
    accessorKey: "amount",
    header: () => h("div", { class: "text-right" }, "Amount"),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"));

      return h("div", { class: "text-right font-medium" }, amount);
    },
    aggregationFn: "sum",
  },
];

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: "remove",
  getGroupedRowModel: getGroupedRowModel(),
});

// Groupby SelectMenu
const groupByOptions = ref([
  { label: "Company Name", code: "company_name" },
  { label: "Service Name", code: "service_name" },
]);

const filterField = ref("");

// Export to Excel
const exportToExcel = () => {
  // Prepare data for export

  const dataForExport = filterCompanyFromFilteredActivity.value.map(
    (activity: ActivityActual) => {
      return {
        ID: activity.id,
        Company: activity.company?.name || "",
        Mulai: DateTime.fromJSDate(new Date(activity.startedAt))
          .setLocale("id")
          .toFormat("dd LLLL yyyy HH:mm"),
        Selesai: activity.endedAt
          ? DateTime.fromJSDate(new Date(activity.endedAt))
              .setLocale("id")
              .toFormat("dd LLLL yyyy HH:mm")
          : "",
        Service: activity.contractService?.service?.name || "",
        Jumlah: activity.amount,
        Satuan: activity.contractService?.uom?.name || "",
      };
    }
  );
  // Create a blank worksheet
  const ws = XLSX.utils.json_to_sheet([]); // Start with an empty sheet

  XLSX.utils.sheet_add_aoa(
    ws,
    [
      [
        `Company: ${
          filterCompanyFromFilteredActivity
            ? filterCompanyFromFilteredActivity.value[0].company.name
            : ""
        }`,
      ],
    ],
    {
      origin: "A3",
    }
  );
  XLSX.utils.sheet_add_aoa(ws, [[`Period: ${state.startedAt} - ${state.endedAt}`]], {
    origin: "A4",
  });

  XLSX.utils.sheet_add_json(ws, dataForExport, { origin: "A5" });

  // Create a workbook and add the worksheet
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Activity Summary");

  // Write the workbook and save the file
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([wbout], { type: "application/octet-stream" }),
    "activity_summary.xlsx"
  );
};

// Modal Logic
const isOpen = ref(false);

//
const companyStore = useCompanyStore();
const companies = computed(() => companyStore.companies);
</script>
