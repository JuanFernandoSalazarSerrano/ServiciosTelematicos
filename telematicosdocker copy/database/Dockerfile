#MY SQL DATABSE SERVER

FROM mysql:8.0

COPY init.sql /docker-entrypoint-initdb.d/001-init.sql


docker run -d --rm \
  --network telematicosnetwork \
  --name mysql-db-container \
  -e MYSQL_ROOT_PASSWORD='fede' \
  -p 30306:3306 \
  db-mysql:0