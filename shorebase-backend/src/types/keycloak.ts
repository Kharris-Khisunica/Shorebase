export interface KeycloakSPIEvent {
    clientId: string;
    realmId: string;
    resourcePath: string;
    ipAddress: string;
    time: number;
    type: "UPDATE" | "CREATE";
    representation?: string;
    resourceType: "USER";
}