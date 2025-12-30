<template>
  <div class="mb-4">
    <UBreadcrumb :items="breadcrumbItems" />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">
      Detail Summary Timesheet {{ company?.name }}
    </h1>
  </div>

  <!-- <div>
    <UButton
      @click="summaryTimesheetFormOpen = true; summaryTimesheetEditMode = false; Object.keys(summaryTimesheetState).forEach((k: string) => (summaryTimesheetState as any)[k] = undefined); Object.assign(summaryTimesheetState, { companyId: parseInt(route.params.id as string) }); "
    >
      Tambah
    </UButton>
  </div> -->
  <div class="mb-4">
    <h2 class="mt-2 font-semibold text-l sm:text-l">
      Period: {{ startDateStr }} s/d {{ endDateStr }}
    </h2>
    <UButton class="mr-2" @click="exportSTToExcel(parseInt(route.params.stId as string))"
      >Export ke Excel</UButton
    >
  </div>

  <div class="mt-3">
    <div>
      <UTable
        :data="tableData"
        :columns="stComponentColumns"
        class="border border-gray-200 overflow-visible"
        :ui="{
          base: 'overflow-visible',
          td: 'border border-gray-200',
        }"
      >
      </UTable>
    </div>
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
import { exportSTToExcel } from "~/composables/exportToExcel";

import * as XLSX from "xlsx";
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
} = await useAuthorizedFetch<SummaryTimesheet>(
  `${config.public.BACKEND_HOST}/summary-timesheet/${route.params.stId}`
);
const stComponents = summaryTimesheetData.value?.stComponents;
const startDateStr = summaryTimesheetData.value?.periodStartDate;
const endDateStr = summaryTimesheetData.value?.periodEndDate;

console.log("Summary Timesheet Data");
console.log(summaryTimesheetData.value);

const tableData = computed(() => {
  console.log("stComponents");
  console.log(stComponents);
  if (!stComponents) return [];

  return stComponents.map((component) => {
    const dailyAmounts = component.sttimesheets.reduce((acc, sttimesheet) => {
      const dateKey = sttimesheet.timesheet.issueDate;
      console.log(typeof dateKey);
      acc[dateKey!] = sttimesheet.timesheet.totalAmount;
      return acc;
    }, {} as { [date: string]: number });

    const aggAmount = component.sttimesheets.reduce(
      (sum, st) => sum + st.timesheet.totalAmount,
      0
    );

    return {
      ...component,
      dailyAmounts,
      aggAmount,
    };
  });
});

const stComponentColumns = computed(() => {
  const preDateColumn: TableColumn<any>[] = [
    {
      accessorFn: (row) => row.contractService?.shorebaseService.name,
      header: "Service",
    },
    {
      accessorKey: "aggAmount",
      header: "Total",
    },
    {
      accessorFn: (row) => row.contractService?.uom?.code,
      header: "Unit",
    },
  ];

  const dateColumn: TableColumn<any>[] = [];

  if (startDateStr && endDateStr) {
    let currentDate = DateTime.fromISO(startDateStr);
    const endDate = DateTime.fromISO(endDateStr);

    while (currentDate <= endDate) {
      const dateKey = currentDate.toISODate();
      dateColumn.push({
        id: dateKey ?? undefined,
        header: currentDate.toFormat("dd"),
        accessorFn: (row) => row.dailyAmounts?.[dateKey!] || 0,
      });
      currentDate = currentDate.plus({ days: 1 });
    }
  }

  const postDateColumn: TableColumn<any>[] = [
    {
      accessorKey: "remark",
      header: "Remark",
    },
  ];

  return [...preDateColumn, ...dateColumn, ...postDateColumn];
});

const summaryTimesheets = computed(() => stComponents?.values || []);

const breadcrumbItems = computed(() => [
  { label: "Home", to: "/dashboard" },
  { label: "Summary Timesheet", to: `/summary-timesheet` },
  { label: company?.value?.name || "" },
]);

