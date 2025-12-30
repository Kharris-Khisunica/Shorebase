export async function useAuthorizedFetch<T>(url: string, options: any = { authorized: true }) {
    if (!options.authorized) {
        return useFetch<T>(url, {
            ...options,
            credentials: 'omit'
        });
    }
    
    const { $keycloak, $keycloakReady } = useKeycloak();
    await $keycloakReady;

    try {
        await $keycloak.updateToken();
    } catch (error) {
        $keycloak.login();
    }

    const token = $keycloak.token;
    const headers = options.headers || {}

    // Inject Authorization header
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    return useFetch<T>(url, {
        ...options,
        headers,
        credentials: 'omit',
    });
}
