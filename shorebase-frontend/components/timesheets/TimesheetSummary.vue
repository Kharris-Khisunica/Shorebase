<template>
  <div>
    <h1>Timesheet Summary</h1>
    <div class="flex items-center space-x-4 justify">
      <UFormField label="Month" required>
        <UInput v-model="state.monthYear" type="month"></UInput>
      </UFormField>

      <UFormField label="Company" required>
        <USelectMenu
          placeholder="Select Company..."
          v-model="state.companyCode"
          :items="companies"
          value-key="code"
          label-key="name"
        ></USelectMenu>
      </UFormField>

      <UBadge
        v-if="activeSummary"
        :label="activeSummary.summaryStatus.name"
        :color="({ P: 'neutral', A: 'success', R: 'error' } as const)[activeSummary.summaryStatus.code]"
        variant="subtle"
        class="mr-2 ml-2"
      />
      <UButton label="Export to Excel" class="mr-2" @click="exportToExcel"> </UButton>
    </div>

    <div>
      <UTable
        :key="state.monthYear"
        :data="summaryTableData"
        :columns="summary_columns"
        class="border border-gray-300 divide-y divide-gray-100 rounded-lg shadow-sm text-center w-full mb-1"
        :ui="{ td: 'px-0.5 py-2' }"
      >
      </UTable>
    </div>

    <div>
      <UModal
        v-model:open="isRemarkModalOpen"
        title="Add Remarks"
        description="Add Remarks for your timesheet summary"
        :ui="{ footer: 'justify-end', content: 'sm:max-w-xl' }"
      >
        <template #body>
          <UTextarea
            v-model="remarkText"
            autoresize
            placeholder="Add Remarks..."
            class="w-full"
          ></UTextarea>
        </template>

        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton
              label="Close"
              color="neutral"
              variant="outline"
              @click="isRemarkModalOpen = false"
            />
            <UButton label="Save" color="success" @click="saveRemark"></UButton>
          </div>
        </template>
      </UModal>
    </div>

    <div>
      <UButton
        label="Approve"
        v-if="isTimesheetReady"
        color="success"
        @click="approveTimesheetSummary"
      >
      </UButton>
      <UButton
        label="Reject"
        v-if="isTimesheetReady"
        color="error"
        @click="rejectTimesheetSummary"
      >
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UBadge, UButton, UFormField, USelectMenu, UTable } from "#components";
import z from "zod";
import { DateTime } from "luxon";
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import { getGroupedRowModel } from "@tanstack/vue-table";
import * as XLSX from "xlsx";

//Datastore
const timesheetStore = useTimesheetStore();
const companyStore = useCompanyStore();
const contractServiceStore = useContractServiceStore();

const timesheets = computed(() => timesheetStore.timesheets);
const timesheetSummarys = computed(() => timesheetStore.timesheetSummarys);
const timesheetApprovalStatus = computed(() => timesheetStore.approvalStatus);
const companies = computed(() => companyStore.companies);
const contractServices = computed(() => contractServiceStore.contractServices);

//Util
const toast = useToast();
const UDropdownMenu = resolveComponent("UDropdownMenu");

// Schema
const schema = z.object({
  companyCode: z.string(),
  contractServiceId: z.number(),
  monthYear: z.string(),
  status: z.string(),
});
type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  monthYear: DateTime.now().toFormat("yyyy-MM"),
  companyCode: undefined,
  contractServiceId: undefined,
  status: undefined,
});
console.log("A");

const isTimesheetReady = ref(false);

const month_year = computed(() =>
  state.monthYear ? DateTime.fromFormat(state.monthYear, "yyyy-MM") : DateTime.now()
);
const month = computed(() => month_year.value.month);
const year = computed(() => month_year.value.year);

// Filter Logic

const filteredTimesheet = computed(() => {
  if (!state.monthYear || !state.companyCode) {
    return [];
  }

  const filtered = timesheets.value.filter((ts) => {
    const timesheetDate = new Date(ts.date);

    return (
      timesheetDate.getMonth() + 1 === month.value &&
      timesheetDate.getFullYear() === year.value &&
      ts.company.code === state.companyCode
    );
  });

  return filtered ? filtered : [];
});

const activeSummary = computed(() => {
  if (!state.monthYear || !state.companyCode) {
    return undefined;
  }
  return timesheetSummarys.value.find(
    (tss) =>
      tss.company.code === state.companyCode &&
      tss.year === year.value &&
      tss.month === month.value
  );
});

watch(
  () => [state.companyCode, state.monthYear, filteredTimesheet.value],
  () => {
    if (activeSummary.value || filteredTimesheet.value.length === 0) {
      isTimesheetReady.value = !!activeSummary.value;
      return;
    }

    const company = companies.value.find((c) => c.code === state.companyCode);
    const pendingStatus = timesheetStore.approvalStatus.find((s) => s.code === "P");
    if (!company || !pendingStatus) return;

    const amount = filteredTimesheet.value.reduce(
      (acc, ts) => (acc += ts.total_amount),
      0
    );

    timesheetStore.addTimesheetSummary({
      timesheet: filteredTimesheet.value,
      company: company,
      contractServices: contractServices.value,
      month: month.value,
      year: year.value,
      remarksByService: {},
      monthly_amount: amount,
      summaryStatus: pendingStatus,
    });
  },
  { immediate: true, deep: true }
);

