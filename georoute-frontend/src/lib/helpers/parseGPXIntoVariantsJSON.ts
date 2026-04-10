import type { IPathVariant, IPoint } from "../../services/types/Path";

function parseGpxIntoVariantsJSON(gpxString: string): IPathVariant[] {
  // Создаём DOM‑парсер
  const parser = new DOMParser();
  const doc = parser.parseFromString(gpxString, 'text/xml');

  // Проверяем на ошибки парсинга
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid GPX file: ' + parseError.textContent);
  }

  // Находим все треки (<trk>)
  const track = doc.querySelector('trk');
  if (!track) {
    return [];
  }

  const trackSegments = track.querySelectorAll('trkseg');
  const result: IPathVariant[] = []

  trackSegments.forEach(segment => {
    const variant = JSON.parse(segment.querySelector('trkseg > extensions')?.textContent || '') as IPathVariant;
    console.log('variant: ', variant);
    // Ищем точки трека (<trkpt>) внутри сегмента с учётом namespace
    const points = segment.querySelectorAll(`trkpt`);

    points.forEach(point => {
      const parsedPoint = JSON.parse(point.querySelector('extensions')?.textContent || '') as IPoint;
      if (parsedPoint) {
        variant.path[parsedPoint.id] = parsedPoint;
      }
    });

    // Добавляем сегмент в результат, только если в нём есть точки
    result.push(variant);
  });

  return result;
}

export default parseGpxIntoVariantsJSON;
