# GeoRoute

Приложение для управления маршрутами «Майской прогулки».

## Быстрый старт

1. Скачайте файл с необходимой картой и разместите её по пути:

   `src/main/resources/graphhopper/maps/map.osm.pbf`
   
   Например, карту Уральского федерального округа можно загрузить
   с [Geofabrik](https://download.geofabrik.de/russia.html).

2. Разверните необходимое окружение:

   ```bash
   docker compose up
   ```
   
   При первом запуске может понадобиться некоторое время на инициализацию кэша GraphHopper.

3. Запустите приложение:

   ```bash
   ./mvnw spring-boot:run
   ```
   
## Стек технологий

- Java 17, Spring Boot 4, Maven
- Docker Compose
- GraphHopper
