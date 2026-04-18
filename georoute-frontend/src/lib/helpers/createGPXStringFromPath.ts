import type { IPath, IPathVariant } from "../../services/types/Path";

// создает gpx файл с несколькими данными
// 1. основной маршрут 
// 2. все альтернативные маршруты (если есть)
// 3. все маркеры, контрольные точки в которых начинается и заканчивается вариант маршрута
const createGPXStringFromPath = (path: IPath): string => {
  const paths = Object.values(path.variants);
  const markers = Object.values(path.markers);

  const pathsString = paths.map(variant => {
    const pathPointsString = Object.values(variant.path).map(point => `  <trkpt lat="${point.lat}" lon="${point.lng}">
  <extensions>${JSON.stringify(point)}</extensions>
  </trkpt>`).join('\n');

    // todo добавить extensions с metadata
    return `<trkseg>
${pathPointsString}
  <extensions>${JSON.stringify({...variant, path: {}} as IPathVariant)}</extensions>
</trkseg>`;
  }).join('\n');

  const markersString = markers.map(marker => `<wpt lat="${marker.lat}" lon="${marker.lng}">
  <extensions>${JSON.stringify(marker)}</extensions>
</wpt >`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" creator="GraphHopper" version="1.1" xmlns:gh="https://graphhopper.com/public/schema/gpx/1.1">

<metadata>
<copyright author="OpenStreetMap contributors"/>
<link href="http://graphhopper.com"><text>GraphHopper GPX</text></link>
<time>${new Date().toISOString()}</time>
</metadata>

<trk>
<name>GraphHopper Track</name>
${pathsString}
</trk>

${markersString}
  <extensions>${JSON.stringify({...path, variants: {}, markers: {}} as IPath)}</extensions>
</gpx>`
}

export default createGPXStringFromPath;