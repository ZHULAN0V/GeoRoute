import type { IMarker } from "../../services/types/Path";

function parseGPXIntoMarkersJSON(gpxString: string): IMarker[] {
  // Создаём DOM‑парсер
  const parser = new DOMParser();
  const doc = parser.parseFromString(gpxString, 'text/xml');

  // Проверяем на ошибки парсинга
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid GPX file: ' + parseError.textContent);
  }

  const waypoints = doc.querySelectorAll('wpt');
  const markers: IMarker[] = [];

  waypoints.forEach(waypoint => {
    const pasedMarker = JSON.parse(waypoint.querySelector('extensions')?.textContent || '') as IMarker;
    markers.push(pasedMarker);
  });

  return markers;
}

export default parseGPXIntoMarkersJSON;
