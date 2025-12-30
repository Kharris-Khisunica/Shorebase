<template>
  <div class="mb-4">
    <UBreadcrumb
      :items="[{ label: 'Home', to: '/dashboard' }, { label: 'Plan Activity' }]"
    />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Plan Activity</h1>
  </div>

  <EnterpriseTable
    :url="url"
    :columns="columns"
    :create="true"
    :field-visibility-logic="fieldVisibilityLogic"
    :dynamic-schema-logic="dynamicSchemaLogic"
    :custom-actions="customActions"
  />

  <UModal
    v-model="detailModalOpen"
    :ui="{
      wrapper: 'z-[9999]',
      zIndex: 'z-[9999]',
      overlay: { background: 'bg-gray-900/50', zIndex: 'z-[9998]' },
    }"
  >
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-semibold">Detail Plan Activity</h3>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            @click="detailModalOpen = false"
          />
        </div>
      </template>

      <div v-if="isFetchLoading" class="flex justify-center py-8">
        <UIcon name="i-lucide-loader-2" class="animate-spin w-8 h-8 text-primary-500" />
      </div>

      <PlanActivityDetail v-else-if="selectedDetailItem" :plan="selectedDetailItem" />

      <div v-else class="text-center py-4 text-gray-500">
        Data detail tidak ditemukan.
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="detailModalOpen = false"
            >Tutup</UButton
          >
          <UButton
            :disabled="isFetchLoading || !selectedDetailItem"
            color="primary"
            icon="i-lucide-check-circle-2"
            @click="handleActualize(selectedDetailItem!)"
            >Actualize</UButton
          >
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { z, type ZodObject, type ZodType} from "zod";
import EnterpriseTable from "~/components/EnterpriseTable.vue";
import type { ETColumn } from "~/types/EnterpriseTable";
import PlanActivityDetail from "~/components/activity/planActivityDetail.vue";
import type { Ref } from "vue";
import { DateTime } from "luxon";

const config = useRuntimeConfig();
const url = `${config.public.BACKEND_HOST}/activity/plan`;
const toast = useToast();

const detailModalOpen = ref(false);
const selectedDetailItem = ref<PlanActivity | null>(null);
const isFetchLoading = ref(false);

const customActions = [
  {
    label: "See Details",
    icon: "i-lucide-eye",
    onClick: async (row: PlanActivity) => {
        selectedDetailItem.value = null;
        isFetchLoading.value = true;
        detailModalOpen.value = true;

        const { data, error } = await useAuthorizedFetch<PlanActivity>(`${url}/${row.id}`);

        isFetchLoading.value = false;

        if (error.value) {
            console.error("Error fetching plan detail:", error.value);
            toast.add({
                title: 'Error',
                description: 'Gagal memuat detail activity',
                color: 'error'
            });
        } else if (data.value) {
            selectedDetailItem.value = data.value;
        }
    }
  },
  {
    label: "Isi Aktual",
    icon: "i-lucide-check-circle-2",
    onClick: (row: PlanActivity) => {
      handleActualize(row);
    }
  }
];


const handleActualize = (item: PlanActivity) => {
    console.log("Actualizing:", item);
    toast.add({
        title: "Fitur Actualize",
        description: `Akan menyalin data Plan ${item.code} ke Actual Activity (Coming Soon)`,
        color: 'primary'
    });
    detailModalOpen.value = false;
}

// in index.vue

const fieldVisibilityLogic = (
  column: ETColumn<PlanActivity>,
  formState: Ref<{ [x: string]: { value: any; label: string } }>
): boolean => {
  const formName = column.form_name || column.id || "";
  const state = formState.value;
  const statusCode = state.statusCode?.value;
  const timesheetTypeCode = state.timesheetTypeCode?.value;
  const companyId = state.companyId?.value;
  const contractId = state.contractId?.value;
  const shorebaseServiceId = state.shorebaseServiceId?.value;
  const ssTypeCode = state.ssTypeCode?.value;

  // These fields should always be visible first
  if (formName === "timesheetTypeCode") {
    return true;
  }

  switch (formName) {
    case "companyId":
      return true;

    case "contractId":
      return !!companyId;

    case "shorebaseServiceId":
      return true;

    /*** Visibility Logic based on TypeCode ***/

    case "companyId":

      return timesheetTypeCode === "C"; // Untuk Case Type = Contractor

    case "companyId":
    case "contractId":
    case "subContractorId":
    case "shorebaseServiceId":
    case "ssTypeCode":
    case "uomCode":
    case "description":
    case "remark":
      return timesheetTypeCode === "S" // Untuk Case Type = SubContractor



    /*** Visibility Logic based on Service Type ***/
    // LIFTING
    case "mh-planStartDate":
    case "mh-shorebaseServiceProductId":
    case "mh-productUomCode":
    case "mh-planProductQty":
      return !!shorebaseServiceId && ssTypeCode === 'MH';

    // MEAL
    case "meal-planStartDate":
    case "meal-planEndDate":
    case "meal-planPeopleCount":
    case "meal-planBreakfast":
    case "meal-planLunch":
    case "meal-planDinner":
      return !!shorebaseServiceId && ssTypeCode === 'MEAL';

    // ACCOMODATION
    case "acc-planCheckIn":
    case "acc-planCheckOut":
    case "acc-planRoomCount":
    case "roomTypeId":
      return !!shorebaseServiceId && ssTypeCode === 'ACC';

    // JETTY

    default:
      return false;
  }
};

