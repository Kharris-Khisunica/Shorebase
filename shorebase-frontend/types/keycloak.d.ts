import type Keycloak from 'keycloak-js'

export {}

declare module '#app' {
  interface NuxtApp {
    $keycloak: Keycloak
    $keycloakReady: Promise<void>
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $keycloak: Keycloak
    $keycloakReady: Promise<void>
  }
}