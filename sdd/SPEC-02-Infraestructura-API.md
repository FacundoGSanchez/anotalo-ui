# SPEC 02 — Infraestructura API (Auth / GET / POST)

## 1. Objetivo

Implementar la infraestructura de comunicación entre el frontend Anótalo UI y el backend API.

El backend expone tres operaciones principales:

- Auth
- GET / Consultas
- POST / Comandos

Cada operación tendrá un cliente especializado:

```text
AuthClient
GetClient
PostClient
```

La arquitectura deberá respetar:

```text
Component
    │
    ▼
Page
    │
    ▼
Hook
    │
    ▼
Service
    │
    ▼
API Client
    │
    ├── AuthClient
    ├── GetClient
    └── PostClient
             │
             ▼
        Backend API
             │
             ▼
        Proceso
             │
             ▼
        Stored Procedure
```

---

## 2. Alcance

Esta Spec incluye:

- Configuración de URL base mediante Environment.
- Cliente de autenticación.
- Cliente GET.
- Cliente POST.
- Obtención y gestión del Token.
- Envío automático del Token en GET.
- Envío automático del Token en POST.
- Construcción de Query String para GET.
- Construcción de Body para POST.
- Serialización de JSON según contrato actual del backend.
- Tipado TypeScript de requests.
- Tipado TypeScript de responses.
- Manejo centralizado de errores HTTP.
- Preparación de la infraestructura para ser utilizada por Services.

---

## 3. Fuera de alcance

No se implementará en esta Spec:

- Lógica de negocio.
- Services de funcionalidades.
- Hooks específicos de funcionalidades.
- Refactor de Context.
- Refactor de componentes.
- LocalStorage como DataSource.
- Abstracción LocalStorage/API.
- ABM.
- Cambios en backend.
- Cambios en Stored Procedures.

---

## 4. Configuración de Environment

La URL base de la API deberá configurarse mediante variables de entorno.

Actualmente existe un único entorno productivo, pero la arquitectura deberá quedar preparada para múltiples entornos.

Variable:

```env
VITE_API_BASE_URL=https://anotalo-ws.sniperbot.com.ar:5094
```

El código fuente no deberá contener URLs hardcodeadas.

Incorrecto:

```ts
fetch(
  'https://anotalo-ws.sniperbot.com.ar:5094/api/handler/consultar'
);
```

Correcto:

```ts
fetch(
  `${apiConfig.baseUrl}/api/handler/consultar`
);
```

La URL deberá estar centralizada en:

```text
src/
└── config/
    └── apiConfig.ts
```

Ejemplo:

```ts
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL
};
```

---

## 5. Environment Files

Se deberá contemplar:

```text
.env.example
.env.production
.env.development
```

Ejemplo:

```env
VITE_API_BASE_URL=https://anotalo-ws.sniperbot.com.ar:5094
```

Actualmente el valor productivo será:

```text
https://anotalo-ws.sniperbot.com.ar:5094
```

En el futuro podrá existir:

```env
VITE_API_BASE_URL=https://api-desarrollo...
```

El cambio de entorno no deberá requerir modificar código TypeScript.

---

## 6. AuthClient

El `AuthClient` será responsable de autenticarse contra:

```http
POST /api/auth/login
```

URL completa actual:

```text
https://anotalo-ws.sniperbot.com.ar:5094/api/auth/login
```

La URL deberá construirse utilizando:

```text
VITE_API_BASE_URL
```

El endpoint recibe un Body JSON.

Request:

```json
{
  "username": "usuario",
  "password": "password"
}
```

Header:

```http
Content-Type: application/json
```

No se utilizará HTTP Basic Authentication.

El usuario y password corresponden a las credenciales del usuario que inicia sesión.

---

## 7. AuthRequest

Se deberá crear:

```ts
export interface AuthRequest {
  username: string;
  password: string;
}
```

El método deberá permitir:

```ts
authClient.login({
  username,
  password
});
```

La solicitud HTTP generada deberá ser equivalente a:

```http
POST /api/auth/login
Content-Type: application/json
```

Body:

```json
{
  "username": "usuario",
  "password": "password"
}
```

---

## 8. AuthResponse

El backend devuelve:

```json
{
  "token": "eyJhbGciOi..."
}
```

Se deberá crear:

```ts
export interface AuthResponse {
  token: string;
}
```

El token deberá ser almacenado mediante el mecanismo definido por la arquitectura de autenticación.

La implementación concreta del almacenamiento será responsabilidad de la capa correspondiente.

---

## 9. Flujo de Auth

El flujo será:

