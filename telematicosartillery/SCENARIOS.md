# Escenarios Artillery - financeinfo

Este archivo describe los escenarios definidos en `financeinfo-scenarios.yml` para generar trafico variado sobre la API.


## Escenarios

### 1) Monitoring endpoints
- **Objetivo**: validar que los endpoints de observabilidad respondan rapido y siempre en JSON.
- **Rutas**:
  - `GET /api/health`
  - `GET /api/metrics`
  - `GET /api/system`
  - `GET /api/stats`

### 2) Clients CRUD
- **Objetivo**: flujo completo de clientes con lectura y escritura.
- **Pasos**:
  1. `POST /api/clients` (crea cliente y captura `clientId`).
  2. `GET /api/clients/{clientId}`
  3. `PUT /api/clients/{clientId}`
  4. `GET /api/clients`
  5. `DELETE /api/clients/{clientId}`

### 3) Stocks CRUD
- **Objetivo**: flujo completo para acciones (stocks).
- **Pasos**:
  1. `POST /api/stocks` (crea stock y captura `stockId`).
  2. `GET /api/stocks/{stockId}`
  3. `PUT /api/stocks/{stockId}`
  4. `GET /api/stocks`
  5. `DELETE /api/stocks/{stockId}`

### 4) Portfolio flow
- **Objetivo**: flujo realista de portafolios con dependencias cliente + stock.
- **Pasos**:
  1. Crear cliente
  2. Crear stock
  3. Crear portafolio
  4. `GET /api/portfolios/client/{clientId}`
  5. Actualizar portafolio
  6. Eliminar portafolio
  7. Eliminar cliente y stock

### 5) Failure endpoints
- **Objetivo**: generar fallos controlados para validar manejo de errores.
- **Rutas**:
  - `GET /api/failures/bad-request` (400)
  - `GET /api/failures/not-found` (404)
  - `GET /api/failures/unavailable` (503)
  - `GET /api/failures/timeout?seconds=2` (respuesta lenta)
- **Nota**: estos endpoints producen respuestas no exitosas a proposito, lo cual se vera como errores en el reporte.

### 6) Ejecutar prueba Artillery de carga alta
- **Objetivo**: incrementar el volumen de solicitudes por usuario virtual para simular carga alta.
- **Rutas**:
  - `GET /api/health`
  - `GET /api/clients`
  - `GET /api/stocks`
  - `GET /api/portfolios`
- **Detalle**: usa un `loop` con 10 iteraciones para multiplicar las peticiones por cada VU.

## Como ejecutar
Desde la carpeta `artillery`:

```bash
artillery run financeinfo-scenarios.yml
```