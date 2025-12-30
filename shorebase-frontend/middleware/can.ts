export default function defineCanMiddleware(roles: string[]) {
    return  defineNuxtRouteMiddleware(async () => {
      const { $keycloak, $keycloakReady } = useNuxtApp()
      await $keycloakReady
    
      if (!$keycloak.authenticated) {
        navigateTo('/login');
        return;
      }
      
      if (!roles.find(r => $keycloak.hasRealmRole(r))) {
          navigateTo('/login');
          return;
      }
    });
}
