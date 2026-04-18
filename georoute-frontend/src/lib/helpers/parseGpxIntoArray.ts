function parseGpxToCoordinates(gpxString: string): [number, number][] {
  // Создаём DOM‑парсер
  const parser = new DOMParser();
  const doc = parser.parseFromString(gpxString, 'text/xml');

  // Проверяем на ошибки парсинга
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid GPX file: ' + parseError.textContent);
  }

  // Находим все элементы trkpt
  const trkpts = doc.querySelectorAll('trkpt');
  const coordinates: [number, number][] = [];

  trkpts.forEach(trkpt => {
    const lat = Number(trkpt.getAttribute('lat'));
    const lon = Number(trkpt.getAttribute('lon'));

    // Проверяем, что координаты валидны
    if (!isNaN(lat) && !isNaN(lon)) {
      coordinates.push([lat, lon]);
    }
  });

  return coordinates;
}

export default parseGpxToCoordinates;
