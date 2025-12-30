import KeycloakConnect from "keycloak-connect";
import ConnectSQLite3 from 'connect-sqlite3';
import session from 'express-session';

const SQLiteStore = ConnectSQLite3(session);
const sessionStore = new SQLiteStore();
const keycloak = new KeycloakConnect({ store: sessionStore, });

export { keycloak, sessionStore };