```text
Login Page
    │
    ▼
Auth Hook
    │
    ▼
Auth Service
    │
    ▼
AuthClient
    │
    │ POST
    │ /api/auth/login
    │
    │ Body
    │ username
    │ password
    ▼
Backend
    │
    ▼
AuthResponse
    │
    ▼
Token
```

El `AuthClient` no deberá:

- Renderizar UI.
- Manejar formularios.
- Manejar React Context.
- Redireccionar.
- Ejecutar GET.
- Ejecutar POST de negocio.

---

## 10. GetClient

El `GetClient` será responsable de ejecutar consultas contra:

```http
GET /api/handler/consultar
```

URL base:

```text
${VITE_API_BASE_URL}/api/handler/consultar
```

El endpoint recibe el request mediante un Query String llamado:

```text
request
```

El contenido de `request` será un JSON serializado.

Ejemplo funcional:

```text
GET /api/handler/consultar?request={"pProceso":"SUCURSAL_OBTENER","data":{"pId":1,"pOrganizacionId":10}}
```

Conceptualmente:

```text
GetClient
    │
    ▼
GET /api/handler/consultar
    │
    ▼
Query Parameter
    │
    └── request = JSON
```

---

## 11. Estructura del Request GET

El objeto enviado dentro del parámetro `request` deberá respetar:

```json
{
  "pProceso": "SUCURSAL_OBTENER",
  "data": {
    "pId": 1,
    "pOrganizacionId": 10
  }
}
```

Se deberá definir un modelo genérico:

```ts
export interface GetRequest<TData = unknown> {
  pProceso: string;
  data?: TData;
}
```

Ejemplo específico:

```ts
interface ObtenerSucursalData {
  pId: number;
  pOrganizacionId: number;
}
```

Uso:

```ts
const request: GetRequest<ObtenerSucursalData> = {
  pProceso: 'SUCURSAL_OBTENER',
  data: {
    pId: 1,
    pOrganizacionId: 10
  }
};
```

---

## 12. Construcción del GET

El `GetClient` deberá:

1. Recibir un objeto `GetRequest`.
2. Serializarlo a JSON.
3. Codificarlo correctamente para URL.
4. Agregarlo como parámetro `request`.
5. Obtener el Token.
6. Agregar `Authorization: Bearer {token}`.
7. Ejecutar el GET.
8. Procesar la respuesta.

Conceptualmente:

```ts
getClient.execute({
  pProceso: 'SUCURSAL_OBTENER',
  data: {
    pId: 1,
    pOrganizacionId: 10
  }
});
```

Deberá generar una solicitud equivalente a:

```text
GET /api/handler/consultar?request={JSON_ENCODED}
```

Se deberá utilizar una herramienta segura de construcción de URL, por ejemplo:

```ts
URLSearchParams
```

No se deberá concatenar manualmente el JSON sin codificación.

Ejemplo conceptual:

```ts
const params = new URLSearchParams({
  request: JSON.stringify(request)
});
```

---

## 13. GetClient y Token

El `GetClient` deberá enviar el Token obtenido mediante `AuthClient`.

Header:

```http
Authorization: Bearer {token}
```

Flujo:

```text
AuthClient
    │
    ▼
Auth API
    │
    ▼
Token
    │
    ▼
Token Storage
    │
    ▼
GetClient
    │
    ▼
Authorization: Bearer Token
    │
    ▼
GET /api/handler/consultar
```

El `GetClient` no deberá solicitar nuevamente username y password.

---

## 14. PostClient

El `PostClient` será responsable de ejecutar comandos contra:

```http
POST /api/handler/procesar
```

URL base:

```text
${VITE_API_BASE_URL}/api/handler/procesar
```

El endpoint recibe el contenido del proceso en el Body.

Ejemplo real:

```text
POST https://anotalo-ws.sniperbot.com.ar:5094/api/handler/procesar
```

Body:

```json
{
  "pProceso": "ProspectoRegistrarConsulta",
  "pNombre": "Juan",
  "pApellido": "Perez",
  "pRazonSocial": "Tech SA",
  "pCargo": "Developer",
  "pEmail": "juan.perez@test.com",
  "pTelefono": "1155667788",
  "pMensaje": "Consulta de prueba desde Postman"
}
```

---

## 15. Particularidad del Body POST

El backend actual recibe el contenido del POST como un JSON serializado.

El ejemplo de Postman representa el Body como:

```text
"{"pProceso":"ProspectoRegistrarConsulta", ... }"
```

Esto significa que el cliente deberá evaluar correctamente el Content-Type y contrato real del endpoint.

La implementación deberá respetar el formato que actualmente acepta el backend.

Si el endpoint requiere:

