import type { IPath } from "../../services/types/Path";

function parseGpxIntoPathJSON(gpxString: string): IPath {
  // Создаём DOM‑парсер
  const parser = new DOMParser();
  const doc = parser.parseFromString(gpxString, 'text/xml');

  // Проверяем на ошибки парсинга
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid GPX file: ' + parseError.textContent);
  }

  // Находим все треки (<trk>)
  const extensions = doc.querySelector('gpx > extensions');

  const parsedPath = JSON.parse(extensions?.textContent || '') as IPath

  return parsedPath;
}

export default parseGpxIntoPathJSON;