const dynamicSchemaLogic = (
  editableColumns: ETColumn<PlanActivity>[],
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


const columns: ETColumn<PlanActivity>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
    hidden: false,
    primaryKey: true,
    type: "number",
  },
  {
    id: "code",
    accessorKey: "code",
    header: "Nomor Activity",
    hidden: false,
    edit: "disabled",
    type: "text",
    validationType: z.string().optional()
  },
  // Sub-Kontraktor Pelaksana
    {
    id: "subContractor.id",
    type: "select",
    accessorKey: "subContractor.id",
    form_name: "subContractorId",
    header: "Sub Contractor",
    validationType: z.coerce.number(),
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
    id: "subContractor.company.name",
    type: "text",
    accessorFn: (row) => row.subContractor?.company?.name || "",
    header: "Sub Contractor",
    validationType: z.string(),
    edit: "disabled",
    hidden: false,
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/contract/sub-contractor/select-options`,
  },
  // Kontraktor Utama
  {
    id: "company.id",
    accessorKey: "company.id",
    form_name: "companyId",
    header: "Kontraktor Utama",
    optional: true,
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
    header: "Kontraktor Utama",
    optional: true,
    hidden: false,
    edit: "disabled",
    type: "text",
    validationType: z.string(),
    select_option_url: `${config.public.BACKEND_HOST}/general/company/select-options`,
  },
  // Timesheet Type is inferred.
  // Tipe timesheet hidden
  // Kalau hanya isi SubKon, maka timesheetType = Independent -> Tampilkan semua service
  // Kalau isi SubKon + Company pelaksana, maka timesheetType = SubKon -> Tampilkan service yang hanya ada di CS
  {
    id: "timesheetType.code",
    type: "select",
    accessorKey: "timesheetType.code",
    form_name: "timesheetTypeCode",
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
    hidden: true,
    select_option_url: `${config.public.BACKEND_HOST}/timesheet/type/select-options`,
  },
  // Contract langsung inferred
  // 1 Kontraktor hanya punya 1 kontrak di satu waktu. Jadi langsung isi kontrak based on company kontraktor
  // Contract hidden.
  // Kalau kontraktor tidak diisi, contract = null
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

  // Service Type -> Kategori umum dari service
  // Ada 5: Material Handling, Jetty, Accommodation, Meal, Other
  // Saat service type dipilih, service yang tersedia based on jenis service type
  // Saat Service dipilih, Service Type akan ter autofill juga.
  // ex: User pilih Material Handling, Service yang ditampilkan hanya Stevedoring, Cargodoring, dan Single Tonnage Lifting
  // ex: User pilih Welder. ServiceType langsung terisi other dan readOnly: true.
  // Logic Service masih mirip
  // Kalau kontraktor diisi, akan menampilkan service based on CS
  // Kalau kontraktor tidak diisi, tampilkan semua available services
  {
    id: "ssTypeCode",
    type: "select",
    accessorFn: (row)=>row.shorebaseService?.ssType?.code,
    form_name: "ssTypeCode",
    header: "Tipe Service",
    validationType: z.string().optional(),
    edit: "enabled",
    hidden: false,
    select_option_url: ``,

  },
  {
    id: "ssTypeName",
    alias_for_id: "ssTypeCode",
    type: "text",
    accessorFn: (row)=>row.shorebaseService?.ssType?.name,
    header: "Tipe Service",
    validationType: z.string(),
    select_option_url: ``,
  },
  {
    id: "shorebaseService.id",
    accessorKey: "shorebaseService.id",
    form_name: "shorebaseServiceId",
    header: "Service",
    hidden: true,
    edit: "enabled",
    type: "autofill",
    optional: true,
    validationType: z.coerce.number(),
    autofill_url: `${config.public.BACKEND_HOST}/contract-service/autofill-options`,
    autofill_value_field: "shorebaseService.id",
    autofill_label_field: "shorebaseService.name",
    autofill_target_fields: {
      uomCode: { value: "uom.code", label: "uom.name", readOnly: true },
      ssTypeCode: { value: "shorebaseService.ssType.code", label: "", readOnly: true}
    },
    custom_filter: (formState) => {
      const contractId = formState.contractId?.value;
      const companyId = formState.companyId?.value;
      const ssTypeCode = formState.ssTypeCode?.value;
      if (companyId && contractId && ssTypeCode) {
        return JSON.stringify({ companyId: companyId, contractId: contractId, ssTypeCode: ssTypeCode });
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
    optional: true,
  },


// Service Specific
// Diakses lewat "Lihat Detail"

/* Lifting
  if shorebaseService.ssType.code = MH
*/
  {
    id: "mh-planStartDate",
    type: 'date',
    header: "Tanggal Mulai",
    accessorFn: (row)=>row.planActivityMH?.planStartDate,
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "shorebaseServiceProduct.id",
    type: "autofill",
    accessorFn: (row)=>row.planActivityMH?.planProduct?.id,
    form_name:'mh-shorebaseServiceProductId',
    header: "Produk Service",
    validationType: z.coerce.number(),
    edit: "enabled",
    hidden: true,
    autofill_url: `${config.public.BACKEND_HOST}/contract-service/service/product/autofill-options`,
    autofill_value_field: 'id',
    autofill_label_field: 'name',
    autofill_target_fields: {
      "mh-productUomCode": {value: "uom.code", label: "uom.name", readOnly: true}
    }
  },
  {
    id: "shorebaseServiceProduct.name",
    alias_for_id: "shorebaseServiceProduct.id",
    type: "text",
    accessorFn: (row) => row.planActivityMH?.planProduct?.name || "",
    header: "Produk Service",
    validationType: z.string(),
    edit: "disabled",
    hidden: true,
  },
  {
    id: "shorebaseServiceProduct.uom.code",
    type: "select",
    accessorFn: (row) => row.planActivityMH?.planProduct?.uom?.code,
    form_name: "mh-productUomCode",
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
    accessorFn: (row) =>row.planActivityMH?.planProduct?.uom?.name || "",
    header: "Uom Produk",
    validationType: z.string(),
    edit: "disabled",
    hidden: true,
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/service/uom/select-options`,
  },
  {
    id: "mh-planProductQty",
    type: "number",
    accessorKey: "planProductQty",
    header: "Jumlah Qty Produk",
    validationType: z.number(),
    edit: "enabled",
    hidden: true,
  },

