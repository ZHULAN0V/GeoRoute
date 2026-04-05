import { useRef, useState } from 'react';
import parseGpxToCoordinates from '../../lib/helpers/parseGpxIntoArray';
import { Button } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import styles from './importGpxButton.module.css';
import { useDispatch } from 'react-redux';
import { addPathFromImport } from '../../providers/paths/path-reducer';

const GpxUploadButton = () => {
  const dispatch = useDispatch();
  
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // можно вынести в отдельный хук?
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setError('');
    try {
      // Проверяем расширение файла
      if (!file.name.toLowerCase().endsWith('.gpx')) {
        throw new Error('Выбранные файл не является GPX файлом');
      }

      // Читаем содержимое файла
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const gpxContent = e.target?.result;
          const parsedCoordinates = parseGpxToCoordinates(String(gpxContent));
          dispatch(addPathFromImport({points: parsedCoordinates}));
        } catch (parseError: Error | unknown) {
          setError('Error parsing GPX file: ' + (parseError as Error).message);
        }
      };
      reader.onerror = () => {
        setError('Error reading file');
      };
      reader.readAsText(file);
    } catch (err: Error | unknown) {
      setError((err as Error).message);
    }
  };

  const handleClick = () => {
    // Очищаем предыдущие данные
    setFileName('');
    setError('');
    inputRef.current?.click();
  };

  return (
    <div className={styles.block}>
      <input
        id="gpx-file-input"
        ref={inputRef}
        type="file"
        accept=".gpx"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <Button
        onClick={handleClick}
        startIcon={<FileUploadIcon/>} 
        variant={'contained'}
      >
        Upload GPX File
      </Button>

      {fileName && <div className={styles.name}> <p>{fileName}</p> </div> }
      {error && <div className={styles.error}> <p>{error}</p> </div> }
    </div>
  );
};

export default GpxUploadButton;
