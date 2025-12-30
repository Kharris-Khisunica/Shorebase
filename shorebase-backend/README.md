# shorebase-backend
## Requirements
- Node.js v22.13.1 (LTS)
- Docker
## Setup Step
1. Run `docker compose build`
2. Run `docker compose up` to start keycloak and MQTT server
3. Import Keycloak realm config to your Keycloak server (in localhost:8080 in Realm Settings)
4. Download `keycloak.json` from your Keycloak server and place in this project (in Client > Shorebase Backend > Action > Download Adapter Config)
4. Run `npm install`
5. Run `npm run typeorm:migration:migrate`
6. Run `npm run dev`

## Update Step
1. Run `npm install`
2. Run `npm run typeorm:migration:migrate`

# Entity Change Step
1. Run `npm run typeorm:migration:generate ./src/migration/<migration-name>` to automatically generate migration from changed schema
2. Or run `npm run typeorm:migration:create ./src/migration/<migration-name>` to create blank migration
3. Run `npm run typeorm:migration:migrate` to migrate the migrations
