import { useDispatch, useSelector } from "react-redux";
import styles from "./rightMenu.module.css"
import { TextField, Button } from "@mui/material";
import type { RootState } from "../../providers/store";
import { useEffect, useMemo, useState } from "react";
import { editPath } from "../../providers/paths/path-reducer";
import PathVariant from "../../components/PathVariant/PathVariant";
import { createPathVariant, editPathVariant } from "../../providers/paths/path-reducer";
import { useDebouncedCallback } from "use-debounce";
import AddIcon from '@mui/icons-material/Add';
import MatchCurrentPathButton from "../../components/MatchCurrentPathButton/MatchCurrentPathButton";
import SavePathButton from "../../components/SavePathButton/SavePathButton";
import ColorInput from "../../components/ColorInput/ColorInput";
import SelectSegments from "../../components/SelectSegments/SelectSegments";



function RightMenu() {
  const currentPathId = useSelector((state: RootState) => state.currentPathId.currentPathId);
  const currentPathVariantId = useSelector((state: RootState) => state.currentPathVariantId.currentPathVariantId);
  const pathObject = useSelector((state: RootState) => state.pathObject.paths);
  const markerIds = useSelector((state: RootState) => state.markerIds);
  const path = useMemo(() => pathObject[currentPathId], [pathObject, currentPathId]);
  const dispatch = useDispatch();

  const [name, setName] = useState(path?.name || '');
  const [color, setColor] = useState(path?.color || '');
  // const [markerName, setMarkerName] = useState(path?.markers[markerIds.startMarkerId].name || '');
  const [variantName, setVariantName] = useState(path?.variants[currentPathVariantId]?.name || '');
  const [variantColor, setVariantColor] = useState(path?.variants[currentPathVariantId]?.color || '');

  const filteredVariants = useMemo(() => {
    if (markerIds.startMarkerId != '' && markerIds.endMarkerId != '') {
      return Object.values(pathObject[currentPathId]?.variants || {}).filter(x => x.startMarkerId == markerIds.startMarkerId && x.endMarkerId == markerIds.endMarkerId)
    } else if (markerIds.startMarkerId != '' || markerIds.endMarkerId != ''){
      return Object.values(pathObject[currentPathId]?.variants || {}).filter(x => x.startMarkerId == markerIds.startMarkerId || x.endMarkerId == markerIds.endMarkerId)
    } else {
      return Object.values(pathObject[currentPathId]?.variants || {});
    }
  }, [currentPathId, markerIds.startMarkerId, pathObject, markerIds.endMarkerId])

  // console.log(filteredVariants);

  const debounced = useDebouncedCallback(() => {
    dispatch(editPath({...path!, name, color}));
    dispatch(editPathVariant({...path?.variants[currentPathVariantId], name: variantName, color: variantColor}));
  }, 300 );
    
  // const debouncedMarker = useDebouncedCallback(() => {
  //   dispatch(editMarker({...path?.markers[markerIds.startMarkerId], name: markerName}));
  // }, 300 );

  const onAddPathVariant = () => {
    const newItem = {
      id: crypto.randomUUID(),
      pathId: path?.id || '',
      name: path?.name || '',
      color: path?.color || '#000000',
      distance: 0,
      isVisible: false,
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
      <div className={styles.inputsWithColor}>
        <TextField 
          label="Название маршрута"
          variant='outlined'
          size='small'
          sx={{backgroundColor: '#ffffff', borderRadius: '4px'}}
          value={name}
          onChange={(e) => {setName(e.target.value); debounced()}}
          // onChange={debounced}
        />
        <ColorInput options={{
          value: color,
          onChange: (e) => {setColor(e.target.value); debounced()}
        }}/>
      </div>

      <p>Выбор сегмента маршрута</p>
      <SelectSegments/>
      
      <p>Варианты маршрута</p>
      <div className={styles['list']}>
        {path && filteredVariants.map((variant) => 
          <PathVariant key={variant.id} pathVariant={variant}/>
        )}
      </div>
      <div className={styles.inputsWithColor}>
        <TextField 
          label="Название варианта"
          variant='outlined'
          size='small'
          sx={{backgroundColor: '#ffffff', borderRadius: '4px'}}
          value={variantName}
          onChange={(e) => {setVariantName(e.target.value); debounced()}}
        />
        <ColorInput options={{
          value: variantColor,
          onChange: (e) => {setVariantColor(e.target.value); debounced()}
        }}/>
      </div>

      <div className={styles['path-data']}>
        <div className={styles['path-data__text']}><p>Протяженность:</p> <p>12.7 km</p></div>
      </div>
      <Button startIcon={<AddIcon/>} onClick={onAddPathVariant}>Добавить вариант</Button>
      <div className={styles.button}>
        <MatchCurrentPathButton/>
        <SavePathButton/>
      </div>
    </div>
  )
}

export default RightMenu;

