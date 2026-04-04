const createXmlString = (lines: [number, number][][]): string => {
  const renderedLines: string[][] = [];
  const result: string[] = [];

  for (const line of lines) {
    renderedLines.push([`    <name>0.62 mi route</name>`])
    for (const point of line) {
      renderedLines[renderedLines.length - 1].push(`<rtept lat="${point[0]}" lon="${point[1]}"/>`)
    }
    result.push(`  <rte>
      ${renderedLines[renderedLines.length - 1].join('\n    ')}
  </rte>`);
  }

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<gpx version="1.1" creator="https://google.com" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>0.62 mi route</name>
    <link href="https://google.com">
      <text>My Map</text>
    </link>
    <time>2026-04-22T20:10:34.445Z</time>
    <copyright author="May Maps Ekaterinburg">
      <year>2026</year>
    </copyright>
  </metadata>
  ${result.join('\n')}
</gpx>`
}

export default createXmlString;