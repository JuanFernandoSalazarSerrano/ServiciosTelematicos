# SPRINGBOOT BACKENDS

FROM eclipse-temurin:21

WORKDIR /opt/app

COPY financeinfo-0.0.1-SNAPSHOT.jar financeinfo-0.0.1-SNAPSHOT.jar

EXPOSE 8000

ENTRYPOINT ["java", "-jar", "financeinfo-0.0.1-SNAPSHOT.jar"]


docker run -d --rm \
  --network telematicosnetwork \
  --name server1 \
  -p 8000:8000 \
  -e DB_URL='jdbc:mysql://mysql-db-container:3306/financeinformationdb' \
  -e DB_USERNAME=root \
  -e DB_PASSWORD='fede' \
  api-springboot:0

docker run -d --rm \
  --name server2 \
  --network telematicosnetwork \
  -e SERVER_PORT=8001 \
  -e DB_URL=jdbc:mysql://mysql-db-container:3306/financeinformationdb \
  -e DB_USERNAME=root \
  -e DB_PASSWORD='fede' \
  api-springboot:0

docker run -d --rm \
  --name server3 \
  --network telematicosnetwork \
  -e SERVER_PORT=8002 \
  -e DB_URL=jdbc:mysql://mysql-db-container:3306/financeinformationdb \
  -e DB_USERNAME=root \
  -e DB_PASSWORD='fede' \
  api-springboot:0