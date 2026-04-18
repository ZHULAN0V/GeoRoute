function parseGpxIntoPaths(gpxString: string): [number, number][][] {
  // Создаём DOM‑парсер
  const parser = new DOMParser();
  const doc = parser.parseFromString(gpxString, 'text/xml');

  // Проверяем на ошибки парсинга
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid GPX file: ' + parseError.textContent);
  }

  // Находим все треки (<trk>)
  const tracks = doc.querySelectorAll('trk');
  const result: [number, number][][] = [];

  tracks.forEach(track => {
    // Находим все сегменты трека (<trkseg>)
    const trackSegments = track.querySelectorAll('trkseg');

    trackSegments.forEach(segment => {
      const segmentPoints: [number, number][] = [];
      // Ищем точки трека (<trkpt>) внутри сегмента с учётом namespace
      const points = segment.querySelectorAll(`trkpt`);

      points.forEach(point => {
        const latStr = point.getAttribute('lat');
        const lonStr = point.getAttribute('lon');

        // Проверяем, что атрибуты существуют и валидны
        if (latStr !== null && lonStr !== null) {
          const lat = Number(latStr);
          const lon = Number(lonStr);

          // Проверяем, что координаты — числа
          if (!isNaN(lat) && !isNaN(lon)) {
            segmentPoints.push([lat, lon]);
          }
        }
      });

      // Добавляем сегмент в результат, только если в нём есть точки
      if (segmentPoints.length > 0) {
        result.push(segmentPoints);
      }
    });
  });

  return result;
}

export default parseGpxIntoPaths;
