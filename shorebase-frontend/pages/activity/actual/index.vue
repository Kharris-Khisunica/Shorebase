<template>
  <div class="mb-4">
    <UBreadcrumb :items="[{ label: 'Home', to: '/dashboard' }, { label: 'Activity' }]" />

    <h1 class="mt-2 font-bold text-xl sm:text-3xl">Actual Activity</h1>
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
          <h3 class="text-xl font-semibold">Detail Actual Activity</h3>
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

      <ActualActivityDetail v-else-if="selectedDetailItem" :actual="selectedDetailItem" />

      <div v-else class="text-center py-4 text-gray-500">
        Data detail tidak ditemukan.
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="detailModalOpen = false"
            >Tutup</UButton
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
import ActualActivityDetail from "~/components/activity/actualActivityDetail.vue"
import type { Ref } from "vue";
import { DateTime } from "luxon";

const config = useRuntimeConfig();
const url = `${config.public.BACKEND_HOST}/activity/actual`;
const toast = useToast();

const detailModalOpen = ref(false);
const selectedDetailItem = ref<ActualActivity | null>(null);
const isFetchLoading = ref(false);

const customActions = [
  {
    label: "See Details",
    icon: "i-lucide-eye",
    onClick: async (row: ActualActivity) => {
        selectedDetailItem.value = null;
        isFetchLoading.value = true;
        detailModalOpen.value = true;

        const { data, error } = await useAuthorizedFetch<ActualActivity>(`${url}/${row.id}`);

        isFetchLoading.value = false;

        if (error.value) {
            console.error("Error fetching actual detail:", error.value);
            toast.add({
                title: 'Error',
                description: 'Gagal memuat detail activity',
                color: 'error'
            });
        } else if (data.value) {
            selectedDetailItem.value = data.value;
        }
    }
  }
];

// in index.vue

const fieldVisibilityLogic = (
  column: ETColumn<ActualActivity>,
  formState: Ref<{ [x: string]: { value: any; label: string } }>
): boolean => {
const formName = column.form_name || column.id || "";
  const state = formState.value;
  const statusCode = state.statusCode?.value;
  const timesheetTypeCode = state.timesheetTypeCode?.value;
  const companyId = state.companyId?.value;
  const contractId = state.contractId?.value;
  const shorebaseServiceId = state.shorebaseServiceId?.value;
  const serviceTypeCode = state.serviceTypeCode?.value;

  // These fields should always be visible first
  if (formName === "timesheetTypeCode" || formName === "planActivityId") {
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
    case "serviceTypeCode":
    case "uomCode":
    case "description":
    case "remark":
      return timesheetTypeCode === "S" // Untuk Case Type = SubContractor



    /*** Visibility Logic based on Service Type ***/
    // LIFTING
    case "mh-actualStartedAt":
    case "mh-actualEndedAt":
    case "mh-equipmentId":
    case "mh-shorebaseServiceProductId":
    case "mh-productUomCode":
    case "mh-actualProductQty":
      return !!shorebaseServiceId && serviceTypeCode === 'MH';

    // MEAL
    case "meal-actualStartDate":
    case "meal-actualEndDate":
    case "meal-actualPeopleCount":
    case "meal-actualBreakfast":
    case "meal-actualLunch":
    case "meal-actualDinner":
      return !!shorebaseServiceId && serviceTypeCode === 'MEAL';

    // ACCOMODATION
    case "acc-actualCheckIn":
    case "acc-actualCheckOut":
    case "acc-actualRoomCount":
    case "roomTypeId":
      return !!shorebaseServiceId && serviceTypeCode === 'ACC';

    // JETTY

    default:
      return false;
  }

};

