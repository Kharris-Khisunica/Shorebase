<template>
  <div class="mb-4">
    <UBreadcrumb :items="[{ label: 'Home', to: '/dashboard' }, { label: 'Activity' }]" />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Activity</h1>
  </div>

  <EnterpriseTable
    :url="url"
    :columns="columns"
    :create="true"
    :field-visibility-logic="fieldVisibilityLogic"
    :dynamic-schema-logic="dynamicSchemaLogic"
  />
</template>

<script setup lang="ts">
import { z, type ZodObject, type ZodType} from "zod";
import EnterpriseTable from "~/components/EnterpriseTable.vue";
import type { ETColumn } from "~/types/EnterpriseTable";
import type { Ref } from "vue";
import { DateTime } from "luxon";

const config = useRuntimeConfig();
const url = `${config.public.BACKEND_HOST}/activity`;


// in index.vue

const fieldVisibilityLogic = (
  column: ETColumn<Activity>,
  formState: Ref<{ [x: string]: { value: any; label: string } }>
): boolean => {
  const formName = column.form_name || column.id || "";
  const state = formState.value;
  const statusCode = state.statusCode?.value;
  const typeCode = state.typeCode?.value;
  const companyId = state.companyId?.value;
  const contractId = state.contractId?.value;
  const shorebaseServiceId = state.shorebaseServiceId?.value;

  // These fields should always be visible first
  if (formName === "statusCode" || formName === "typeCode") {
    return true;
  }

  if (!statusCode ) {
    return false;
  }


  switch (formName) {
    case "companyId":
      return true; // Show company field once status and type are selected

    case "contractId":
      return !!companyId; // Show contract field only if a company is selected

    case "shorebaseServiceId":
      return true; // Show service field only if a contract is selected

    // Tampilkan detail activity berdasarkan service yang dipilih

  /* Lifting */

    // Field Khusus Lifting

    // Logic Field Lifting
    case "uomCode":
        return !!shorebaseServiceId; // Setelah ShorebaseService Terisi

    // Field Khusus untuk TypeCode = Contract

    // Field Khusus untuk TypeCode = SubContractor
    case "subContractorId":
      return typeCode === "S";

    // Field Khusus untuk TypeCode = Independent

    // Field Umum
    case "companyId":

    case "shorebaseServiceId":
    case "uomCode":

    case "shorebaseServiceProductId":
    case "productUomCode":
      return typeCode === "C" || typeCode === "S";

    case "planAmount":
    case "planDate":
    case "planDescription":
    case "planProductQty":
      return statusCode === "P";

    case "planActivityId":
    case "actualProductQty":
    case "actualAmount":
    case "actualStartedAt":
    case "actualEndedAt":
    case "actualDescription":
    case "equipmentId":
      return statusCode === "A";

  /* Berthing */

  // Field Khusus Berthing


  /* Akomodasi */

  // Field Khusus Akomodasi


    default:
      return false;
  }
};

const dynamicSchemaLogic = (
  editableColumns: ETColumn<Activity>[],
  formState: Ref<{ [x: string]: { value: any; label: string } }>
): ZodObject<any> => {
  const shape: { [key: string]: ZodType } = {};

  for (const c of editableColumns) {
    const formName = c.form_name || c.id || "";
    if (!formName || !c.validationType) continue;

    if (fieldVisibilityLogic(c, formState)) {
      shape[formName] = c.validationType;
    } else {
      shape[formName] = c.validationType.optional().nullable();
    }
  }
  return z.object(shape);
};


