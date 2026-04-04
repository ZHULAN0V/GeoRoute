import axios from "axios";

const getFiles = () => {
  const result = axios.get("http://localhost:8989/api/1.0/routes", {

  })
    .then(res => res.data)

  return result;
}

const postGpx = async (gpxData: string, apiKey: string) => {
  try {
    const response = await axios.post(
      'http://localhost:8989/api/1/match/',
      gpxData,
      {
        params: {
          profile: 'car',
          key: apiKey
        },
        headers: {
          'Content-Type': 'application/gpx+xml'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при сопоставлении маршрута:', error);
    throw error;
  }
};

export {
  getFiles, 
  postGpx
};