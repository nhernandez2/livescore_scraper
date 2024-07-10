# README

Este proyecto trata de hacer scraping a la web https://www.livescore.com/en/ para obtener los ultimos partidos jugados por un equipo/seleccion. Ademas permite subscribirse a uno o más equipos y recibir notificaciones en tiempo real cuando los partidos esten en vivo.

# Diagrama





# Dependencias

- Git
- Node 16 o superior
- Redis
- MySql para la base de datos

# Variables de entorno y secretos

Existe un archivo env.example con la lista de variables de entorno para ejecutar de manera local

```
    PORT=3000
    DOMAIN=https://www.livescore.com/en/
    BASE_API_LIVESCORE=https://search-api.livescore.com/api/v2/
    API_SEARCH=search/soccer
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_USER=
    DB_PASSWORD=
    DB_NAME=
    REDIS_URL=redis://localhost:6379
    CRON_SUBSCRIPTION='0 6 * * *'
    CRON_NEXT_MATCH='*/30 * * * *'
    CRON_LIVE_MATCH='*/1 * * * *'
```

# Instalación de manera local
1. Clonar el proyecto: `git clone https://github.com/nhernandez2/livescore_scraper.git`
2. Ejecutar `npm install`
3. Crear la base de datos: Copiar el archivo init.sql y ejecutarlo en la mysql local
4. Configurar el archivo .env con las variables que correspondan
5. Levantar servicio de mysql
6. Levantar servicio de redis (`redis-server`)
7. Ejecutar `npm run start-notifier`
8. Ejecutar `npm run start-worker`
9. Ejecutar `npm run start`

# Ejecución con Docker Compose

1. Ejecutar los comandos `docker-compose build` y `docker-compose up`

# Interactuar con el servicio

Tanto de manera local como por docker, debemos abrir `http://localhost:3001` y dentro de este sitio podremos suscribirnos con nuestra id de usuario.
