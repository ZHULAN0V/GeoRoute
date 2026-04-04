import { useQuery } from "@tanstack/react-query";
import { getFiles } from "../services/api/gpxSevice";

export const useGetPaths = (options = {}) => {
  return useQuery({
    queryKey: ['files'], // Уникальный ключ запроса
    queryFn: () => getFiles(),
    ...options // Дополнительные опции TanStack Query
  });
};