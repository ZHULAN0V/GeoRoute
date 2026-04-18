import { useEffect, useMemo, useState } from "react";
import styles from './selectSegments.module.css'
import { MenuItem, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../providers/store";
import { chooseEndMarkerId, chooseStartMarkerId } from "../../providers/paths/path-segments-ids-reducer";
import { useDebouncedCallback } from "use-debounce";
import { editMarker } from "../../providers/paths/path-reducer";

const SelectSegments = () => {
  const currentPathId = useSelector((state: RootState) => state.currentPathId.currentPathId);
  const pathObject = useSelector((state: RootState) => state.pathObject.paths);
  const markerIds = useSelector((state: RootState) => state.markerIds);
  const dispatch = useDispatch();
  
  const markers = useMemo(() => Object.values(pathObject[currentPathId]?.markers || {}), [currentPathId, pathObject])

  const [markerName, setMarkerName] = useState(pathObject[currentPathId]?.markers[markerIds.startMarkerId]?.name || '');

  const handleStartMarkerSelect = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    dispatch(chooseStartMarkerId(e.target.value))
    if (e.target.value == '') {
      setMarkerName('');
    }
  }

  const handleEndMarkerSelect = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    dispatch(chooseEndMarkerId(e.target.value))
  }

  const debouncedMarker = useDebouncedCallback(() => {
    dispatch(editMarker({...pathObject[currentPathId]?.markers[markerIds.startMarkerId], name: markerName}));
  }, 300 );

  useEffect(() => {
    if (currentPathId) {
      setMarkerName(pathObject[currentPathId]?.markers[markerIds.startMarkerId]?.name);
    } 
  }, [currentPathId, markerIds.startMarkerId, pathObject])

  useEffect(() => {
    setMarkerName('');
    dispatch(chooseStartMarkerId(''));
    dispatch(chooseEndMarkerId(''));
  }, [currentPathId, dispatch])

  return (
    <div className={styles.markerInputs}>
      <div className={styles.select}>
        <TextField 
          className={styles.selectItem}
          value={markerIds.startMarkerId}
          onChange={handleStartMarkerSelect}
          label="Старт"
          sx={{backgroundColor: '#ffffff', borderRadius: 1}}
          size={'small'}
          select
        >
          <MenuItem value={''}>Нет</MenuItem>
          {...markers.map(marker => (
            <MenuItem value={marker.id}>{marker.name}</MenuItem>
          ))}
        </TextField>
        <TextField 
          className={styles.selectItem}
          value={markerIds.endMarkerId}
          label="Конец"
          onChange={handleEndMarkerSelect}
          sx={{backgroundColor: '#ffffff', borderRadius: 1}}
          size={'small'}
          select
        >
          <MenuItem value={''}>Нет</MenuItem>
          {...markers.map(marker => (
            <MenuItem value={marker.id}>{marker.name}</MenuItem>
          ))}
        </TextField>
      </div>
      <div className={styles.inputFlex}>
        <TextField 
          className={styles.input}
          label="Название Маркера"
          variant='outlined'
          size='small'
          sx={{backgroundColor: '#ffffff', borderRadius: '4px', height: 36}}
          value={markerName}
          onChange={(e) => {setMarkerName(e.target.value); debouncedMarker()}}
        />
      </div>
      
    </div>
    
  );
};

export default SelectSegments;