/*
  Meal
  if shorebaseService.ssType.code = Meal
*/
  {
    id: "meal-planStartDate",
    type: 'date',
    header: "Tanggal Mulai",
    accessorFn: (row)=>row.planActivityMeal?.planStartDate,
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "meal-planEndDate",
    type: 'date',
    header: "Tanggal Selesai",
    accessorFn: (row)=>row.planActivityMeal?.planEndDate,
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "meal-planPeopleCount",
    type: 'date',
    header: "Jumlah Orang",
    accessorFn: (row)=>row.planActivityMeal?.planStartDate,
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "meal-planBreakfast",
    type: 'boolean',
    header: "Apakah Mengambil Makan Pagi?",
    accessorFn: (row)=>row.planActivityMeal?.planBreakfast,
    validationType: z.boolean(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "meal-planLunch",
    type: 'boolean',
    header: "Apakah Mengambil Makan Siang?",
    accessorFn: (row)=>row.planActivityMeal?.planLunch,
    validationType: z.boolean(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "meal-planDinner",
    type: 'boolean',
    header: "Apakah Mengambil Makan Malam?",
    accessorFn: (row)=>row.planActivityMeal?.planDinner,
    validationType: z.boolean(),
    edit: "enabled",
    hidden: true,
  },

/*
  Accomodation
  if shorebaseService.ssType.code = Acc
*/
  {
    id: "acc-planCheckIn",
    type: 'date_time',
    header: "Waktu Check-In",
    accessorFn: (row)=>row.planActivityAccomodation?.planCheckIn,
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "acc-planCheckOut",
    type: 'date_time',
    header: "Waktu Check-Out",
    accessorFn: (row)=>row.planActivityAccomodation?.planCheckOut,
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "acc-planRoomCount",
    type: 'number',
    header: "Jumlah Kamar",
    accessorFn: (row)=>row.planActivityAccomodation?.planRoomCount,
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "planActivity_Accomodation.roomType.id",
    type: "select",
    accessorFn: (row) => row.planActivityAccomodation?.planRoomType?.id,
    form_name: "roomTypeId",
    header: "Tipe Kamar",
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
    select_option_url: `${config.public.BACKEND_HOST}/activity/room-type/select-options`,
  },
  {
    id: "planActivity_Accomodation.roomType.name",
    alias_for_id: "planActivity_Accomodation.roomType.id",
    type: "text",
    accessorFn: (row) =>row.planActivityAccomodation?.planRoomType?.name || "",
    header: "Tipe Kamar",
    validationType: z.string(),
    edit: "disabled",
    hidden: true,
    select_option_url: `${config.public.BACKEND_HOST}/activity/room-type/select-options`,
  },
/*
  Jetty
  On Progress
*/
  {
    id: "description",
    type: "text",
    header: "Deskripsi",
    accessorKey: "description",
    validationType: z.string(),
    edit: "enabled",
    hidden: false,
  },
  {
    id: "remark",
    type: "text",
    header: "Remark",
    accessorKey: "remark",
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
  },
  // Status logic ?
  {
    id: "status",
    type: "text",
    header: "Status Plan Activity",
    accessorFn: (row) => row.status?.code || "OPEN",
    validationType: z.string(),
    edit: "disabled",
    hidden: false,
  }
];
</script>
