import { Button } from '@mui/material';
// import styles from './importGpxButton.module.css';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../providers/store';
import { addManyPointFromMathed } from '../../providers/paths/path-reducer';
import { usePostFile } from '../../hooks/usePostFile';
import createGPXStringFromPath from '../../lib/helpers/createGPXStringFromPath';


const SavePathButton = () => {
  const pathObject = useSelector((state: RootState) => state.pathObject.paths);
  const pathId = useSelector((state: RootState) => state.currentPathId.currentPathId);
  const pathVariantId = useSelector((state: RootState) => state.currentPathVariantId.currentPathVariantId);
  const dispatch = useDispatch();

  // сложная типизация для graphhopper
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSuccess = (data: any) => {
    dispatch(addManyPointFromMathed({ 
      pathId, 
      pathVariantId, 
      poinstArray: data.paths[0].points.coordinates
        .map((x: number[]) => [x[1], x[0]] as [number, number]) 
    }));
  };
  
  const { mutate: postFile, isPending} = usePostFile({ onSuccess });

  const handleClick = () => {
    const gpxData = createGPXStringFromPath(pathObject[pathId])
    postFile({gpxData, fileName: pathObject[pathId].name});
  };

  return (
     <Button 
      variant="contained" 
      onClick={handleClick}
      loading={isPending}
     >
      Сохранить
    </Button>
  );
};

export default SavePathButton;