const getActionItems = (row: SummaryTimesheet) => {
  return [
    // [
    //   {
    //     label: "Edit",
    //     icon: "i-heroicons-pencil-20-solid",
    //     onClick: () => {
    //       summaryTimesheetFormOpen.value = true;
    //       summaryTimesheetEditMode.value = true;
    //       setEdit(row);
    //     },
    //   },
    //   {
    //     label: "Delete",
    //     icon: "i-heroicons-trash-20-solid",
    //     onClick: () => {
    //       summaryTimesheetDeleteModalOpen.value = true;
    //       summaryTimesheetToDelete.value = row;
    //     },
    //   },
    // ],
  ];
};

// const exportToExcel = () => {
//   const dataForSheet = [];
//   // Header
//   dataForSheet.push(["PT. MASHUD  BERSAUDARA  INTERNASIONAL"]);
//   dataForSheet.push(["ALTIRA BUSINESS TOWER FLOOR 19th UNIT A,B,D"]);
//   dataForSheet.push([
//     " Jl. Yos Sudarso Kav 85, Sunter, Kec. Tanjung Priok, Jakarta Utara 14350",
//   ]);
//   dataForSheet.push(["Telp. (021) 21882300, (021) 21882301, Fax: (021) 21882302"]);
//   dataForSheet.push([
//     "Site : Jl. Setia Bakti  RT.008 Pendingin, Sanga-Sanga, Kutai Kertanegara",
//   ]);
//   dataForSheet.push([]);
//   dataForSheet.push([]);
//   dataForSheet.push([]);
//   dataForSheet.push([]);
//   dataForSheet.push(["SHOREBASE"]);

//   dataForSheet.push(["Nomor Timesheet Summary: ", summaryTimesheetData.value?.code]);
//   dataForSheet.push(["Perusahaan: ", summaryTimesheetData.value?.company?.name]);
//   dataForSheet.push([
//     "Periode: ",
//     summaryTimesheetData.value?.periodStartDate,
//     " - ",
//     summaryTimesheetData.value?.periodEndDate,
//   ]);
//   dataForSheet.push([]);

//   // Table
//   // Header Table
//   const tableHeader = ["No.", "Service", "Total", "Unit"];
//   if (startDateStr && endDateStr) {
//     let currentDate = DateTime.fromISO(startDateStr);
//     const endDate = DateTime.fromISO(endDateStr);

//     while (currentDate <= endDate) {
//       tableHeader.push(currentDate.toFormat("dd"));
//       currentDate = currentDate.plus({ days: 1 });
//     }
//   }
//   tableHeader.push("Remarks");

//   dataForSheet.push(tableHeader);

//   // Isi Table
//   let id = 1;
//   tableData.value.forEach((tableRow) => {
//     const rowData = [];
//     rowData.push(id);
//     rowData.push(tableRow.contractService?.shorebaseService?.name);
//     rowData.push(tableRow.aggAmount);
//     rowData.push(tableRow.contractService?.uom?.code);
//     // Add daily total Amount
//     if (startDateStr && endDateStr) {
//       let currentDate = DateTime.fromISO(startDateStr);
//       const endDate = DateTime.fromISO(endDateStr);

//       while (currentDate <= endDate) {
//         const dateKey = currentDate.toISODate();
//         rowData.push(tableRow.dailyAmounts?.[dateKey!] || 0);
//         currentDate = currentDate.plus({ days: 1 });
//       }
//     }
//     rowData.push(tableRow.remark);
//     dataForSheet.push(rowData);
//     id = id + 1;
//   });

//   // Add and Export
//   const worksheet = XLSX.utils.aoa_to_sheet(dataForSheet);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheet Summary");

//   const fileName = `TimesheetSummary_${summaryTimesheetData.value?.company.name}_${summaryTimesheetData.value?.code}.xlsx`;
//   XLSX.writeFile(workbook, fileName);
// };
</script>
