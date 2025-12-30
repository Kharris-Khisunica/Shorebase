import mqtt from "mqtt";
import config from "../config/config";
import { KeycloakSPIEvent } from "../types/keycloak";
import * as userService from '../services/user';
import { User } from "../entity/user/User";
import { DATE_CONSTANT } from "../constants/time_constants";
import { DateTime } from "luxon";
const client = mqtt.connect(config.keycloakMQTTHost);

client.on("connect", () => {
  client.subscribe("keycloak", (err) => {
    if (!err) {
        console.log('Keycloak MQTT Listener Connected: ', client.connected);
    }
  });
});

client.on("message", async (topic, message) => {
  if (topic == 'keycloak') {
        const messageString = message.toString();
        if (!messageString) return;
        
        const json = JSON.parse(messageString) as KeycloakSPIEvent;
        if (!json.resourcePath) return;
        
        const resourcePaths = json.resourcePath.split('/');
        if (json.resourceType == 'USER' && json.representation && resourcePaths.length == 2 && resourcePaths[0] == 'users') {
        const kcUserId = resourcePaths[1];
        const body = JSON.parse(json.representation);

        let user = await userService.getByKeycloakUserId(kcUserId);
        if (!user) {
            user = new User();
            user.startDate = DateTime.now().toISODate();
            user.endDate = DATE_CONSTANT.MAX_VALUE;
        }
        user.kcUserId = kcUserId;
        user.name = `${ body.firstName || '' }${ body.lastName ? ' ' + body.lastName : '' }`;
        user.username = body.username || '';
        user.email = body.email || '';
        await userService.saveUser(user);
      }
  }
});

export default client;