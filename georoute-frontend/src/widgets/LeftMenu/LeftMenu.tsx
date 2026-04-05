import PathItem from "../../components/PathItem/PathItem";
import styles from "./leftMenu.module.css"
import { MenuItem, Select, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../providers/store";
import { useCallback, useEffect } from "react";
import { addPath } from "../../providers/paths/path-reducer";
import type { IPath } from "../../services/types/Path";
import GpxUploadButton from "../../components/ImportGpxButton/ImportGpxButton";
import getArrayOfPoints from "../../lib/helpers/getArrayOfPoints";
import createXmlString from "../../lib/helpers/downloadGPX";
import { useGetFileNames } from "../../hooks/useGetFileNames";
import { loadPathsFromNames } from "../../lib/helpers/updatePathsAsync";


function LeftMenu() {
  const pathObject = useSelector((state: RootState) => state.pathObject.paths)
  const dispatch = useDispatch();

  const {data: fileNamesData, isSuccess} = useGetFileNames();

  const handleIncrement = useCallback(() => {
    const id = crypto.randomUUID();
    const variantId = crypto.randomUUID();
    dispatch(addPath({
      id: id,
      name: `path ${id.slice(0, 2)}.gpx`,
      color: '#ff6a6a',
      distance: 0,
      checked: true,
      main: [],
      variants: {
        [variantId]: {
          id: variantId,
          pathId: id,
          name: 'Вариант 1',
          color: '#ff6a6a',
          distance: 0,
          checked: true,
          path: {},
        }
      },
    }
  ))}, [dispatch])

  // todo можно вынести в отдельный компонент с кнопкой
  const handleDownload = () => {
    const pathsArray = getArrayOfPoints(pathObject);
    const pdfUrl = 'data:text/json;charset=utf-8,' + createXmlString(pathsArray);
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "paths.gpx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (isSuccess) {
      loadPathsFromNames(fileNamesData, dispatch);
    }
  }, [dispatch, fileNamesData, isSuccess]);
  
  return (
    <div className={styles['left-menu']}>
      <p>Меню маршрутов</p>
      <Select 
        value={'open'}
        sx={{backgroundColor: '#ffffff'}}
        size={'small'}
      >
        <MenuItem value={'open'}>Open street maps</MenuItem>
        <MenuItem value={'yandex'}>Yandex maps</MenuItem>
        <MenuItem value={'google'}>Google maps</MenuItem>
      </Select>
      <p>Список маршрутов</p>
      <div className={styles['list']}>
        {/* {paths.map((path) => <PathItem key={path.id} path={path}/>)} */}
        {Object.values(pathObject).map((path: IPath) => <PathItem key={path.id} path={path}/>)}
      </div>
      <Button 
        startIcon={<AddIcon/>} 
        sx={{marginTop: -1}}
        onClick={handleIncrement}
      >
        Добавить маршрут
      </Button>

      <div className={styles['buttons']}>
        <div className={styles['up-buttons']}>
          <Button onClick={handleDownload} startIcon={<DownloadIcon/>} variant={'contained'}>GPX</Button>
          <Button startIcon={<DownloadIcon/>} variant={'outlined'}>KML</Button>
        </div>
        <GpxUploadButton/>
      </div>
    </div>
  )
}

export default LeftMenu;