import styles from './pathVariant.module.css'
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import type { ISegmentVariant, ISegment, IMarkersObject } from '../../services/types/Path';
import { useDispatch } from 'react-redux';
import { deleteSegmentVariant, setActiveSegmentVariant } from '../../providers/paths/path-reducer';
import { setSegmentVariantId } from '../../providers/paths/current-segment-variant-id-reducer';
import { formatDistanceKm, getSegmentLengthKm } from '../../lib/helpers/pathGeometry';

interface IPathVariantProps {
  variant: ISegmentVariant
  segment: ISegment
  pathId: string
  markers: IMarkersObject
  isActive: boolean
}

function PathVariant(props: IPathVariantProps) {
  const { variant, segment, pathId, markers, isActive } = props;
  const dispatch = useDispatch();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (Object.keys(segment.variants).length <= 1) return;
    dispatch(deleteSegmentVariant({ pathId, segmentId: segment.id, variantId: variant.id }));
  };

  const handleChose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(setActiveSegmentVariant({ pathId, segmentId: segment.id, variantId: variant.id }));
    dispatch(setSegmentVariantId(variant.id));
  };

  const length = getSegmentLengthKm(segment, variant.id, markers);

  return (
    <div className={`${styles['path-item']} ${styles[isActive ? 'active' : '']}`} onClick={handleChose}>
      <div className={styles['left-block']}>
        <p className={styles['title']}>{formatDistanceKm(length)}</p>
      </div>
      <div className={styles['right-block']}>
        <div className={styles['color']}>
          <div className={styles['color-box']} style={{ backgroundColor: variant.color }}></div>
          <div className={styles['color-text']}>{variant.color}</div>
        </div>
        <div className={styles['buttons']}>
          <IconButton
            onClick={handleDelete}
            sx={{ width: 28, height: 28 }}
            disabled={Object.keys(segment.variants).length <= 1}
          >
            <DeleteIcon sx={{ width: 20, height: 20, color: '#212121' }} />
          </IconButton>
          <IconButton
            sx={{ width: 28, height: 28 }}
          >
            {isActive
              ? <RadioButtonCheckedIcon sx={{ width: 20, height: 20, color: '#212121' }} />
              : <RadioButtonUncheckedIcon sx={{ width: 20, height: 20, color: '#212121' }} />}
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default PathVariant
