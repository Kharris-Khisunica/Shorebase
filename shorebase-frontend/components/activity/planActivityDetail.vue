<template>
  <div v-if="plan" class="space-y-6 text-sm">
    <div class="border rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              colspan="2"
              class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Informasi Umum
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr>
            <td class="px-4 py-2 w-1/3 font-semibold text-gray-600">No. Activity</td>
            <td class="px-4 py-2">{{ plan.code || "-" }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Status</td>
            <td class="px-4 py-2">
              <UBadge
                :color="plan.status?.code === 'OPEN' ? 'primary' : 'neutral'"
                variant="subtle"
              >
                {{ plan.status?.name || "Unknown" }}
              </UBadge>
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Perusahaan</td>
            <td class="px-4 py-2">{{ plan.company?.name || "-" }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Service</td>
            <td class="px-4 py-2">{{ plan.shorebaseService?.name || "-" }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Deskripsi</td>
            <td class="px-4 py-2">{{ plan.description || "-" }}</td>
          </tr>
          <tr v-if="plan.subContractor">
            <td class="px-4 py-2 font-semibold text-gray-600">Sub Contractor</td>
            <td class="px-4 py-2">{{ plan.subContractor.company?.name || "-" }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="plan.planActivityMH" class="border rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              colspan="2"
              class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Detail Material Handling
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr>
            <td class="px-4 py-2 w-1/3 font-semibold text-gray-600">Tanggal Rencana</td>
            <td class="px-4 py-2">
              {{ formatDate(plan.planActivityMH.planStartDate) }}
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Produk</td>
            <td class="px-4 py-2">{{ plan.planActivityMH.planProduct?.name || "-" }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Qty</td>
            <td class="px-4 py-2">
              {{ plan.planActivityMH.planProductQty }}
              {{ plan.planActivityMH.planProduct?.uom?.code || "" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="plan.planActivityMeal" class="border rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              colspan="2"
              class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Detail Meal Service
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr>
            <td class="px-4 py-2 w-1/3 font-semibold text-gray-600">Periode</td>
            <td class="px-4 py-2">
              {{ formatDate(plan.planActivityMeal.planStartDate) }} s/d
              {{ formatDate(plan.planActivityMeal.planEndDate) }}
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Jumlah Orang</td>
            <td class="px-4 py-2">{{ plan.planActivityMeal.planPeopleCount }} Orang</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Paket Diambil</td>
            <td class="px-4 py-2 flex gap-2">
              <UBadge
                v-if="plan.planActivityMeal.planBreakfast"
                color="success"
                variant="subtle"
                >Breakfast</UBadge
              >
              <UBadge
                v-if="plan.planActivityMeal.planLunch"
                color="success"
                variant="subtle"
                >Lunch</UBadge
              >
              <UBadge
                v-if="plan.planActivityMeal.planDinner"
                color="success"
                variant="subtle"
                >Dinner</UBadge
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="plan.planActivityAccomodation" class="border rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              colspan="2"
              class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Detail Accommodation
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr>
            <td class="px-4 py-2 w-1/3 font-semibold text-gray-600">Check In</td>
            <td class="px-4 py-2">
              {{ plan.planActivityAccomodation.planCheckIn }}
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Check Out</td>
            <td class="px-4 py-2">
              {{ plan.planActivityAccomodation.planCheckOut }}
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Tipe Kamar</td>
            <td class="px-4 py-2">
              {{ plan.planActivityAccomodation.planRoomType?.name || "-" }}
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Jumlah Kamar</td>
            <td class="px-4 py-2">{{ plan.planActivityAccomodation.planRoomCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from "luxon";

const props = defineProps<{
  plan: PlanActivity | null;
}>();

const formatDate = (isoStr: string | Date | undefined) => {
  if (!isoStr) return "-";
  return DateTime.fromISO(isoStr.toString()).toFormat("dd LLL yyyy");
};

const formatDateTime = (isoStr: string | Date | undefined) => {
  if (!isoStr) return "-";
  return DateTime.fromISO(isoStr.toString()).toFormat("dd LLL yyyy HH:mm");
};
</script>
