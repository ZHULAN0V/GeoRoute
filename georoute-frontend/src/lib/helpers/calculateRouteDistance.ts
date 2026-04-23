/**
 * Рассчитывает длину маршрута в километрах по массиву географических координат.
 * Использует формулу гаверсинусов для расчёта расстояния между точками на сфере.
 *
 * @param coordinates - массив пар [широта, долгота] в градусах
 * @returns длина маршрута в километрах (округлено до 3 знаков после запятой)
 */
function calculateRouteDistance(coordinates: [number, number][]): number {
  // Если точек меньше двух, маршрут не может существовать
  if (coordinates.length < 2) {
    return 0;
  }

  const EARTH_RADIUS_KM = 6371; // Средний радиус Земли в километрах
  let totalDistance = 0;

  // Функция для перевода градусов в радианы
  const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

  // Проходим по всем последовательным парам точек
  for (let i = 0; i < coordinates.length - 1; i++) {
    const [lat1, lon1] = coordinates[i];
    const [lat2, lon2] = coordinates[i + 1];

    // Переводим координаты в радианы
    const φ1 = toRadians(lat1);
    const λ1 = toRadians(lon1);
    const φ2 = toRadians(lat2);
    const λ2 = toRadians(lon2);

    // Разницы широт и долгот
    const Δφ = φ2 - φ1;
    const Δλ = λ2 - λ1;

    // Формула гаверсинусов
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = EARTH_RADIUS_KM * c;

    totalDistance += distance;
  }

  return Number(totalDistance.toFixed(2));
}

export default calculateRouteDistance