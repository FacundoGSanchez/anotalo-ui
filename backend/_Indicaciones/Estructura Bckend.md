## Arquitectura

### API Backend

- Se basa en los siguientes endpoint
  - Auth Login
  - Get de Consultas
  - POST para Insert y Update
- UrlDesarrollo: https://anotalo-ws.sniperbot.com.ar:5094/index.html

### Esquema de Response y Request

- Debemos consumir endpoint con un {nombreProceso} | {jsonParam}
- Siempre se envia Json y Devuelve Json

### Preparacion de Datos

- Crear Tabla con Scrip DDL - Tabla
- Para utilizar patron de "SPs" debemos:
  - Crear Script de Tabla - Ejempos
  - Crear Script de SP
    - Query => @Script DLL - Query
    - Comand => @Script DLL - Comand
  - Crear Script para insertar SP en tabla Handler administra los SP
