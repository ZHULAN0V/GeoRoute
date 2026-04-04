import PathItem from "../../components/PathItem/PathItem";
import styles from "./leftMenu.module.css"
import { MenuItem, Select, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../providers/store";
import { useCallback, useEffect } from "react";
import { addPath } from "../../providers/paths/path-reducer";
import type { IPath } from "../../services/types/Path";
import { initialId } from "../../lib/helpers/initialState";
import { chosePathId, unchosePathId } from "../../providers/paths/current-path-id-reducer";
import { randomRouteHexColor } from "../../lib/helpers/routeColors";
import getArrayOfPoints from "../../lib/helpers/getArrayOfPoints";
import createXmlStringAnother from "../../lib/helpers/downloadGPXAnother";

function LeftMenu() {
  const pathObject = useSelector((state: RootState) => state.pathObject.paths)
  const dispatch = useDispatch();

  const handleIncrement = useCallback(() => {
    const id = crypto.randomUUID();
    const color = randomRouteHexColor();
    const newPath: IPath = {
      id,
      name: 'Новый маршрут',
      color,
      checked: true,
      markers: {},
      segments: {},
    };
    dispatch(addPath(newPath));
  }, [dispatch])

  const handleDownload = () => {
    const pathsArray = getArrayOfPoints(pathObject);
    const pdfUrl = 'data:text/json;charset=utf-8,' + createXmlStringAnother(pathsArray);
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "paths.gpx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    dispatch(chosePathId(initialId))
    return () => {
      dispatch(unchosePathId())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles['left-menu']}>
      <p>Меню маршрутов</p>
      <Select
        value={'open'}
        sx={{ backgroundColor: '#ffffff' }}
        size={'small'}
      >
        <MenuItem value={'open'}>Open street maps</MenuItem>
        <MenuItem value={'yandex'}>Yandex maps</MenuItem>
        <MenuItem value={'google'}>Google maps</MenuItem>
      </Select>
      <p>Список маршрутов</p>
      <div className={styles['list']}>
        {Object.values(pathObject).map((path: IPath) => <PathItem key={path.id} path={path} />)}
      </div>
      <Button
        startIcon={<AddIcon />}
        sx={{ marginTop: -1 }}
        onClick={handleIncrement}
      >
        Добавить маршрут
      </Button>

      <div className={styles['buttons']}>
        <div className={styles['up-buttons']}>
          <Button onClick={handleDownload} startIcon={<DownloadIcon />} variant={'contained'}>GPX</Button>
          <Button startIcon={<DownloadIcon />} variant={'outlined'}>KML</Button>
        </div>
        <Button startIcon={<FileUploadIcon />} variant={'contained'}>Загрузить GPX</Button>
      </div>
    </div>
  )
}

export default LeftMenu;