const dynamicSchemaLogic = (
  editableColumns: ETColumn<ActualActivity>[],
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


const columns: ETColumn<ActualActivity>[] = [
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
  {
    id: "planActivity.id",
    form_name: "planActivityId",
    header: "Ambil dari Plan",
    type: "autofill",
    hidden: true,
    edit: "enabled",
    validationType: z.coerce.number().optional().nullable(),
    autofill_url: `${config.public.BACKEND_HOST}/activity/plan/autofill-options`,
    autofill_value_field: "id",
    autofill_label_field: "code",
    autofill_target_fields: {
        timesheetTypeCode: { value: "timesheetType.code", label: "timesheetType.name", readOnly: true },
        companyId: { value: "company.id", label: "company.name", readOnly: true },
        contractId: { value: "contractService.contract.id", label: "contractService.contract.name", readOnly: true },
        subContractorId: { value: "subContractor.id", label: "subContractor.company.name", readOnly: true },
        shorebaseServiceId: { value: "shorebaseService.id", label: "shorebaseService.name", readOnly: true },
        uomCode: { value: "uom.code", label: "uom.name", readOnly: true },
        description: "description",
        serviceTypeCode: "shorebaseService.ssType.code",

        // Mapping Spesialisasi (Plan -> Actual)
        // MH
        "mh-actualStartedAt": "planActivityMH.mh-planStartDate",
        "mh-actualEndedAt": "planActivityMH.mh-planStartDate",
        "mh-shorebaseServiceProductId": { value: "planActivityMH.planProduct.id", label: "planActivityMH.planProduct.name" },
        "mh-actualProductQty": "planActivityMH.planProductQty", // Default quantity dari plan
        // Meal
        "meal-actualStartDate": "planActivityMeal.planStartDate",
        "meal-actualEndDate": "planActivityMeal.planEndDate",
        "meal-actualPeopleCount": "planActivityMeal.planPeopleCount",
        "meal-actualBreakfast": "planActivityMeal.planBreakfast",
        "meal-actualLunch": "planActivityMeal.planLunch",
        "meal-actualDinner": "planActivityMeal.planDinner",

        // Acc
        "acc-actualCheckIn": "planActivityAccomodation.planCheckIn",
        "acc-actualCheckOut": "planActivityAccomodation.planCheckOut",
        "acc-actualRoomCount": "planActivityAccomodation.planRoomCount",
        "acc-roomTypeId": { value: "planActivityAccomodation.planRoomType.id", label: "planActivityAccomodation.planRoomType.name" }
     },
},

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
    hidden: false,
    select_option_url: `${config.public.BACKEND_HOST}/timesheet/type/select-options`,
  },
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
      serviceTypeCode: { value: "shorebaseService.ssType.code", label: "", readOnly: true}
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
    id: "serviceTypeCode",
    type: "text",
    accessorFn: (row)=>row.shorebaseService?.ssType?.code,
    form_name: "serviceTypeCode",
    header: "Service Type Code",
    validationType: z.string().optional(),
    edit: "enabled",
    hidden: false,
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
    id: "actualActivityMH.actualStartedAt",
    type: 'date_time', // Menggunakan date_time karena entity datetime
    header: "Waktu Mulai (MH)",
    accessorFn: (row) => row.actualActivityMH?.actualStartedAt,
    form_name: "mh-actualStartedAt",
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "actualActivityMH.actualEndedAt",
    type: 'date_time', // Menggunakan date_time karena entity datetime
    header: "Waktu Selesai (MH)",
    accessorFn: (row) => row.actualActivityMH?.actualEndedAt,
    form_name: "mh-actualEndedAt",
    validationType: z.string().optional(),
    edit: "enabled",
    hidden: true,
  },
{
    id: "actualActivityMH.actualProduct.id",
    type: "autofill",
    accessorFn: (row) => row.actualActivityMH?.actualProduct?.id,
    form_name: 'mh-shorebaseServiceProductId',
    header: "Produk Service",
    validationType: z.coerce.number(),
    edit: "enabled",
    hidden: true,
    autofill_url: `${config.public.BACKEND_HOST}/contract-service/service/product/autofill-options`,
    autofill_value_field: 'id',
    autofill_label_field: 'name',
    autofill_target_fields: {
      // Note: readOnly dihapus agar user bisa ganti UoM manual setelah autofill
      "mh-productUomCode": {value: "uom.code", label: "uom.name"}
    }
  },
  {
    id: "actualActivityMH.actualProduct.name",
    alias_for_id: "actualActivityMH.actualProduct.id",
    type: "text",
    accessorFn: (row) => row.actualActivityMH?.actualProduct?.name || "",
    header: "Produk",
    validationType: z.string(),
    edit: "disabled", // Nama produk disabled (readonly dari ID)
    hidden: true,
  },

  // [UPDATE] UoM Produk sekarang bisa diedit (Select)
  {
    id: "mh-productUomCode",
    type: "select", // Ubah jadi select agar user bisa memilih
    accessorFn: (row) => row.actualActivityMH?.actualProduct?.uom?.code,
    form_name: "mh-productUomCode",
    header: "UoM Produk",
    validationType: z.string(),
    edit: "enabled", // ENABLED
    hidden: true,
    select_option_url: `${config.public.BACKEND_HOST}/contract-service/service/uom/select-options`,
  },
  {
    id: "actualActivityMH.actualProductQty",
    type: "number",
    header: "Qty Produk",
    accessorFn: (row) => row.actualActivityMH?.actualProductQty,
    form_name: "mh-actualProductQty",
    validationType: z.number(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "actualActivityMH.equipment.id",
    type: "select",
    accessorFn: (row) => row.actualActivityMH?.equipment?.id,
    form_name: "mh-equipmentId",
    header: "Equipment",
    validationType: z.coerce.number().optional(),
    edit: "enabled",
    hidden: true,
    select_option_url: `${config.public.BACKEND_HOST}/activity/equipment/select-options`,
  },

  // ==========================================
  // SPESIALISASI: MEAL
  // Ref Entity: ActualActivityMeal
  // Fields: actualStartDate (date), actualEndDate (date)
  // ==========================================
  {
    id: "actualActivityMeal.actualStartDate",
    type: 'date', // Menggunakan date karena entity date
    header: "Tanggal Mulai (Meal)",
    accessorFn: (row)=>row.actualActivityMeal?.actualStartDate,
    form_name: "meal-actualStartDate",
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "actualActivityMeal.actualEndDate",
    type: 'date', // Menggunakan date karena entity date
    header: "Tanggal Selesai (Meal)",
    accessorFn: (row)=>row.actualActivityMeal?.actualEndDate,
    form_name: "meal-actualEndDate",
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "actualActivityMeal.actualPeopleCount",
    type: 'number',
    header: "Jumlah Orang",
    accessorFn: (row)=>row.actualActivityMeal?.actualPeopleCount,
    form_name: "meal-actualPeopleCount",
    validationType: z.number(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "actualActivityMeal.actualBreakfast",
    type: 'boolean',
    header: "Breakfast",
    accessorFn: (row)=>row.actualActivityMeal?.actualBreakfast,
    form_name: "meal-actualBreakfast",
    validationType: z.boolean(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "actualActivityMeal.actualLunch",
    type: 'boolean',
    header: "Lunch",
    accessorFn: (row)=>row.actualActivityMeal?.actualLunch,
    form_name: "meal-actualLunch",
    validationType: z.boolean(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "actualActivityMeal.actualDinner",
    type: 'boolean',
    header: "Dinner",
    accessorFn: (row)=>row.actualActivityMeal?.actualDinner,
    form_name: "meal-actualDinner",
    validationType: z.boolean(),
    edit: "enabled",
    hidden: true,
  },

  // ==========================================
  // SPESIALISASI: ACCOMODATION
  // Ref Entity: ActualActivityAccomodation
  // Fields: actualCheckIn (datetime), actualCheckOut (datetime)
  // ==========================================
  {
    id: "actualActivityAccomodation.actualCheckIn",
    type: 'date_time', // Menggunakan date_time karena entity datetime
    header: "Check-In (Acc)",
    accessorFn: (row)=>row.actualActivityAccomodation?.actualCheckIn,
    form_name: "acc-actualCheckIn",
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "actualActivityAccomodation.actualCheckOut",
    type: 'date_time', // Menggunakan date_time karena entity datetime
    header: "Check-Out (Acc)",
    accessorFn: (row)=>row.actualActivityAccomodation?.actualCheckOut,
    form_name: "acc-actualCheckOut",
    validationType: z.string(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "actualActivityAccomodation.actualRoomCount",
    type: 'number',
    header: "Jml Kamar",
    accessorFn: (row)=>row.actualActivityAccomodation?.actualRoomCount,
    form_name: "acc-actualRoomCount",
    validationType: z.number(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "actualActivityAccomodation.actualRoomType.id",
    type: "select",
    accessorFn: (row) => row.actualActivityAccomodation?.actualRoomType?.id,
    form_name: "acc-roomTypeId",
    header: "Tipe Kamar",
    validationType: z.coerce.number(),
    edit: "enabled",
    hidden: true,
    select_option_url: `${config.public.BACKEND_HOST}/activity/room-type/select-options`,
  },
  {
    id: "actualActivityAccomodation.actualRoomType.name",
    alias_for_id: "actualActivityAccomodation.actualRoomType.id",
    type: "text",
    accessorFn: (row) => row.actualActivityAccomodation?.actualRoomType?.name || "",
    header: "Tipe Kamar",
    validationType: z.string(),
    edit: "disabled",
    hidden: true,
  },

  // ==========================================
  // SPESIALISASI: JETTY
  // Ref Entity: ActualActivityJetty
  // Fields: actualStartedAt (datetime), actualEndedAt (datetime)
  // ==========================================
  {
    id: "actualActivityJetty.actualStartedAt",
    type: 'date_time', // Menggunakan date_time karena entity datetime
    header: "Waktu Sandar (Jetty)",
    accessorFn: (row) => row.actualActivityJetty?.actualStartedAt,
    form_name: "jetty-actualStartedAt",
    validationType: z.string().optional(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "actualActivityJetty.actualEndedAt",
    type: 'date_time', // Menggunakan date_time karena entity datetime
    header: "Waktu Lepas (Jetty)",
    accessorFn: (row) => row.actualActivityJetty?.actualEndedAt,
    form_name: "jetty-actualEndedAt",
    validationType: z.string().optional(),
    edit: "enabled",
    hidden: true,
  },
  {
    id: "actualActivityJetty.ship.id",
    type: "select",
    accessorFn: (row) => row.actualActivityJetty?.ship?.id,
    form_name: "jetty-shipId",
    header: "Kapal",
    validationType: z.coerce.number().optional(),
    edit: "enabled",
    hidden: true,
    select_option_url: `${config.public.BACKEND_HOST}/activity/ship/select-options`,
  },
  // {
  //   id: "actualActivityJetty.actualJenisLayanan",
  //   type: "text",
  //   header: "Jenis Layanan",
  //   accessorFn: (row) => row.actualActivityJetty?.,
  //   form_name: "jetty-actualJenisLayanan",
  //   validationType: z.string().optional(),
  //   edit: "enabled",
  //   hidden: true,
  // },

  // --- GENERAL FOOTER FIELDS ---
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
  {
    id: "status",
    type: "text",
    header: "Status",
    accessorFn: (row) => row.status?.code || "OPEN",
    validationType: z.string(),
    edit: "disabled",
    hidden: false,
  }



];
</script>
