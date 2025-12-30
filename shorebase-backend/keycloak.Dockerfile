FROM quay.io/keycloak/keycloak:26.3 AS builder

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Configure a database vendor
ENV KC_DB=mysql
COPY ./dependencies/event-listener-mqtt-22.0.0-jar-with-dependencies.jar /opt/keycloak/providers/

WORKDIR /opt/keycloak
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:26.3
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# change these values to point to a running postgres instance
ENV KC_DB=mysql
ENV KC_DB_URL_HOST=host.docker.internal
ENV KC_DB_URL_DATABASE=shorebase_keycloak
ENV KC_DB_USERNAME=root
ENV KC_DB_PASSWORD=
ENV KC_DB_URL_PORT=3306
ENV KC_DB_URL_PROPERTIES='?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC'
ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=1234

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