const summaryTableData = computed(() => {
  const summary = activeSummary.value;

  if (!summary) {
    return [];
  }

  // Create an array where each item represents a service row
  return summary.contractServices.map((service) => ({
    service: service,
    timesheets: filteredTimesheet.value,
    remark: summary.remarksByService[service.id] || "",
  }));
});

interface SummaryTableRow {
  service: ContractService;
  timesheets: Timesheet[];
  remark: string;
}

const summary_columns = computed(() => {
  const preDateColumn: TableColumn<SummaryTableRow>[] = [
    {
      accessorKey: "service.service.name",
      header: "Service",
    },
    {
      id: "total",
      header: "Total",
      cell: ({ row }) => {
        return row.original.timesheets
          .filter((ts) => ts.contract_service.id === row.original.service.id)
          .reduce((acc, ts) => acc + ts.total_amount, 0);
      },
    },
    {
      accessorKey: "service.uom.name",
      header: "Unit",
    },
  ];

  const dateColumn: TableColumn<SummaryTableRow>[] = [];

  const dayInMonth = month_year.value.daysInMonth!;
  for (let i = 1; i <= dayInMonth; i++) {
    dateColumn.push({
      id: `day-${i}`,
      header: () => h("div", { class: "px-0.5 py-1" }, `${i}`),

      cell: ({ row }) => {
        const timesheetForDay = row.original.timesheets.find((ts) => {
          const tsDate = new Date(ts.date);
          return (
            tsDate.getDate() === i && ts.contract_service.id === row.original.service.id
          );
        });
        const amount = timesheetForDay ? timesheetForDay.total_amount : 0;
        return h("div", { class: "px-0.5 py-1" }, amount);
      },
    });
  }

  const postDateColumn: TableColumn<SummaryTableRow>[] = [
    {
      accessorKey: "remark",
      header: "Remarks",
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

  return [...preDateColumn, ...dateColumn, ...postDateColumn];
});

function getRowItems(row: Row<SummaryTableRow>) {
  return [
    {
      type: "label",
      label: "Actions",
    },
    {
      label: "Add Remarks",
      onSelect() {
        const serviceId = row.original.service.id;
        editingServiceId.value = serviceId;
        remarkText.value = activeSummary.value?.remarksByService[serviceId] || "";
        isRemarkModalOpen.value = true;
      },
    },
  ];
}

//Modal
const isRemarkModalOpen = ref(false);
const thisTimesheetSummary = ref<SummaryTableRow | null>(null);
const remarkText = ref("");
const editingServiceId = ref<number | null>(null);

// Approval Logic

const approveTimesheetSummary = () => {
  const approvedStatus = timesheetApprovalStatus.value.find((tas) => tas.code == "A");

  if (approvedStatus && activeSummary.value) {
    timesheetStore.changeTimesheetSummaryApproval(approvedStatus, activeSummary.value.id);
    toast.add({
      title: "Timesheet Approved",
      color: "success",
      icon: "i-lucide-circle-check",
    });
  }
};

const rejectTimesheetSummary = () => {
  const rejectedStatus = timesheetApprovalStatus.value.find((tas) => tas.code == "R");

  if (rejectedStatus && activeSummary.value) {
    timesheetStore.changeTimesheetSummaryApproval(rejectedStatus, activeSummary.value.id);
    toast.add({
      title: "Timesheet Rejected",
      color: "error",
      icon: "i-lucide-circle-x",
    });
  }
};

const exportToExcel = () => {
  const summary = activeSummary.value;
  if (!summary) {
    toast.add({ title: "No summary data to export.", color: "error" });
    return;
  }

  const dataForSheet: (string | number)[][] = [];

  dataForSheet.push(["Company:", summary.company.name]);
  dataForSheet.push(["Month:", month_year.value.toFormat("LLLL yyyy")]);
  dataForSheet.push([]);

  // Header
  const tableHeader = ["Service", "Total", "Unit"];
  const daysInMonth = month_year.value.daysInMonth!;
  for (let i = 1; i <= daysInMonth; i++) {
    tableHeader.push(String(i));
  }
  tableHeader.push("Remarks");
  dataForSheet.push(tableHeader);

  // Table Data
  summaryTableData.value.forEach((tableRow) => {
    const rowData: (string | number)[] = [];
    rowData.push(tableRow.service.service.name);
    const totalForService = tableRow.timesheets
      .filter((ts) => ts.contract_service.id === tableRow.service.id)
      .reduce((acc, ts) => acc + ts.total_amount, 0);
    rowData.push(totalForService);
    rowData.push(tableRow.service.uom.name);

    for (let day = 1; day <= daysInMonth; day++) {
      const timesheetForDay = tableRow.timesheets.find((ts) => {
        const tsDate = new Date(ts.date);
        return tsDate.getDate() === day && ts.contract_service.id === tableRow.service.id;
      });
      rowData.push(timesheetForDay ? timesheetForDay.total_amount : 0);
    }

    rowData.push(tableRow.remark || "");
    dataForSheet.push(rowData);
  });

  // Approval

  dataForSheet.push([]);
  dataForSheet.push(["Status: ", summary.summaryStatus.name]);

  // Add and export
  const worksheet = XLSX.utils.aoa_to_sheet(dataForSheet);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheet Summary");

  const fileName = `TimesheetSummary_${summary.company.name}_${state.monthYear}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

const saveRemark = () => {
  if (activeSummary.value && editingServiceId.value !== null) {
    timesheetStore.updateServiceRemark(
      activeSummary.value.id,
      editingServiceId.value, // Pass the specific service ID
      remarkText.value
    );
    isRemarkModalOpen.value = false;
  }
};
</script>
