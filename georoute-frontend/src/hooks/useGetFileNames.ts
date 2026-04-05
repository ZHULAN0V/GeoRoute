import { useQuery } from "@tanstack/react-query";
import { getFileNames } from "../services/api/gpxSevice";

export const useGetFileNames = (options = {}) => {
  return useQuery({
    queryKey: ['fileNames'], 
    queryFn: () => getFileNames(),
    ...options, 
  });
};