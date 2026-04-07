import type { IPath } from "../../services/types/Path";

// создает gpx файл с несколькими данными
// 1. основной маршрут 
// 2. все альтернативные маршруты (если есть)
// 3. все маркеры, контрольные точки в которых начинается и заканчивается вариант маршрута
const createGPXStringFromPath = (path: IPath): string => {
  const paths = Object.values(path.variants).map(x => Object.values(x.path).map(y => [ y.lat, y.lng ] as [number, number]));
  const markers = Object.values(path.markers).map(x => [ x.lat, x.lng ] as [number, number]);

  const pathsString = paths.map(path => {
    const pathPointsString = path.map(point => `  <trkpt lat="${point[0]}" lon="${point[1]}"></trkpt>`).join('\n');
    return `<trkseg>
${pathPointsString}
</trkseg>`;
  }).join('\n');

  const markersString = markers.map(marker => `<wpt  lat="${marker[0]}" lon="${marker[1]}"></wpt >`).join('\n');

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

</gpx>`
}

export default createGPXStringFromPath;