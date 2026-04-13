import axios from "axios";

// todo добавить тип возвращаемого значения
// нужно его взять из документации graphHopper
const getMatchedPath = async (gpxData: string) => {
  try {
    const response = await axios.post(
      '/api/routes/match',
      gpxData,
      {
        headers: {
          'Content-Type': 'application/gpx+xml'
        },
        params: {
          profile: 'foot', // тип маршрута 1 из следующих: foot, bike, car
          gps_accuracy: 20, // точность маршрута в метрах
          type: 'json',
          points_encoded: 'LineString'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Ошибка при сопоставлении маршрута:', error);
    throw error;
  }
};

export { getMatchedPath };