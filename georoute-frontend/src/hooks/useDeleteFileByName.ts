import { useMutation } from "@tanstack/react-query";
import { deleteFileByName } from "../services/api/gpxSevice";

export const useDeleteFileByName = (options = {}) => {
  return useMutation({
    mutationKey: ['deleteFile'],
    mutationFn: (data: { fileName: string }) => deleteFileByName(data.fileName),
    retry: 3,
    ...options 
  });
};