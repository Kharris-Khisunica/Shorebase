import Keycloak, { type KeycloakConfig, type KeycloakInitOptions } from 'keycloak-js'

export default defineNuxtPlugin((nuxtApp) => {
    callOnce(() => {
        const runtimeConfig = useRuntimeConfig()
        const config = {
            url: runtimeConfig.public.KEYCLOAK_URL,
            realm: runtimeConfig.public.KEYCLOAK_REALM,
            clientId: runtimeConfig.public.KEYCLOAK_CLIENT_ID,
        } as KeycloakConfig
    
        const keycloak = new Keycloak(config)
    
        const initOptions = {
            onLoad: 'check-sso',
        } as KeycloakInitOptions;
    
        const keycloakPromise = keycloak.init(initOptions).then((authenticated) => {
            // if (!authenticated) {
            //     // window.location.reload()
            // } else {
            //     console.log('[Keycloak] Authenticated')
            // }
        }).catch((err) => {
            console.error('[Keycloak] Init Error:', err)
        })
    
        nuxtApp.provide('keycloak', keycloak)
        nuxtApp.provide('keycloakReady', keycloakPromise)
    })
})
