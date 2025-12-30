<template>
  <div v-if="actual" class="space-y-6 text-sm">
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
            <td class="px-4 py-2 w-1/3 font-semibold text-gray-600">No. Actual</td>
            <td class="px-4 py-2">{{ actual.code || "-" }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Status</td>
            <td class="px-4 py-2">
              <UBadge
                :color="actual.status?.code === 'OPEN' ? 'primary' : 'neutral'"
                variant="subtle"
              >
                {{ actual.status?.name || "Unknown" }}
              </UBadge>
            </td>
          </tr>
          <tr v-if="actual.planActivity">
            <td class="px-4 py-2 font-semibold text-gray-600">Ref. Plan Activity</td>
            <td class="px-4 py-2">
              <span class="text-primary-600 font-medium">{{
                actual.planActivity.code
              }}</span>
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Perusahaan</td>
            <td class="px-4 py-2">{{ actual.company?.name || "-" }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Service</td>
            <td class="px-4 py-2">{{ actual.shorebaseService?.name || "-" }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Deskripsi</td>
            <td class="px-4 py-2">{{ actual.description || "-" }}</td>
          </tr>
          <tr v-if="actual.remark">
            <td class="px-4 py-2 font-semibold text-gray-600">Remark</td>
            <td class="px-4 py-2">{{ actual.remark }}</td>
          </tr>
          <tr v-if="actual.subContractor">
            <td class="px-4 py-2 font-semibold text-gray-600">Sub Contractor</td>
            <td class="px-4 py-2">{{ actual.subContractor.company?.name || "-" }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="actual.actualActivityMH" class="border rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              colspan="2"
              class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Detail Material Handling (Actual)
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr>
            <td class="px-4 py-2 w-1/3 font-semibold text-gray-600">Waktu Mulai</td>
            <td class="px-4 py-2">
              {{ formatDateTime(actual.actualActivityMH.actualStartedAt) }}
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Waktu Selesai</td>
            <td class="px-4 py-2">
              {{ formatDateTime(actual.actualActivityMH.actualEndedAt) }}
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Produk</td>
            <td class="px-4 py-2">
              {{ actual.actualActivityMH.actualProduct?.name || "-" }}
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Qty</td>
            <td class="px-4 py-2">
              {{ actual.actualActivityMH.actualProductQty }}
              {{ actual.actualActivityMH.actualProduct?.uom?.code || "" }}
            </td>
          </tr>
          <tr v-if="actual.actualActivityMH.equipment">
            <td class="px-4 py-2 font-semibold text-gray-600">Equipment</td>
            <td class="px-4 py-2">{{ actual.actualActivityMH.equipment.name }}</td>
          </tr>
          <tr v-if="actual.actualActivityMH.actualDescription">
            <td class="px-4 py-2 font-semibold text-gray-600">Ket. Tambahan</td>
            <td class="px-4 py-2">{{ actual.actualActivityMH.actualDescription }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="actual.actualActivityMeal" class="border rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              colspan="2"
              class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Detail Meal Service (Actual)
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr>
            <td class="px-4 py-2 w-1/3 font-semibold text-gray-600">Periode</td>
            <td class="px-4 py-2">
              {{ formatDate(actual.actualActivityMeal.actualStartDate) }} s/d
              {{ formatDate(actual.actualActivityMeal.actualEndDate) }}
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Jumlah Orang</td>
            <td class="px-4 py-2">
              {{ actual.actualActivityMeal.actualPeopleCount }} Orang
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Paket Diambil</td>
            <td class="px-4 py-2 flex gap-2">
              <UBadge
                v-if="actual.actualActivityMeal.actualBreakfast"
                color="success"
                variant="subtle"
                >Breakfast</UBadge
              >
              <UBadge
                v-if="actual.actualActivityMeal.actualLunch"
                color="success"
                variant="subtle"
                >Lunch</UBadge
              >
              <UBadge
                v-if="actual.actualActivityMeal.actualDinner"
                color="success"
                variant="subtle"
                >Dinner</UBadge
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="actual.actualActivityAccomodation"
      class="border rounded-lg overflow-hidden"
    >
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              colspan="2"
              class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Detail Accommodation (Actual)
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr>
            <td class="px-4 py-2 w-1/3 font-semibold text-gray-600">Check In</td>
            <td class="px-4 py-2">
              {{ formatDateTime(actual.actualActivityAccomodation.actualCheckIn) }}
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Check Out</td>
            <td class="px-4 py-2">
              {{ formatDateTime(actual.actualActivityAccomodation.actualCheckOut) }}
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Tipe Kamar</td>
            <td class="px-4 py-2">
              {{ actual.actualActivityAccomodation.actualRoomType?.name || "-" }}
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Jumlah Kamar</td>
            <td class="px-4 py-2">
              {{ actual.actualActivityAccomodation.actualRoomCount }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="actual.actualActivityJetty" class="border rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              colspan="2"
              class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Detail Jetty (Actual)
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr>
            <td class="px-4 py-2 w-1/3 font-semibold text-gray-600">Waktu Sandar</td>
            <td class="px-4 py-2">
              {{ formatDateTime(actual.actualActivityJetty.actualStartedAt) }}
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Waktu Lepas</td>
            <td class="px-4 py-2">
              {{ formatDateTime(actual.actualActivityJetty.actualEndedAt) }}
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Kapal</td>
            <td class="px-4 py-2">{{ actual.actualActivityJetty.ship?.name || "-" }}</td>
          </tr>
          <!-- <tr>
            <td class="px-4 py-2 font-semibold text-gray-600">Jenis Layanan</td>
            <td class="px-4 py-2">
              {{ actual.actualActivityJetty.actualJenisLayanan || "-" }}
            </td>
          </tr> -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from "luxon";

// Props definition
const props = defineProps<{
  actual: ActualActivity | null;
}>();

const formatDate = (isoStr: string | Date | undefined) => {
  if (!isoStr) return "-";
  return DateTime.fromISO(isoStr.toString()).toFormat("dd LLL yyyy");
};

const formatDateTime = (isoStr: string | DateTime | undefined) => {
  if (!isoStr) return "-";
  return DateTime.fromISO(isoStr.toString()).toFormat("dd LLL yyyy HH:mm");
};
</script>
