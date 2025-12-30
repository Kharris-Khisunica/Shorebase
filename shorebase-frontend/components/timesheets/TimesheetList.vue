<template>
  <div>
    <div class="flex items-center space-x-4">
      <UFormField label="Tanggal" name="date" required class="flex-grow">
        <div class="flex items-center space-x-2">
          <UInput label="Tanggal" v-model="state.enddate" type="date" class="w-fit" />
        </div>
      </UFormField>

      <UFormField label="Service" name="contractServiceId" required>
        <USelectMenu
          v-model="state.contractServiceId"
          value-key="id"
          :items="contractServiceOptions"
          class="w-full"
          placeholder="Select Service..."
        />
      </UFormField>

      <UFormField label="Company Name" name="company" required>
        <USelectMenu
          v-model="state.companyCode"
          class="w-full"
          label-key="name"
          value-key="code"
          :items="companyOption"
          placeholder="Select Company..."
        />
      </UFormField>

      <UFormField label="Status" name="status">
        <USelectMenu
          v-model="state.status"
          value-key="code"
          label-key="name"
          :items="[
            { code: null, name: 'Select Status...' },
            { code: 'A', name: 'Approved' },
            { code: 'R', name: 'Rejected' },
            { code: 'P', name: 'Pending' },
          ]"
          class="w-full"
          placeholder="Select Status..."
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
          <UFormField label="Tanggal Awal - Akhir" name="date" required class="flex-grow">
            <div class="flex items-center space-x-2">
              <UInput
                label="Tanggal Awal"
                v-model="state.startdate"
                type="date"
                class="w-fit"
              />
              <span class="input-group-add">-</span>
              <UInput
                label="Tanggal Akhir"
                v-model="state.enddate"
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

      <UButton label="Delete all" @click="timesheetStore.$reset()" class="mr-2"
        >DELETE</UButton
      >
    </div>

    <div>
      <h2 class="text-l font-semibold mb-1">Timesheet</h2>
      <UTable
        sticky
        :data="filteredTimesheet"
        :columns="timesheet_columns"
        :enable-column-filters="false"
        class="border border-gray-300 divide-y divide-gray-100 rounded-lg shadow-sm text-center w-full mb-1"
      >
      </UTable>
    </div>

    <div class="flex justify-end">
      <UButton label="Approve All" @click="approveTimesheetBatch" color="success">
      </UButton>
      <UButton
        label="Reject All"
        @click="rejectTimesheetBatch"
        color="error"
        class="ml-3 mr-2"
      >
      </UButton>
    </div>
    <div>
      <UModal
        v-model:open="isDetailModalOpen"
        title="Detail Timesheet Breakdown"
        :ui="{ footer: 'justify-end', content: 'sm:max-w-xl' }"
      >
        <template #body>
          <UTable
            sticky
            :data="thisFilteredActivityActual"
            :columns="activity_columns"
            :grouping="[filterField]"
            :grouping-options="grouping_options"
            class="border border-gray-300 divide-y divide-gray-100 rounded-lg shadow-sm text-center w-full mb-5"
          >
            <template #title-cell="{ row }">
              <div v-if="row.getIsGrouped()" class="flex items-center">
                <span
                  class="inline-block"
                  :style="{ width: `calc(${row.depth} * 1rem)` }"
                />

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
              </div>
            </template>
          </UTable>
        </template>

        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton
              label="Close"
              color="gray"
              variant="outline"
              @click="isDetailModalOpen = false"
            />
            <UButton label="Reject" color="error" @click="rejectTimesheetInModal" />
            <UButton label="Approve" @click="approveTimesheetInModal" />
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { alert, select } from "#build/ui";
import type { TableColumn } from "@nuxt/ui";
import z from "zod";
import { useTimesheetStore } from "~/stores/timesheet";
import { getGroupedRowModel } from "@tanstack/vue-table";
import type { GroupingOptions } from "@tanstack/vue-table";

import { h, resolveComponent } from "vue";

import type { Row } from "@tanstack/vue-table";
import * as XLSX from "xlsx";

