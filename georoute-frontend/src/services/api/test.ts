import axios from "axios";

const getTest = async () => {
  const gpxData = `
<gpx>
  <trk>
    <trkseg>
      <trkpt lat="56.8" lon="60"></trkpt>
      <trkpt lat="56.9" lon="60"></trkpt>
    </trkseg>
  </trk>
</gpx>`;

  try {
    const response = await axios.post(
      '/api/routes/match',
      gpxData,
      {
        headers: {
          'Content-Type': 'application/gpx+xml'
        },
        params: {
          profile: 'foot',
          type: 'json',
          points_encoded: 'LineString'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error matching GPX track:');
    throw error;
  }
};

export { getTest };
