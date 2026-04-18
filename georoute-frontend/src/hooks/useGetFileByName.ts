import { useQuery } from "@tanstack/react-query";
import { getFileByName } from "../services/api/gpxSevice";

export const useGetFile = (fileName: string, options = {}) => {
  return useQuery({
    queryKey: ['file', fileName],
    queryFn: () => getFileByName(fileName),
    ...options
  });
};