import styles from './pathVariant.module.css'
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
// import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import type { IPathVariant } from '../../services/types/Path';
import type { RootState } from '../../providers/store';
import { useDispatch, useSelector } from 'react-redux';
// import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { deletePathVariant, editPathVariant, margeVariantToMain } from '../../providers/paths/path-reducer';
import { setPathVariantId } from '../../providers/paths/current-path-variant-id-reducer';
// import SwapVertIcon from '@mui/icons-material/SwapVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CallMergeIcon from '@mui/icons-material/CallMerge';
import calculateRouteDistance from '../../lib/helpers/calculateRouteDistance';
import { useMemo } from 'react';

interface IPathVariantProps {
  pathVariant: IPathVariant
}

function PathVariant(props: IPathVariantProps) {
  const { pathVariant } = props;
  const pathObject = useSelector((state: RootState) => state.pathObject.paths)
  const currentPathVariantId = useSelector((state: RootState) => state.currentPathVariantId.currentPathVariantId);
  const points = useMemo(() => Object.values(pathObject[pathVariant.pathId].variants[pathVariant.id].path).map(x => [x.lat, x.lng] as [number, number]), 
    [pathObject, pathVariant.id, pathVariant.pathId]);
  const dispatch = useDispatch();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(deletePathVariant(pathVariant));
    // if (currentPathId == path.id) {
    //   dispatch(unchosePath());
    // }
  };

  const handleChosePath = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(setPathVariantId(pathVariant.id));
  };

  const handleSetCheckedPath = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(editPathVariant({...pathVariant, isVisible: !pathVariant.isVisible}));
  };

  const handleCallMergePath = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(margeVariantToMain(pathVariant))
  }

  return (
    <div className={`${styles['path-item']} ${styles[currentPathVariantId == pathVariant.id ? 'active' : '']}`} onClick={handleChosePath}>
      <div className={styles['left-block']}>
        <p className={styles['title']}>{ pathVariant.name }</p>
        <p className={styles['description']}>{calculateRouteDistance(points)} км</p>
      </div>
      <div className={styles['right-block']}>
        <div className={styles['color']}>
          <div className={styles['color-box']} style={{backgroundColor: pathVariant.color}}></div>
          <div className={styles['color-text']}>{pathVariant.color}</div>
        </div>
        <div className={styles['buttons']}>
          { !pathVariant.isMain && <IconButton onClick={handleCallMergePath} sx={{width: 28, height: 28}} >
            <CallMergeIcon sx={{width: 20, height: 20, color: '#212121'}} />
          </IconButton> }
          { !pathVariant.isMain && <IconButton  onClick={handleDelete} sx={{width: 28, height: 28}}>
            <DeleteIcon sx={{width: 20, height: 20, color: '#212121'}} />
          </IconButton> }
          <IconButton  onClick={handleSetCheckedPath} sx={{width: 28, height: 28}} >
            {pathVariant.isVisible && <VisibilityIcon sx={{width: 20, height: 20, color: '#212121'}} />}
            {!pathVariant.isVisible && <VisibilityOffIcon sx={{width: 20, height: 20, color: '#212121'}} />}
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default PathVariant
