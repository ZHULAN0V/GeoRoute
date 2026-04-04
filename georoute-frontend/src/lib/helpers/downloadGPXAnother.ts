const createXmlStringAnother = (lines: [number, number][][]): string => {
  const renderedLines: string[][] = [];
  const result: string[] = [];

  for (const line of lines) {
    renderedLines.push([])
    for (const point of line) {
      renderedLines[renderedLines.length - 1].push(`<trkpt lat="${point[0]}" lon="${point[1]}"></trkpt>`)
    }
    result.push(`  <trkseg>
    ${renderedLines[renderedLines.length - 1].join('\n    ')}
  </trkseg>`);
  }

  return `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" creator="GraphHopper" version="1.1" xmlns:gh="https://graphhopper.com/public/schema/gpx/1.1">

<metadata>
<copyright author="OpenStreetMap contributors"/>
<link href="http://graphhopper.com"><text>GraphHopper GPX</text></link>
<time>2026-03-29T11:47:59.663Z</time>
</metadata>

<trk>
<name>GraphHopper Track</name><desc></desc>
${result.join('\n')}
</trk>

</gpx>`
}

export default createXmlStringAnother;