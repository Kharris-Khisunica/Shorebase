export default defineNuxtRouteMiddleware(async () => {
  const { $keycloak, $keycloakReady } = useNuxtApp()
  await $keycloakReady

  if (!$keycloak.authenticated) {
    return navigateTo('/login')
  }
});
