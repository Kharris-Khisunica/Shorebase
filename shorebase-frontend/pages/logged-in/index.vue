<template>
  <table class="table-auto">
    <tbody>
      <tr>
        <td>Nama</td>
        <td>{{ userInfo.name }}</td>
      </tr>
      <tr>
        <td>Email</td>
        <td>{{ userInfo.email }}</td>
      </tr>
      <tr>
        <td>Username</td>
        <td>{{ userInfo.preferred_username }}</td>
      </tr>
      <tr>
        <td>Keycloak User Id</td>
        <td>{{ userInfo.sub }}</td>
      </tr>
      <tr>
        <td>Isi Token</td>
        <td>{{ $keycloak.idTokenParsed }}</td>
      </tr>
    </tbody>
  </table>

  <strong>Menu yang bisa diakses:</strong>
  <div v-for="menu in accessibleMenus">
    <ULink :to="menu.to" :active="false">{{ menu.name }}</ULink>
  </div>
</template>

<script setup lang="ts">
navigateTo('/dashboard');

const { $keycloak, $keycloakReady } = useNuxtApp();
await $keycloakReady;

const userStore = useUserStore();
const userInfo = reactive($keycloak.idTokenParsed || {});
// userStore.login({

// });
const menus = [
  {
    name: "List Jabatan",
    to: "/position/job-title",
    roles: ["position-edit", "position-view"],
  },
  { name: "List Perusahaan", to: "/general/company", roles: [] },
  { name: "List Posisi", to: "/general/job-position", roles: [] },
  { name: "List UoM", to: "/contract-service/service/uom", roles: [] },
  { name: "List SumCalc Type", to: "/contract-service/service/sum-calc", roles: [] },
  { name: "List of Service", to: "/contract-service/service", roles: [] },
  { name: "List of Service Price", to: "/contract-service/service/price", roles: [] },
  { name: "List of Contract", to: "/contract-service/contract", roles: [] },
  { name: "List of Contract Service", to: "/contract-service", roles: [] },
  { name: "List of Contract Service Price", to: "/contract-service/price", roles: [] },
];
const accessibleMenus = menus.filter(
  (m) => m.roles.length == 0 || m.roles.find((r) => $keycloak.hasRealmRole(r))
);
</script>
