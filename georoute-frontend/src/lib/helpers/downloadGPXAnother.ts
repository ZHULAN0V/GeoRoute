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

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<gpx version="1.1" creator="https://google.com" xmlns="http://www.topografix.com/GPX/1/1">
${result.join('\n')}
</gpx>`
}

export default createXmlStringAnother;