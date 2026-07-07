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
