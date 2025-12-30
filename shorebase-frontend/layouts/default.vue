<template>
  <div class="w-full min-h-screen flex flex-row justify-start align-top">
    <div class="flex flex-col">
      <div class="flex flex-row">
        <NuxtLink to="/dashboard" class="w-full flex justify-center p-3">
          <NuxtImg src="/images/logo/bpg-thumbnail.png" class="max-w-fit" :class="{ 'h-10': !isMobile, 'h-8': isMobile }" />
        </NuxtLink>
        <USeparator orientation="vertical" />
      </div>

      <USeparator orientation="horizontal" />

      <UNavigationMenu
        :collapsed="isMobile"
        orientation="vertical"
        :items="items"
        tooltip
        popover
        class="border-solid border-e-1 border-gray-200 min-h-full" :class="{ 'min-w-48': !isMobile, 'items-center': isMobile }"
      >
      </UNavigationMenu>
    </div>

    <div class="px-4 pt-2 sm:px-8 sm:pt-4 w-full">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { NavigationMenuItem } from "@nuxt/ui";
import { useUserStore } from "~/stores/user";

const{ $keycloak, $keycloakReady } = useKeycloak();
await $keycloakReady;
if (!$keycloak.authenticated) {
  navigateTo('/login');
}

const userInfo = reactive($keycloak.idTokenParsed || {});
const isMobile = ref(false);

// Buat custom navbar item untuk setiap role
interface CustomNavigationMenuItem extends NavigationMenuItem {
  roles?: string[];
  children?: CustomNavigationMenuItem[];
}

const userStore = useUserStore();
const user = computed(() => userStore.user);

const specificRoleMenuItems: CustomNavigationMenuItem[] = [
  // Contractor and Subcontractor
  {
    label: 'Activity',
    roles: ['order_plan:view:delegated', 'order_plan:create', 'order_plan:view:created'],
    icon: 'i-lucide-pickaxe',
    children: [
      { label: "Order Activity", to: "/activity" },
      { label: "List Activity", to: "/activity" },
    ]
  },

  // Master Data
  {
    label: 'Master Data',
    roles: ['jobTitle:view:all'],
    icon: 'i-lucide-save',
    children: [
      { label: 'Jabatan', to: '/position/job-title' },
      { label: 'Perusahaan', to: '/general/company' },
      { label: 'Posisi', to: '/general/job-position' }
    ]
  },


  // =========== OLD ROLES ===========
  //JT001 head_bu
  { label: "List of Timesheets", to: "/head-bu/timesheet-list", roles: ["JT001"] },
  { label: "Timesheets summary", to: "/head-bu/timesheet-summary", roles: ["JT001"] },

  //JT002 corporate-invoicing

  //JT003 wo_officer
  {
    label: "Actual Activity",
    type: "label",
    roles: ["JT003"],
    children: [
      { label: "Input Actual Activity", to: "/wo-officer/activity/actual/input" },
      { label: "List of Actual Activity", to: "/wo-officer/activity/actual/list" },
    ],
  },
  {
    label: "Summary",
    roles: ["JT003"],
    to: "/wo-officer/summary",
  },
  //JT005 contractor
  {
    label: "Subcontractor Planned Activity List",
    to: "/contractor/planned-activity",
    roles: ["JT005"],
  },
  { label: "List of Timesheet", to: "/contractor/timesheet", roles: ["JT005"] },
  { label: "Timesheet Summary", to: "contractor/timesheet-summary", roles: ["JT005"] },
];

const items = computed<NavigationMenuItem[][]>(() => {
  const currentUserRole = user.value?.positions?.[0]?.job_title_position?.job_title?.code;
  const menuItems: NavigationMenuItem[][] = [];

  // Role-specific
  const userSection: NavigationMenuItem[] = [];

  // Filter
  const filteredRoleItems: NavigationMenuItem[] = specificRoleMenuItems
    .filter((item) => {
      return !item.roles || item.roles?.find(r => $keycloak.hasResourceRole(r, 'shorebase-backend'));
    })
    .map((item) => {
      const newItem: NavigationMenuItem = { ...item };

      // Untuk filter children
      if ((newItem as CustomNavigationMenuItem).children) {
        (newItem as CustomNavigationMenuItem).children = ((newItem as CustomNavigationMenuItem)
          .children as CustomNavigationMenuItem[]).filter((child) => {
            return !child.roles || child.roles?.find(r => $keycloak.hasResourceRole(r, 'shorebase-backend'));
        });
      }
      return newItem;
    });

    userSection.push(...filteredRoleItems);
    userSection.push({
      label: userInfo.name,
      class: "font-bold",
      icon: 'i-lucide-circle-user-round',
      children: [
        { label: `username: ${userInfo.preferred_username}` },
        { label: `email: ${userInfo.email}` },
      ]
    });
  menuItems.push(userSection);

  // Logout
  menuItems.push([{ label: "Logout", to: "/logout", icon: "i-lucide-log-out" }]);

  return menuItems;
});

onMounted(() => {
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  isMobile.value = mediaQuery.matches;
  mediaQuery.addEventListener('change', e => {
    isMobile.value = e.matches;
  });
});
</script>