// DataStore
const activityStore = useActivityStore();
const timesheetStore = useTimesheetStore();
const companyStore = useCompanyStore();
const contractServiceStore = useContractServiceStore();
const contractServices = computed(() => contractServiceStore.contractServices);
const companies = computed(() => companyStore.companies);
const timesheets = computed(() => timesheetStore.timesheets);
const activityActuals = computed(() => activityStore.activityActuals);
const timesheetApprovalStatus = computed(() => timesheetStore.approvalStatus);

//Util
const toast = useToast();
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const userCompanyCode = user.value?.positions?.[0]?.job_title_position?.company_code;

// Schema
const schema = z.object({
  companyCode: z.string(),
  contractServiceId: z.number(),
  startdate: z.string(),
  enddate: z.string(),
  status: z.string(),
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
  startdate: getTodayDate(),
  enddate: getTodayDate(),
  companyCode: undefined,
  contractServiceId: undefined,
  status: undefined,
});

// Get Filter Timesheet
const filteredTimesheet = computed(() => {
  let items = timesheets.value;

  if (state.companyCode) {
    items = items.filter((ts) => ts.company.code === state.companyCode);
  }

  if (state.contractServiceId) {
    items = items.filter((ts) => ts.contract_service.id === state.contractServiceId);
  }

  if (state.enddate) {
    const selectedDate = new Date(state.enddate).setHours(0, 0, 0, 0);
    items = items.filter((ts) => {
      const timesheetDate = new Date(ts.date).setHours(0, 0, 0, 0);
      return timesheetDate === selectedDate;
    });
  }

  if (state.status) {
    items = items.filter((ts) => ts.timesheet_status.code === state.status);
  }

  console.log(timesheets.value);
  console.log(items);

  return items;
});

// Table
const timesheet_columns: TableColumn<Timesheet>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) =>
      row.getIsGrouped() ? `${row.getValue("id")} records` : `#${row.getValue("id")}`,
    aggregationFn: "count",
  },
  {
    accessorKey: "company.name",
    header: "Company Name",
  },
  {
    accessorKey: "contract_service.service.name",
    header: "Service",
  },
  {
    accessorKey: "contract_service.uom.name",
    header: "Unit",
    aggregationFn: "unique",
  },
  {
    accessorKey: "total_amount",
    header: "Total Ammount",
  },
  {
    accessorKey: "timesheet_status.name",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.timesheet_status; // Get status from original row data

      // Map status CODE to badge color
      const colorMap: { [key: string]: "success" | "error" | "neutral" } = {
        A: "success",
        R: "error",
        P: "neutral",
      };
      const color = colorMap[status.code];

      return h(
        UBadge,
        {
          color: color,
          variant: "subtle",
        },
        () => status.name // Display the status name inside the badge
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        h(
          UDropdownMenu,
          {
            content: {
              align: "end",
            },
            items: getRowItems(row),
            "aria-label": "Actions dropdown",
          },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              color: "neutral",
              variant: "ghost",
              class: "ml-auto",
              "aria-label": "Actions dropdown",
            })
        )
      );
    },
  },
];

// Filterd Activity
const filteredActivity = computed(() => {
  return filteredTimesheet.value.flatMap((timesheet) => timesheet.actualActivities);
});

