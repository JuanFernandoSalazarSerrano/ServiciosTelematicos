# ServiciosTelematicos

Proyecto de Servicios Telematicos con backend Spring Boot, base de datos MySQL,
balanceador HAProxy, observabilidad Datadog y frontend Angular.

## Componentes
- Backend: Spring Boot (3 instancias) + HAProxy
- Base de datos: MySQL
- Observabilidad: Datadog Agent
- Frontend: Angular

## Requisitos
- Docker y Docker Compose
- Node.js LTS + npm
- Angular CLI
- API Key de Datadog (solicitarla a juan_f.salazar@uao.edu.co)

## Configuracion
- Crear el archivo `telematicosdocker/.env` con la API key:
	```bash
	DD_API_KEY=TU_API_KEY
	```
- Docker Desktop: Settings -> Resources -> File sharing y agregar
	`/opt/datadog-agent/run`.
- Linux: asegurar que exista el directorio `/opt/datadog-agent/run`.

## Pasos de reproduccion
1. Instalar Docker.
2. Clonar el repositorio:
	 ```bash
	 git clone https://github.com/JuanFernandoSalazarSerrano/ServiciosTelematicos.git
	 cd ServiciosTelematicos
	 ```
3. En el `.env` ponga la API key dada (ver seccion Configuracion).
4. Docker Desktop -> Resources -> File sharing y agregar `/opt/datadog-agent/run`.
5. Levantar los contenedores:
	 ```bash
	 cd telematicosdocker
	 docker compose up --build -d
	 ```
	 Si la red externa no existe, crearla:
	 ```bash
	 docker network create telematicosnetwork
	 ```
6. Instalar Node.js LTS (Ubuntu/Debian):
	 ```bash
	 curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
	 sudo apt install -y nodejs
	 ```
7. Instalar Angular CLI:
	 ```bash
	 npm install -g @angular/cli
	 ```
8. Levantar el frontend:
	 ```bash
	 cd ../financefrontend/v0-finance-controller-tabs-main
	 ng serve --host 0.0.0.0 --port 4200 &
	 ```

## URLs utiles en localhost
- Frontend: http://localhost:4200
- API (HAProxy): http://localhost:8080
- HAProxy metrics: http://localhost:8404/metrics
- Datadog dashboard: https://p.us5.datadoghq.com/sb/54e2ed29-4ed7-11f1-b594-c2747b0094e9-926c2792e62a214e7ee4852525de9479

  ## URLs utiles en linea
- 3.84.158.185/api/*
- Datadog dashboard: https://p.us5.datadoghq.com/sb/54e2ed29-4ed7-11f1-b594-c2747b0094e9-926c2792e62a214e7ee4852525de9479
- http://amzn-s3-angular-front.s3-website-us-east-1.amazonaws.com

## Lista de Endpoints
GET /api/clients
GET /api/clients/{id}
POST /api/clients
PUT /api/clients/{id}
DELETE /api/clients/{id}

GET /api/failures/bad-request?message=Bad%20request%20for%20testing
GET /api/failures/not-found?message=Resource%20not%20found%20for%20testing
GET /api/failures/server-error?message=Server%20error%20for%20testing
GET /api/failures/unavailable?message=Service%20unavailable%20for%20testing
GET /api/failures/timeout?seconds=5
POST /api/failures/validation

GET /api/health-text

GET /api/health
GET /api/metrics
GET /api/system
GET /api/stats

GET /api/portfolios
GET /api/portfolios/{id}
GET /api/portfolios/client/{clientId}
POST /api/portfolios
PUT /api/portfolios/{id}
DELETE /api/portfolios/{id}

GET /api/stocks
GET /api/stocks/{id}
POST /api/stocks
PUT /api/stocks/{id}
DELETE /api/stocks/{id}

no need for fuzzing ;)

## Notas
- El frontend esta configurado para llamar a `http://54.211.223.150:8080`.
	Si ejecutas en otro host, actualiza las URLs en los servicios Angular.
- Para detener todo:
	```bash
	cd telematicosdocker
	docker compose down
	```
 (todos los servicios aws han sido detenidos por motivos de costos)
