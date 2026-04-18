import { useMutation } from "@tanstack/react-query";
import { getMatchedPath } from "../services/api/graphHopperService";

// todo добавить тип options
export const useMatchRouteMutation = (options = {}) => {
  return useMutation({
    mutationKey: ['matchRoute'], 
    mutationFn: (data: { gpxData: string}) => getMatchedPath(data.gpxData), 
    retry: 3,
    ...options
  });
};