const columns: ETColumn<Activity>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
    hidden: false,
    primaryKey: true,
    type: "number",
  },
  {
    id: "activityStatus.code",
    type: "select",
    accessorKey: "activityStatus.code",
    form_name: "statusCode",
    header: "Status Activity",
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
    select_option_url: `${config.public.BACKEND_HOST}/activity/status/select-options`,
  },
  {
    id: "activityStatus.name",
    alias_for_id: "activityStatus.code",
    type: "text",
    accessorFn: (row) => row.activityStatus?.name ?? "",
    header: "Status Activity",
    validationType: z.string(),
    edit: "disabled",
    hidden: false,
    select_option_url: `${config.public.BACKEND_HOST}/activity/status/select-options`,
  },
  {
    id: "code",
    header: "Plan Activity",
    accessorKey: "code",
    form_name: "planActivityId",
    edit:"enabled",
    type: "autofill",
    validationType: z.coerce.number().optional(),
    autofill_url: `${config.public.BACKEND_HOST}/activity/autofill-options`,
    autofill_value_field: "id",
    autofill_label_field: "code",
    custom_filter: (formState) => {
      const statusCode = formState.statusCode?.value;
      if (statusCode) {
        return JSON.stringify({ statusCode: statusCode });
      }
      return undefined;
    },
    autofill_target_fields: {
      typeCode: {value: "timesheetType.code", label: "timesheetType.name", readOnly: true},
      contractServiceId: {value: "contractService.id", label: "contractService.code", readOnly: true},
      contractId: {value: "contractService.contract.id", label: "contractService.contract.name", readOnly: true},
      shorebaseServiceId: {value: "contractService.shorebaseService.id", label: "contractService.shorebaseService.name", readOnly: true},
      shorebaseServiceProductId: {value: "shorebaseServiceProduct.id", label: "shorebaseServiceProduct.name", readOnly: false}, // Or true, depending on your logic

      subContractorId: {value: "subContractor.id", label: "subContractor.company.name"},
      companyId: {value: "contractService.company.id", label: "contractService.company.name", readOnly: true},
      uomCode: {value: "contractService.shorebaseService.uom.code", label: "contractService.shorebaseService.uom.name", readOnly: true},
      actualProductQty: "planProductQty",
      actualAmount: "planAmount",
      actualStartedAt: "planDateTime",
      actualEndedAt: "planDateTime",
      actualDescription: "planDescription",
    }
  },
  {
    id: "timesheetType.code",
    type: "select",
    accessorKey: "timesheetType.code",
    form_name: "typeCode",
    header: "Tipe Timesheet",
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
    select_option_url: `${config.public.BACKEND_HOST}/timesheet/type/select-options`,
  },
  {
    id: "timesheetType.name",
    alias_for_id: "timesheetType.code",
    type: "text",
    accessorFn: (row) => row.timesheetType?.name ?? "",
    header: "Tipe Timesheet",
    validationType: z.string(),
    edit: "disabled",
    hidden: false,
    select_option_url: `${config.public.BACKEND_HOST}/timesheet/type/select-options`,
  },
  // {
  //   id: "contractService.code",
  //   header: "Contract Service",
  //   accessorKey: "contractService.code",
  //   form_name: "contractServiceId",
  //   edit: "enabled",
  //   type: "autofill",
  //   validationType: z.number(),
  //   autofill_url: `${config.public.BACKEND_HOST}/contract-service/autofill-options`,
  //   autofill_value_field: "id",
  //   autofill_label_field: "code",
  //   autofill_target_fields: {
  //     companyId: {value: "company.id", label: "company.name", readOnly: true},
  //     shorebaseServiceId: {value: "shorebaseService.id", label: "shorebaseService.name", readOnly: true},

  //   }
  // },
  {
    id: "company.id",
    accessorKey: "company.id",
    form_name: "companyId",
    header: "Perusahaan",

    hidden: true,
    edit: "enabled",
    type: "select",
    validationType: z.coerce.number(),
    select_option_url: `${config.public.BACKEND_HOST}/general/company/select-options`,
  },
  {
    id: "company.name",
    alias_for_id: "company.id",
    accessorFn: (row)=>row.company?.name || "",
    header: "Perusahaan",
    hidden: false,
    edit: "disabled",
    type: "text",
    validationType: z.string(),
    select_option_url: `${config.public.BACKEND_HOST}/general/company/select-options`,
  },
  {
    id: "contractService.contract.id",
    accessorKey: "contractService.contract.id",
    form_name: "contractId",
    header: "Kontrak",
    hidden: true,
    edit: 'enabled',
    type: 'select',
    validationType: z.coerce.number(),
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/contract/select-options`,
    custom_filter: (formState) => {
      const companyId = formState.companyId?.value;
      if (companyId){
        return JSON.stringify({companyId: companyId})
      }
    },
  },
  {
    id: "contractService.contract.name",
    alias_for_id: 'contractService.contract.id',
    accessorKey: "contractService.contract.name",
    header: "Kontrak",
    hidden: false,
    type: 'text',
    validationType: z.string(),
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/contract/select-options`
  },
  {
    id: "subContractor.id",
    type: "select",
    accessorKey: "subContractor.id",
    form_name: "subContractorId",
    header: "Sub Contractor",
    validationType: z.number(),
    edit: "enabled",
    hidden: true,
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/contract/sub-contractor/select-options`,
    custom_filter: (formState) => {
      const contractId = formState.contractId?.value;
      if (contractId){
        return JSON.stringify({contractId: contractId})
      }
    },
  },
  {
    id: "subContractor.name",
    type: "text",
    accessorFn: (row) => row.subContractor?.company?.name || "",
    header: "Sub Contractor",
    validationType: z.string(),
    edit: "disabled",
    hidden: false,
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/contract/sub-contractor/select-options`,
  },
  {
    id: "shorebaseService.id",
    accessorKey: "shorebaseService.id",
    form_name: "shorebaseServiceId",
    header: "Service",
    hidden: true,
    edit: "enabled",
    type: "autofill",
    validationType: z.coerce.number(),
    autofill_url: `${config.public.BACKEND_HOST}/contract-service/autofill-options`,
    autofill_value_field: "shorebaseService.id",
    autofill_label_field: "shorebaseService.name",
    autofill_target_fields: {
      uomCode: { value: "uom.code", label: "uom.name", readOnly: true },
    },
    custom_filter: (formState) => {
      const contractId = formState.contractId?.value;
      const companyId = formState.companyId?.value;
      if (companyId && contractId) {
        return JSON.stringify({ companyId: companyId, contractId: contractId });
      }
    },
  },
  {
    id: "shorebaseService.name",
    alias_for_id: "shorebaseService.id",
    accessorKey: "shorebaseService.name",
    header: "Service",
    hidden: false,
    edit: "disabled",
    type: "text",
    validationType: z.string(),
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/autofill-options`,
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
    accessorFn: (row) =>row.uom?.name || "",
    header: "Uom",
    validationType: z.string(),
    edit: "disabled",
    hidden: false,
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/service/uom/select-options`,
  },
  {
  id: "shorebaseServiceProduct.id",
  type: "autofill",
  accessorKey: 'shorebaseServiceProduct.id',
  form_name:'shorebaseServiceProductId',
  header: "Produk Service",
  validationType: z.coerce.number(),
  edit: "enabled",
  hidden: true,
  autofill_url: `${config.public.BACKEND_HOST}/contract-service/service/product/autofill-options`,
  autofill_value_field: 'id',
  autofill_label_field: 'name',
  autofill_target_fields: {
    productUomCode: {value: "uom.code", label: "uom.name", readOnly: true}
    }
  },
  {
    id: "shorebaseServiceProduct.name",
    alias_for_id: "shorebaseServiceProduct.id",
    type: "text",
    accessorFn: (row) => row.shorebaseServiceProduct?.name || "",
    header: "Produk Service",
    validationType: z.string(),
    edit: "disabled",
    hidden: false,
  },
  {
    id: "shorebaseServiceProduct.uom.code",
    type: "select",
    accessorFn: (row) => row.shorebaseServiceProduct?.uom?.code,
    form_name: "productUomCode",
    header: "Uom Produk",
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/service/uom/select-options`,
  },
  {
    id: "shorebaseServiceProduct.uom.name",
    alias_for_id: "shorebaseServiceProduct.uom.code",
    type: "text",
    accessorFn: (row) =>row.shorebaseServiceProduct?.uom?.name || "",
    header: "Uom Produk",
    validationType: z.string(),
    edit: "disabled",
    hidden: false,
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/service/uom/select-options`,
  },
  {
    id: "code",
    type: "text",
    accessorKey: "code",
    header: "Nomor Activity",
    validationType: z.string(),
    edit: "disabled",
    hidden: false,
  },
  {
    id: "planProductQty",
    type: "number",
    accessorKey: "planProductQty",
    header: "Jumlah Qty Produk Rencana",
    validationType: z.number(),
    edit: "enabled",
    hidden: false,
  },
  {
    id: "planAmount",
    type: "number",
    accessorKey: "planAmount",
    header: "Jumlah Rencana",
    validationType: z.number(),
    edit: "enabled",
    hidden: false,
  },
  {
    id: "planDate",
    type: "date",
    accessorKey: "planDate",
    header: "Tanggal Rencana",
    validationType: z.string(),
    edit: "enabled",
    hidden: false,
  },
  {
    id: "planDescription",
    type: "text",
    header: "Keterangan",
    accessorKey: "planDescription",
    validationType: z.string(),
    edit: "enabled",
    hidden: false,
  },
  {
    id: "equipment.id",
    type: "select",
    accessorKey: 'equipment.id',
    form_name:'equipmentId',
    header: "Equipment",
    validationType: z.coerce.number(),
    edit: "enabled",
    hidden: true,
    select_option_url: `${config.public.BACKEND_HOST}/activity/equipment/select-options`,

  },
  {
    id: "equipment.name",
    type: 'text',
    accessorFn: (row) => row.equipment?.name || "",
    alias_for_id: 'equipment.id',
    header: "Equipment",
    validationType: z.string(),
    edit: 'disabled',
    hidden: false,
    select_option_url: `${config.public.BACKEND_HOST}/activity/equipment/select-options`,
  },
  {
    id: "actualQtyAmount",
    type: "number",
    accessorKey: "actualProductQty",
    header: "Jumlah Qty Produk Aktual",
    validationType: z.number(),
    edit: "enabled",
    hidden: false,
  },
  {
    id: "actualAmount",
    type: "number",
    accessorKey: "actualAmount",
    header: "Jumlah Aktual",
    validationType: z.number(),
    edit: "enabled",
    hidden: false,
  },

  {
    id: "actualStartedAt",
    type: "date_time",
    accessorFn: (row) => {
        if (!row.actualStartedAt) return "";
        return DateTime.fromISO(row.actualStartedAt).toFormat('dd LLL yyyy, HH:mm');
    },
    header: "Waktu Mulai",
    validationType: z.string(),
    edit: "enabled",
    hidden: false,
  },
  {
    id: "actualEndedAt",
    type: "date_time",
    accessorFn: (row) => {
      if(!row.actualEndedAt) return "";
      return DateTime.fromISO(row.actualEndedAt).toFormat('dd LLL yyyy HH:mm')
    },
    header: "Waktu Selesai",
    validationType: z.string(),
    edit: "enabled",
    hidden: false,
  },
  {
    id: "actualDescription",
    type: "text",
    accessorKey: "actualDescription",
    header: "Keterangan",
    validationType: z.string(),
    edit: "enabled",
    hidden: false,
  },
];
</script>
