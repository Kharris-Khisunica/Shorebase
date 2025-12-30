<script setup>
const { $keycloak, $keycloakReady } = useNuxtApp();
await $keycloakReady;
const config = useRuntimeConfig()
$keycloak.logout({ redirectUri: `${config.public.HOST}` });
// const userStore = useUserStore();
// userStore.logout();
// navigateTo('/');
</script>

<template>
  <p>Logging out...</p>
</template>