```text
application/json
```

con un objeto JSON:

```json
{
  "pProceso": "ProspectoRegistrarConsulta",
  "pNombre": "Juan"
}
```

se deberá enviar:

```ts
JSON.stringify(request)
```

Si el contrato requiere explícitamente un JSON representado como string JSON, se deberá implementar:

```ts
JSON.stringify(JSON.stringify(request))
```

La decisión deberá basarse en el comportamiento real del endpoint y en la prueba exitosa de Postman.

La implementación no deberá asumir el formato sin validarlo.

---

## 16. PostRequest

Se deberá crear un modelo genérico para los comandos.

Debido a que cada proceso puede tener parámetros diferentes, inicialmente se podrá utilizar:

```ts
export interface PostRequest<TData = Record<string, unknown>> {
  pProceso: string;
  data?: TData;
}
```

Sin embargo, dado que el endpoint actual muestra que los parámetros de negocio están directamente en el objeto raíz:

```json
{
  "pProceso": "ProspectoRegistrarConsulta",
  "pNombre": "Juan",
  "pApellido": "Perez",
  "pRazonSocial": "Tech SA"
}
```

se recomienda que el modelo genérico sea:

```ts
export type PostRequest<TData extends object = Record<string, unknown>> =
  TData & {
    pProceso: string;
  };
```

Ejemplo:

```ts
interface ProspectoRegistrarConsultaRequest {
  pProceso: 'ProspectoRegistrarConsulta';
  pNombre: string;
  pApellido: string;
  pRazonSocial: string;
  pCargo: string;
  pEmail: string;
  pTelefono: string;
  pMensaje: string;
}
```

Esto permite mantener un contrato tipado específico para cada proceso.

---

## 17. Ejemplo PostClient

El Service podrá utilizar:

```ts
postClient.execute({
  pProceso: 'ProspectoRegistrarConsulta',
  pNombre: 'Juan',
  pApellido: 'Perez',
  pRazonSocial: 'Tech SA',
  pCargo: 'Developer',
  pEmail: 'juan.perez@test.com',
  pTelefono: '1155667788',
  pMensaje: 'Consulta de prueba desde Postman'
});
```

El `PostClient` será responsable de:

1. Recibir el request.
2. Obtener el Token.
3. Agregar Authorization.
4. Serializar el Body.
5. Ejecutar POST.
6. Procesar la respuesta.
7. Propagar errores.

---

## 18. PostClient y Token

Toda solicitud POST protegida deberá incluir:

```http
Authorization: Bearer {token}
```

El flujo será:

```text
AuthClient
    │
    ▼
Token
    │
    ▼
Token Storage
    │
    ▼
PostClient
    │
    ├── Bearer Token
    ├── Content-Type
    └── Body JSON
    │
    ▼
POST /api/handler/procesar
```

El `PostClient` no deberá conocer:

- Username.
- Password.
- Login.
- Auth Endpoint.

Solamente deberá utilizar el Token disponible.

---

## 19. Separación Auth / GET / POST

La infraestructura deberá respetar:

```text
┌──────────────────────┐
│      AuthClient      │
│                      │
│ POST /api/auth/login │
│                      │
│ username             │
│ password             │
└──────────┬───────────┘
           │
           ▼
         TOKEN
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌──────────┐ ┌──────────┐
│GetClient │ │PostClient│
│          │ │          │
│ GET      │ │ POST     │
│ consultar│ │ procesar │
└────┬─────┘ └────┬─────┘
     │             │
     ▼             ▼
   Query         Command
     │             │
     ▼             ▼
    SP            SP
```

---

## 20. Contrato de endpoints

### Auth

```text
POST /api/auth/login
```

Request:

```json
{
  "username": "usuario",
  "password": "password"
}
```

Response:

```json
{
  "token": "JWT..."
}
```

---

### GET

```text
GET /api/handler/consultar
```

Query:

```text
request={JSON}
```

Ejemplo:

```json
{
  "pProceso": "SUCURSAL_OBTENER",
  "data": {
    "pId": 1,
    "pOrganizacionId": 10
  }
}
```

Header:

```http
Authorization: Bearer {token}
```

---

### POST

```text
POST /api/handler/procesar
```

Body:

```json
{
  "pProceso": "ProspectoRegistrarConsulta",
  "pNombre": "Juan",
  "pApellido": "Perez",
  "pRazonSocial": "Tech SA",
  "pCargo": "Developer",
  "pEmail": "juan.perez@test.com",
  "pTelefono": "1155667788",
  "pMensaje": "Consulta de prueba desde Postman"
}
```

Header:

