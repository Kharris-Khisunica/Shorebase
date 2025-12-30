<template>
  <h1>Shorebase System</h1>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/user";

definePageMeta({
  layout: "not-logged-in",
});

const userStore = useUserStore();
const user = computed(() => userStore.user);

const { $keycloak, $keycloakReady } = useNuxtApp();
await $keycloakReady;

const config = useRuntimeConfig();

if (!$keycloak.authenticated) {
  await $keycloak.login({ redirectUri: `${config.public.HOST}/dashboard` });
} else {
  navigateTo('/dashboard');
}
</script>