const activity_columns: TableColumn<ActivityActual>[] = [
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
const groupByOptions = ref([{ label: "Company Name", code: "company_name" }]);

const filterField = ref("company_name");

//Status Change Logic

const approveTimesheetBatch = () => {
  if (filteredTimesheet.value.length == 0) {
    return;
  }

  const approvedStatus = timesheetApprovalStatus.value.find((tas) => tas.code == "A");

  if (approvedStatus && filteredTimesheet.value) {
    const timesheetIds = filteredTimesheet.value.map((ts) => ts.id);

    timesheetStore.changeTimesheetApprovalBatch(approvedStatus, timesheetIds);
  }
  state.status = "A";
};

const rejectTimesheetBatch = () => {
  if (filteredTimesheet.value.length == 0) {
    return;
  }

  const rejectedStatus = timesheetApprovalStatus.value.find((tas) => tas.code == "R");

  if (rejectedStatus && filteredTimesheet) {
    const timesheetIds = filteredTimesheet.value.map((ts) => ts.id);

    timesheetStore.changeTimesheetApprovalBatch(rejectedStatus, timesheetIds);
  }
  state.status = "R";
};

// Action column
function getRowItems(row: Row<Timesheet>) {
  return [
    {
      type: "label",
      label: "Actions",
    },
    {
      label: "Approve Timesheet",
      onSelect() {
        const thisTimesheetId = row.original.id;
        const approvedStatus = timesheetApprovalStatus.value.find(
          (tas) => tas.code == "A"
        );

        if (approvedStatus) {
          timesheetStore.changeTimesheetApproval(approvedStatus, thisTimesheetId);
        }
        toast.add({
          title: "Timesheet approved",
          color: "success",
          icon: "i-lucide-circle-check",
        });
      },
    },
    {
      label: "Reject Timesheet",
      onSelect() {
        const thisTimesheetId = row.original.id;
        const rejectedStatus = timesheetApprovalStatus.value.find(
          (tas) => tas.code == "R"
        );

        if (rejectedStatus) {
          timesheetStore.changeTimesheetApproval(rejectedStatus, thisTimesheetId);
        }
        toast.add({
          title: "Timesheet rejected",
          color: "success",
          icon: "i-lucide-circle-check",
        });
      },
    },
    {
      type: "separator",
    },
    {
      label: "View detailed timesheet breakdown",
      onSelect() {
        thisTimesheet.value = row.original;
        isDetailModalOpen.value = true;
      },
    },
  ];
}

// Modal's logic
const isOpen = ref(false);
const isDetailModalOpen = ref(false);
const thisTimesheet = ref<Timesheet | null>(null);
const thisFilteredActivityActual = computed(() => {
  return thisTimesheet.value?.actualActivities || [];
});
const rejectTimesheetInModal = () => {
  if (!thisTimesheet.value) {
    return;
  }
  const rejectedStatus = timesheetApprovalStatus.value.find((tas) => tas.code == "R");

  if (rejectedStatus) {
    timesheetStore.changeTimesheetApproval(rejectedStatus, thisTimesheet.value.id);
  }
  toast.add({
    title: "Timesheet rejected",
    color: "success",
    icon: "i-lucide-circle-check",
  });

  isDetailModalOpen.value = false;
};
const approveTimesheetInModal = () => {
  if (!thisTimesheet.value) {
    return;
  }

  const approvedStatus = timesheetApprovalStatus.value.find((tas) => tas.code == "A");

  if (approvedStatus) {
    timesheetStore.changeTimesheetApproval(approvedStatus, thisTimesheet.value.id);
  }
  toast.add({
    title: "Timesheet approved",
    color: "success",
    icon: "i-lucide-circle-check",
  });
  isDetailModalOpen.value = false;
};

const companyOption = computed(() => [
  { name: "— Clear Selection —", code: null },
  ...companies.value,
]);
const contractServiceOptions = computed(() => [
  { label: "— Clear Selection —", id: null },
  // Map original services to include the custom label
  ...contractServices.value.map((cs: ContractService) => ({
    ...cs,
    label: `${cs.code} ${cs.service.name}`,
  })),
]);
// Export to excel
const exportToExcel = () => {
  const formatTime = (dateInput: Date) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return ""; // Handle invalid dates
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  //Selected Timesheet = Filtered from start date - end date + Company
  const startDate = state.startdate
    ? new Date(state.startdate)
    : new Date(getTodayDate());
  const endDate = state.enddate ? new Date(state.enddate) : new Date(getTodayDate());

  const selectedTimesheets = timesheets.value.filter((ts) => {
    const timesheetDate = new Date(ts.date);
    return (
      ts.company.code === state.companyCode &&
      timesheetDate >= startDate &&
      timesheetDate <= endDate
    );
  });

  const flattenedData = selectedTimesheets.flatMap((ts) => {
    const tsDate = new Date(ts.date);
    tsDate.setHours(0, 0, 0, 0); // Normalisasi tanggal timesheet

    return (ts.actualActivities || []).map((activity) => {
      const activityStartDate = new Date(activity.startedAt);
      const activityEndDate = new Date(activity.endedAt);

      const activityStartDateOnly = new Date(activity.startedAt);
      activityStartDateOnly.setHours(0, 0, 0, 0);
      const activityEndDateOnly = new Date(activity.endedAt);
      activityEndDateOnly.setHours(0, 0, 0, 0);

      const displayStartTime =
        activityStartDateOnly.getTime() < tsDate.getTime()
          ? "00:00"
          : formatTime(activityStartDate);
      const displayEndTime =
        activityEndDateOnly.getTime() > tsDate.getTime()
          ? "23:59"
          : formatTime(activityEndDate);

      return {
        "Timesheet ID": ts.id,
        Date: ts.date,
        Company: ts.company.name,
        Service_code: ts.contract_service.service.code,
        Service: ts.contract_service.service.name,
        Unit: ts.contract_service.uom.name,
        Status: ts.timesheet_status.name,
        "Activity ID": activity.id,
        "Start Time": displayStartTime,
        "End Time": displayEndTime,
        "Activity Amount": activity.amount,
        "Total Amount": ts.total_amount,
      };
    });
  });
  if (flattenedData.length === 0) {
    return;
  }

  const groupedByService = flattenedData.reduce((acc, activity) => {
    const serviceName = activity.Service;
    if (!acc[serviceName]) {
      acc[serviceName] = [];
    }
    acc[serviceName].push(activity);
    return acc;
  }, {} as Record<string, typeof flattenedData[0][]>);

  const wb = XLSX.utils.book_new();

  // Tiap sheet
  for (const serviceName in groupedByService) {
    const activitiesPerService = groupedByService[serviceName];
    const groupedByTimesheet = activitiesPerService.reduce((acc, activity) => {
      const timesheetId = activity["Timesheet ID"];
      if (!acc[timesheetId]) acc[timesheetId] = [];
      acc[timesheetId].push(activity);
      return acc;
    }, {} as Record<string, typeof activitiesPerService>);

    const dataPerSheet = [];

    for (const timesheetId in groupedByTimesheet) {
      const timesheetActivies = groupedByTimesheet[timesheetId];
      const metaInfo = timesheetActivies[0];
      const columnHeader = [
        "No",
        "Date",
        "Service",
        "Start Time",
        "End Time",
        "Unit",
        "Ammount",
      ];

      dataPerSheet.push([], [], []);
      // Header
      dataPerSheet.push(["Company Name: ", metaInfo.Company]);
      dataPerSheet.push(["Service: ", metaInfo.Service]);

      // Column
      dataPerSheet.push(columnHeader);

      // Activity
      let counter = 1;
      for (const activity of timesheetActivies) {
        dataPerSheet.push([
          counter++,
          new Date(activity.Date),
          activity.Service,
          activity["Start Time"],
          activity["End Time"],
          activity.Unit,
          activity["Activity Amount"],
        ]);
      }
      const footerRow = new Array(6).fill("");
      footerRow[5] = "Total:";
      footerRow.push(metaInfo["Total Amount"]);
      dataPerSheet.push(footerRow);

      dataPerSheet.push(["Status: ", metaInfo.Status]);

      //
    }

    const ws = XLSX.utils.aoa_to_sheet(dataPerSheet);
    const safeSheetName = serviceName.replace(/[:\\/?*[\]]/g, "").substring(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, safeSheetName);
  }

  // Tulis workbook dan unduh file
  const companyName =
    companies.value.find((c) => c.code === state.companyCode)?.name || "Export";
  XLSX.writeFile(
    wb,
    `${companyName}_Timesheet_Details_${state.startdate}_to_${state.enddate}.xlsx`
  );

  isOpen.value = false;
};
</script>
