import { useMutation } from "@tanstack/react-query";
import { postGpxFile } from "../services/api/gpxSevice";

export const usePostFile = (options = {}) => {
  return useMutation({
    mutationKey: ['postFile'], 
    mutationFn: (data: { gpxData: string; fileName: string }) => postGpxFile(data.gpxData, data.fileName),
    retry: 3,
    ...options
  });
};