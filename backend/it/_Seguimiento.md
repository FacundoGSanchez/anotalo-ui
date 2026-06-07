## Arquitectura

### API Backend

- Se basa en los siguientes endpoint
  - Auth Login
  - Get de Consultas
  - POST para Insert y Update
- UrlDesarrollo: https://anotalo-ws.sniperbot.com.ar:5094/index.html

### Esquema de Consumo

- Debemos consumir endpoint con un {nombreProceso} | {jsonParam}
- Siempre se envia Json y Devuelve Json

### Preparacion de Datos

- Para utilizar patron de "SPs" debemos:
  - Crear Script de Tabla
  - Crear Script de SP (Consulta o Comandos)
  - Crear Script para insertar SP en tabla Handler

## Seguidad API

- La api está segurizada, tenés que generar un token con un usuario y contraseña:

- Ejemplo POST obtener Token
  curl -X 'POST' \
   'http://localhost:63476/api/auth/login' \
   -H 'accept: text/plain' \
   -H 'Content-Type: application/json' \
   -d '{
  "username": "usr_anotalo",
  "password": "Anot@lo924!"
  }'

#### Ejemplo GET (Consultas)

'http://localhost:63476/api/handler/consultar?request=%20%7B%22pProceso%22%3A%22ProspectoObtenerConsultas%22%7D' \
 -H 'accept: /' \
 -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InVzcl9hbm90YWxvIiwibmJmIjoxNzc1MTY1ODgyLCJleHAiOjE3NzUxNzMwODIsImlhdCI6MTc3NTE2NTg4Mn0.2MPCLP_3yJ2j6wadwsU_hGU6D8KrxAHfn8VAuOMrJKk'
