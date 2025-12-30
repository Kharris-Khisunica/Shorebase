<template>
  <div class="w-full">
    <!--  text-transparent bg-clip-text -->
    <h1
      class="text-3xl font-extrabold bg-gradient-to-tr to-primary-blue from-[#133E87] p-6 rounded-xl text-white"
    >
      <strong>BAROKAH SHOREBASE SYSTEM</strong>
    </h1>
  </div>

  <div class="mt-2">
    <p>
      Selamat datang, <strong>{{ userInfo.name }}</strong>
    </p>
  </div>

  <div class="mt-2">
    <p><em>Menu yang bisa diakses:</em></p>
    <div v-for="menu in accessibleMenus" class="mt-2">
      <UCard class="mb-6">
        <template #header>
          <strong>
            <ULink :to="menu.to" :active="false" class="flex flex-row gap-2 items-center">
              <UIcon v-if="menu.icon" :active="false" :name="menu.icon" size="24" />
              {{ menu.label }}
            </ULink>
          </strong>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-4 gap-y-4">
          <div v-for="child in menu.children">
            <ULink
              :to="child.to"
              :active="false"
              class="flex flex-col justify-center items-center gap-1 text-primary"
            >
              <UIcon v-if="child.icon" :name="child.icon" size="24" />
              {{ child.label }}
            </ULink>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { $keycloak, $keycloakReady } = useKeycloak();
await $keycloakReady;

const userInfo = reactive($keycloak.idTokenParsed || {});
interface CustomNavigationMenuItem extends NavigationMenuItem {
  roles: string[];
  children?: CustomNavigationMenuItem[];
}

const menus: CustomNavigationMenuItem[] = [
  {
    label: "Activity & Timesheet",
    icon: "i-lucide-notebook-pen",
    roles: [],
    children: [
      {
        label: "Plan Activity",
        to: "/activity/plan",
        icon: "i-lucide-factory",
        roles: [],
      },
      {
        label: "Actual Activity",
        to: "/activity/actual",
        icon: "i-lucide-factory",
        roles: [],
      },
      {
        label: "Timesheet",
        to: "/timesheet",
        icon: "i-lucide-briefcase-business",
        roles: [],
      },
      {
        label: "Summary Timesheet",
        to: "/summary-timesheet",
        icon: "i-heroicons-document-duplicate",
        roles: [],
      },
    ],
  },
  {
    label: "Contract Master Data",
    icon: "i-lucide-file-text",
    roles: [],
    children: [
      {
        label: "Contract",
        to: "/contract-service/contract",
        icon: "i-lucide-file-text",
        roles: [],
      },
      {
        label: "Contract Service",
        to: "/contract-service",
        icon: "i-lucide-wrench",
        roles: [],
      },
      {
        label: "Contract Service Price",
        icon: "i-lucide-circle-dollar-sign",
        to: "/contract-service/price",
        roles: [],
      },
    ],
  },
  {
    label: "User & Position",
    icon: "i-lucide-id-card",
    roles: [],
    children: [
      {
        label: "User Position",
        to: "/position/user-position",
        icon: "i-lucide-file-user",
        roles: [],
      },
      {
        label: "Position",
        to: "/general/job-position",
        icon: "i-lucide-network",
        roles: [],
      },
      { label: "Company", to: "/general/company", icon: "i-lucide-factory", roles: [] },
      {
        label: "Job Title",
        to: "/position/job-title",
        icon: "i-lucide-briefcase-business",
        roles: ["position-edit", "position-view"],
      },
      {
        label: "Sub Contractor",
        to: "/contract-service/contract/sub-contractor",
        icon: "i-lucide-file-user",
        roles: [],
      },
      {
        label: "Approval Flow",
        to: "/position/approval/workflow",
        icon: "i-lucide-git-pull-request-arrow",
        roles: [],
      },
    ],
  },
  {
    label: "Service Master Data",
    icon: "i-lucide-wrench",
    roles: [],
    children: [
      {
        label: "Service",
        to: "/contract-service/service",
        icon: "i-lucide-wrench",
        roles: [],
      },
      {
        label: "Service Price",
        to: "/contract-service/service/price",
        icon: "i-lucide-circle-dollar-sign",
        roles: [],
      },
      {
        label: "UoM",
        to: "/contract-service/service/uom",
        icon: "i-lucide-pencil-ruler",
        roles: [],
      },
      {
        label: "Summary Calculation Type",
        icon: "i-lucide-calculator",
        to: "/contract-service/service/sum-calc",
        roles: [],
      },
      {
        label: "Activity Status",
        to: "/activity/status",
        icon: "i-lucide-pencil-ruler",
        roles: [],
      },
      {
        label: "Timesheet Type",
        to: "/timesheet/type",
        icon: "i-lucide-notebook-pen",
        roles: [],
      },
      {
        label: "Equipment",
        to: "/activity/equipment",
        icon: "i-lucide-bolt",
        roles: [],
      },
      {
        label: "Produk",
        to: "/activity/product",
        icon: "i-lucide-notebook-pen",
        roles: [],
      },
      {
        label: "Service Type",
        to: "/contract-service/service/type",
        icon: "",
        roles: [],
      },
    ],
  },
];
const accessibleMenus = menus.filter(
  (m) =>
    m.roles.length == 0 ||
    m.roles.find((r) => $keycloak.hasResourceRole(r, "shorebase-backend"))
);
</script>
