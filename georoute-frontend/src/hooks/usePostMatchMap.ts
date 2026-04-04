import { useMutation } from "@tanstack/react-query";
import { postGpx } from "../services/api/gpxSevice";

export const useMatchRouteMutation = (options = {}) => {
  return useMutation({
    mutationKey: ['matchRoute'], // ключ мутации
    mutationFn: (data: { gpxData: string; apiKey: string }) => postGpx(data.gpxData, data.apiKey), // функция запроса
    retry: 3, // количество попыток при неудаче
    onSuccess: (data) => {
      console.log('Маршрут успешно сопоставлен:', data);
      // Дополнительная логика при успехе (например, обновление кэша)
    },
    onError: (error) => {
      console.error('Ошибка при сопоставлении маршрута:', error);
      // Обработка ошибок (например, показ уведомления)
    },
    ...options // дополнительные опции от пользователя
  });
};