import styles from './pathItem.module.css'
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import type { IPath } from '../../services/types/Path';
import { useDispatch, useSelector } from 'react-redux';
import { deletePath, editPath } from '../../providers/paths/path-reducer';
import { memo } from 'react'
import type { RootState } from '../../providers/store';
import { chosePathId, unchosePathId } from '../../providers/paths/current-path-id-reducer';
import { setPathVariantId } from '../../providers/paths/current-path-variant-id-reducer';
import { useDeleteFileByName } from '../../hooks/useDeleteFileByName';

interface IPathItemProps {
  path: IPath
}

function PathItem(props: IPathItemProps) {
  const { path } = props;

  const currentPathId = useSelector((state: RootState) => state.currentPathId.currentPathId)
  const dispatch = useDispatch();

  const {mutate: deleteFile, isPending} = useDeleteFileByName();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(deletePath(path.id));
    deleteFile({fileName: path.name});
    if (currentPathId == path.id) {
      dispatch(unchosePathId());
    }
  };

  const handleChosePath = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(chosePathId(path.id));
    dispatch(setPathVariantId(Object.keys(path.variants)[0] || ''))
  };

  const handleSetCheckedPath = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(editPath({...path, checked: !path.checked}));
  };

  return (
    <div className={`${styles['path-item']} ${styles[currentPathId == path.id ? 'active' : '']}`} onClick={handleChosePath}>
      <div className={styles['left-block']}>
        <p className={styles['title']}>{ path.name }</p>
        <p className={styles['description']}>12.7 km</p>
      </div>
      <div className={styles['right-block']}>
        <div className={styles['color']}>
          <div className={styles['color-box']} style={{backgroundColor: path.color}}></div>
          <div className={styles['color-text']}>{path.color}</div>
        </div>
        <div className={styles['buttons']}>
          <IconButton 
            sx={{width: 28, height: 28}}
            onClick={handleDelete}
            loading={isPending}
          >
            <DeleteIcon
              sx={{width: 20, height: 20, color: '#212121'}}
            />
          </IconButton>
          <IconButton 
            sx={{width: 28, height: 28}}
            onClick={handleSetCheckedPath}
          >
            {!path.checked &&  <CheckBoxOutlineBlankIcon sx={{width: 20, height: 20, color: '#212121'}} />}
            {path.checked && <CheckBoxIcon sx={{width: 20, height: 20, color: '#212121'}} />}
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default memo(PathItem);