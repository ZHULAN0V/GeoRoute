import { useDispatch, useSelector } from "react-redux";
import styles from "./rightMenu.module.css"
import { TextField, Button } from "@mui/material";
import type { RootState } from "../../providers/store";
import { useEffect, useMemo, useState } from "react";
import { editPath } from "../../providers/redux-test/path-reducer";
import PathVariant from "../../components/PathVariant/PathVariant";
// import { createPathVariant2 } from "../../providers/redux-test/path-reducer";
// import { createPathVariant } from "../../providers/redux-test/current-path-reducer";
import { createPathVariant, editPathVariant } from "../../providers/paths/path-reducer";
import { useDebouncedCallback } from "use-debounce";
import AddIcon from '@mui/icons-material/Add';


function RightMenu() {
  const currentPathId = useSelector((state: RootState) => state.currentPathId.currentPathId);
  const currentPathVariantId = useSelector((state: RootState) => state.currentPathVariantId.currentPathVariantId);
  const pathObject = useSelector((state: RootState) => state.pathObject.paths);
  const path = useMemo(() => pathObject[currentPathId], [pathObject, currentPathId]);
  const dispatch = useDispatch();

  const [name, setName] = useState(path?.name || '');
  const [color, setColor] = useState(path?.color || '');
  const [variantName, setVariantName] = useState(path?.variants[currentPathVariantId]?.name || '');
  const [variantColor, setVariantColor] = useState(path?.variants[currentPathVariantId]?.color || '');

  // const onSavePath = () => {
  //   dispatch(editPath({...path!, name, color}));
  //   dispatch(editPathVariant({...path?.variants[currentPathVariantId], name: variantName, color: variantColor}));
  // }

  const debounced = useDebouncedCallback(() => {
      dispatch(editPath({...path!, name, color}));
      dispatch(editPathVariant({...path?.variants[currentPathVariantId], name: variantName, color: variantColor}));
    }, 300 );

  const onAddPathVariant = () => {
    const newItem = {
      id: crypto.randomUUID(),
      pathId: path?.id || '',
      name: path?.name || '',
      color: path?.color || '#000000',
      distance: 0,
      checked: false,
      path: {},
    };
    dispatch(createPathVariant(newItem));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVariantName(path?.variants[currentPathVariantId]?.name || '');
    setVariantColor(path?.variants[currentPathVariantId]?.color || '');
  }, [currentPathVariantId, path?.variants])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(path?.name || '');
    setColor(path?.color || '');
  }, [path])
  
  return (
    <div className={styles['right-menu']}>
      <p>Меню маршрута</p>
      <TextField 
        label="Название маршрута"
        variant='outlined'
        size='small'
        sx={{backgroundColor: '#ffffff', borderRadius: '4px'}}
        value={name}
        onChange={(e) => {setName(e.target.value); debounced()}}
        // onChange={debounced}
      />
      <TextField 
        label="Цвет маршрута"
        variant='outlined'
        size='small'
        sx={{backgroundColor: '#ffffff', borderRadius: '4px'}}
        value={color}
        onChange={(e) => {setColor(e.target.value); debounced()}}
      />
      <p>Варианты маршрута</p>
      <div className={styles['list']}>
        {path && Object.values(pathObject[path.id]?.variants).map((variant) => 
          <PathVariant key={variant.id} pathVariant={variant}/>
        )}
      </div>
      {/* попробовать найти библиотеку для выбора цвета */}
      <TextField 
        label="Название варианта"
        variant='outlined'
        size='small'
        sx={{backgroundColor: '#ffffff', borderRadius: '4px'}}
        value={variantName}
        onChange={(e) => {setVariantName(e.target.value); debounced()}}
      />
      <TextField 
        label="Цвет варианта"
        variant='outlined'
        size='small'
        sx={{backgroundColor: '#ffffff', borderRadius: '4px'}}
        value={variantColor}
        onChange={(e) => {setVariantColor(e.target.value); debounced()}}
      />
      <div className={styles['path-data']}>
        <div className={styles['path-data__text']}><p>Протяженность:</p> <p>12.7 km</p></div>
        {/* <div className={styles['path-data__text']}><p>По тратуару:</p> <p>10 km</p></div>
        <div className={styles['path-data__text']}><p>По тропам:</p> <p>2 km</p></div>
        <div className={styles['path-data__text']}><p>По лесу:</p> <p>0.5 km</p></div>
        <div className={styles['path-data__text']}><p>По ЖД:</p> <p>0.2 km</p></div> */}
      </div>
      <Button startIcon={<AddIcon/>} onClick={onAddPathVariant}>Добавить вариант</Button>
      {/* <div className={styles.button}>
        <Button variant="contained" onClick={onSavePath}>Сохранить маршрут</Button>
      </div> */}
      
    </div>
  )
}

export default RightMenu;