```http
Authorization: Bearer {token}
```

---

## 21. Arquitectura de Services

Los Services deberán ser responsables de definir el proceso.

Ejemplo GET:

```ts
export const sucursalService = {
  async obtener(id: number, organizacionId: number) {
    return getClient.execute({
      pProceso: 'SUCURSAL_OBTENER',
      data: {
        pId: id,
        pOrganizacionId: organizacionId
      }
    });
  }
};
```

El Service sabe:

```text
pProceso = SUCURSAL_OBTENER
```

El Service NO sabe:

- Cómo se codifica la URL.
- Cómo se agrega el Token.
- Cómo se construye Authorization.
- Cómo se ejecuta fetch.
- Cómo se maneja HTTP.

Ejemplo POST:

```ts
export const prospectoService = {
  async registrarConsulta(data: ProspectoRegistrarConsultaRequest) {
    return postClient.execute({
      pProceso: 'ProspectoRegistrarConsulta',
      ...data
    });
  }
};
```

El Service conoce:

```text
pProceso = ProspectoRegistrarConsulta
```

El `PostClient` conoce:

```text
POST /api/handler/procesar
Bearer Token
Content-Type
JSON.stringify
```

---

## 22. Regla de responsabilidades

La separación definitiva será:

```text
Service
    │
    │ Decide QUÉ proceso ejecutar
    ▼
API Client
    │
    │ Decide CÓMO comunicarse
    ▼
Backend
    │
    ▼
Proceso
    │
    ▼
Stored Procedure
```

Por lo tanto:

```text
SUCURSAL_OBTENER
    ↓
sucursalService
    ↓
GetClient
```

y:

```text
ProspectoRegistrarConsulta
    ↓
prospectoService
    ↓
PostClient
```

---

## 23. Estructura de archivos propuesta

```text
src/
├── api/
│   ├── clients/
│   │   ├── authClient.ts
│   │   ├── getClient.ts
│   │   └── postClient.ts
│   │
│   ├── config/
│   │   └── apiConfig.ts
│   │
│   ├── types/
│   │   ├── authRequest.ts
│   │   ├── authResponse.ts
│   │   ├── getRequest.ts
│   │   ├── postRequest.ts
│   │   ├── apiResponse.ts
│   │   └── apiError.ts
│   │
│   └── index.ts
│
├── services/
│   ├── auth/
│   │   └── authService.ts
│   │
│   ├── sucursal/
│   │   └── sucursalService.ts
│   │
│   └── prospecto/
│       └── prospectoService.ts
```

Los Services se irán incorporando en Specs posteriores.

---

## 24. Resultado esperado

Al finalizar esta Spec se deberá poder realizar:

### Login

```text
AuthClient
    ↓
POST /api/auth/login
    ↓
username + password
    ↓
Token
```

### Consulta

```text
GetClient
    ↓
GET /api/handler/consultar
    ↓
request={JSON}
    ↓
Bearer Token
    ↓
Backend
```

### Comando

```text
PostClient
    ↓
POST /api/handler/procesar
    ↓
JSON Body
    ↓
Bearer Token
    ↓
Backend
```

---

## 25. Criterios de aceptación

### Environment

- [ ] Existe `VITE_API_BASE_URL`.
- [ ] La URL base no está hardcodeada.
- [ ] Existe `.env.example`.
- [ ] El entorno productivo está configurado.
- [ ] La arquitectura permite agregar nuevos entornos.

### Auth

- [ ] `AuthClient` implementado.
- [ ] POST `/api/auth/login`.
- [ ] Body JSON.
- [ ] `username`.
- [ ] `password`.
- [ ] Response tipada.
- [ ] Token obtenido correctamente.

### GET

- [ ] `GetClient` implementado.
- [ ] GET `/api/handler/consultar`.
- [ ] Parámetro `request`.
- [ ] Request serializado como JSON.
- [ ] URL correctamente encoded.
- [ ] Bearer Token agregado automáticamente.

### POST

- [ ] `PostClient` implementado.
- [ ] POST `/api/handler/procesar`.
- [ ] Body construido según contrato.
- [ ] JSON serializado correctamente.
- [ ] Bearer Token agregado automáticamente.

### Arquitectura

- [ ] Auth separado de GET.
- [ ] GET separado de POST.
- [ ] Services no realizan HTTP directamente.
- [ ] Services definen `pProceso`.
- [ ] API Clients manejan HTTP.
- [ ] API Clients manejan Token.
- [ ] Componentes no acceden directamente a la API.
- [ ] Hooks no acceden directamente a `fetch`/`axios`.
- [ ] No existen URLs hardcodeadas.
