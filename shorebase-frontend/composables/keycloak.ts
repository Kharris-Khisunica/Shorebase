import type Keycloak from 'keycloak-js'

export const useKeycloak = () => {
    const { $keycloak, $keycloakReady } = useNuxtApp();
    const $can = async (role: string) => {
        await $keycloakReady;
        return $keycloak.tokenParsed?.realm_access?.roles.includes(role) || false;
    }
    return { $keycloak, $keycloakReady, $can };
};
