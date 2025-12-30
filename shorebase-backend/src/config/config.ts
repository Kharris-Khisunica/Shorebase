import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config();

type ValidDatabaseType = "mysql" | "mariadb" | "postgres";

interface Config {
  port: number;
  nodeEnv: string;
  sessionSecret: string;
  frontendHost: string;

  dbMainType: ValidDatabaseType;
  dbMainHost: string;
  dbMainPort: number;
  dbMainUsername: string;
  dbMainPassword: string;
  dbMainDatabase: string;
  dbMainLogging: boolean;

  keycloakMQTTHost: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 4002,
  nodeEnv: process.env.NODE_ENV || 'development',
  sessionSecret: process.env.SESSION_SECRET || 'ASJKFDN3219fawiduj',
  frontendHost: process.env.FRONTEND_HOST || 'http://localhost:4001',
  
  dbMainType: (process.env.DB_MAIN_TYPE || 'mysql') as ValidDatabaseType,
  dbMainHost: process.env.DB_MAIN_HOST || 'localhost',
  dbMainPort: parseInt(process.env.DB_MAIN_PORT) || 3306,
  dbMainUsername: process.env.DB_MAIN_USERNAME || 'root',
  dbMainPassword: process.env.DB_MAIN_PASSWORD || '',
  dbMainDatabase: process.env.DB_MAIN_DATABASE || '',
  dbMainLogging: process.env.DB_MAIN_LOGGING == 'true',

  keycloakMQTTHost: process.env.KEYCLOAK_MQTT_HOST || 'mqtt://localhost:1883'
};

export default config;