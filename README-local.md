# Pulga Shop - Instrucciones locales (PowerShell)

Este archivo explica cómo levantar la pila de integración (backend + Postgres + Redis + pgAdmin) desde la raíz del repo usando Docker Compose.

1) Archivos importantes en la raíz (copiados desde `Plan-integracion`):
- `docker-compose.yml`  (levanta backend, postgres, redis, pgadmin)
- `db_dump.sql`         (script de inicialización para Postgres)
- `.env.example`       (variables de entorno de ejemplo)
- `.dockerignore`      (evita copiar artefactos innecesarios al build)

2) Preparar entorno
- Copia `.env.example` a `.env` y ajusta valores si es necesario (no subir `.env` a VCS):
  ```powershell
  Copy-Item .env.example .env -Force
  ```

3) Levantar la pila (reconstruye imágenes):
```powershell
docker compose -f docker-compose.yml up -d --build
```

4) Verificar servicios:
```powershell
docker compose ps
curl http://localhost:16014/api
curl http://localhost:16014/docs
docker exec -it pulga_db psql -U postgres -d pulga_shop -c "\dt"
docker exec -it pulga-redis redis-cli ping
```

5) Generar token de prueba y llamar a un endpoint protegido (ejemplo):
```powershell
$token = (docker compose -f docker-compose.yml exec -T backend node -e "console.log(require('jsonwebtoken').sign({ sub: 123, email: 'correo@correo.com', role: 'vendedor' }, process.env.JWT_SECRET || 'EstoEsUnSecretoSuperSeguro', { expiresIn: '7d' }));").Trim()
Invoke-RestMethod -Uri 'http://localhost:16014/api/tiendas' -Headers @{ Authorization = "Bearer $token" } | ConvertTo-Json -Depth 5
```

6) Si todo funciona y deseas borrar `Plan-integracion`:
- Asegúrate de tener una copia de `db_dump.sql` y de tu `docker-compose.yml` en la raíz.
- Apaga y elimina contenedores/volúmenes:
```powershell
docker compose -f docker-compose.yml down --volumes --remove-orphans
```
- Si todo OK, puedes eliminar la carpeta `Plan-integracion` manualmente.

7) Notas de depuración rápidas
- Si el backend falla por `Cannot find module '../../generated/prisma'`, asegúrate de que la imagen fue reconstruida y que `generated` fue copiado (ver Dockerfile). Rebuild con `--build`.
- Si `/docs` devuelve 404, confirma que `docs/docs.yaml` existe en la raíz del proyecto antes de build o que `docs/` fue copiado a la imagen.
- Si hay conflicto con el nombre del container `pulga-redis`, remueve el container previo:
  ```powershell
  docker rm -f pulga-redis
  ```
