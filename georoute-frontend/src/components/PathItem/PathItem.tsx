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
import { formatDistanceKm, getPathTotalLengthKm } from '../../lib/helpers/pathGeometry';

interface IPathItemProps {
  path: IPath
}

function PathItem(props: IPathItemProps) {
  const { path } = props;

  const currentPathId = useSelector((state: RootState) => state.currentPathId.currentPathId)
  const dispatch = useDispatch();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(deletePath(path.id));
    if (currentPathId == path.id) {
      dispatch(unchosePathId());
    }
  };

  const handleChosePath = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(chosePathId(path.id));
  };

  const handleSetCheckedPath = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(editPath({ ...path, checked: !path.checked }));
  };

  return (
    <div className={`${styles['path-item']} ${styles[currentPathId == path.id ? 'active' : '']}`} onClick={handleChosePath}>
      <div className={styles['left-block']}>
        <p className={styles['title']}>{path.name}</p>
        <p className={styles['description']}>{formatDistanceKm(getPathTotalLengthKm(path))}</p>
      </div>
      <div className={styles['right-block']}>
        <div className={styles['color']}>
          <div className={styles['color-box']} style={{ backgroundColor: path.color }}></div>
          <div className={styles['color-text']}>{path.color}</div>
        </div>
        <div className={styles['buttons']}>
          <IconButton
            sx={{ width: 28, height: 28 }}
            onClick={handleDelete}
          >
            <DeleteIcon
              sx={{ width: 20, height: 20, color: '#212121' }}
            />
          </IconButton>
          <IconButton
            sx={{ width: 28, height: 28 }}
            onClick={handleSetCheckedPath}
          >
            {!path.checked && <CheckBoxOutlineBlankIcon sx={{ width: 20, height: 20, color: '#212121' }} />}
            {path.checked && <CheckBoxIcon sx={{ width: 20, height: 20, color: '#212121' }} />}
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default memo(PathItem);
