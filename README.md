# README

Este proyecto trata de hacer scraping a la web https://www.livescore.com/en/ para obtener los ultimos partidos jugados por un equipo/seleccion. Ademas permite subscribirse a uno o más equipos y recibir notificaciones en tiempo real cuando los partidos esten en vivo.

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

Para suscribirse a notificaciones de un equipo:

1. Ejecutar endpoint `/api/livescore/searchTeams?query=` donde query es el nombre del equipo
2. Ejecutar endpoint `/api/subscription/subscriptionTeam` y en el body enviar la id del equipo al que se quiere suscribir:
```
{
    id: 1
}
```

Y en el header user_id (puede ser cualquier valor entero)

```
user_id: 1
```

3. Abrir en el navegador `http://localhost:3001` e ingresar la user_id anterior

# Condiciones de notificación

1. Se enviara una notificación 30 minutos antes de que comience el partido
2. Se enviaran notificaciones por cada Gol, Tarjeta amarilla, Tarjeta Roja, Doble tarjeta amarilla y autogol del equipo local y visitante que transcurra durante la duración del partido.

# Información offline

Para obtener información sobre partidos pasados y proximo partido ejecutar el endpoint `/api/team/getLastMatchByTeam?id=` id del equipo del que quieres tener la información.

Para obtener la tabla de posiciones de una liga

1. Ejecutar el endpoint `/api/livescore/searchLeague?query=` donde query es el valor del nombre de la liga.
2. Ejecutar el endpoint `/api/league/getTableFromLeague?id` con el id de la liga.



