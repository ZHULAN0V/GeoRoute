function parseGPXIntoMarkers(gpxString: string): [number, number][] {
  // Создаём DOM‑парсер
  const parser = new DOMParser();
  const doc = parser.parseFromString(gpxString, 'text/xml');

  // Проверяем на ошибки парсинга
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid GPX file: ' + parseError.textContent);
  }

  // Находим все маркеры (<wpt>) с учётом namespace
  const waypoints = doc.querySelectorAll('wpt');
  const coordinates: [number, number][] = [];

  waypoints.forEach(waypoint => {
    const latStr = waypoint.getAttribute('lat');
    const lonStr = waypoint.getAttribute('lon');

    // Проверяем, что атрибуты существуют и валидны
    if (latStr !== null && lonStr !== null) {
      const lat = Number(latStr);
      const lon = Number(lonStr);

      // Проверяем, что координаты — числа
      if (!isNaN(lat) && !isNaN(lon)) {
        coordinates.push([lat, lon]);
      }
    }
  });

  return coordinates;
}

export default parseGPXIntoMarkers;
