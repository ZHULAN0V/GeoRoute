import axios from "axios";

const getFileNames = async (): Promise<string[]> => {
  // const result = await axios.get("http://localhost:8080/api/v1/routes");
  const result = await axios.get("api/routes");
  return result.data;
}

const getFileByName = async (fileName: string): Promise<string> => {
  const result = await axios.get(`api/routes/${fileName}`);
  return result.data;
}

const postGpxFile = async (gpxData: string, fileName: string = 'path') => {
  const blob = new Blob([gpxData], { type: 'application/gpx+xml' });

  const file = new File([blob], fileName, {
    type: 'application/gpx+xml',
    lastModified: Date.now()
  });

  const formData = new FormData();
  formData.append('file', file, fileName); // Явно указываем имя файла

  const response = await axios.post(
    'api/routes',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return response.data;
};

const deleteFileByName = async (fileName: string): Promise<string> => {
  const result = await axios.delete(`api/routes/${fileName}`);
  return result.data
}

export {
  getFileNames, 
  getFileByName,
  postGpxFile,
  deleteFileByName
};