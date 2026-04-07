import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../providers/store';
import { addManyPointFromMathed } from '../../providers/paths/path-reducer';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import { useMatchRouteMutation } from '../../hooks/usePostMatchMap';
import createXmlString from '../../lib/helpers/downloadGPX';
// import createGPXStringFromPath from '../../lib/helpers/createGPXStringFromPath';


const MatchCurrentPathButton = () => {
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
  
  const { mutate: matchRoute, isPending} = useMatchRouteMutation({ onSuccess });

  const handleClick = () => {
    const latlngArray = Object.values(pathObject[pathId].variants[pathVariantId].path)
      .map(x => [x.lat, x.lng] as [number, number]);
    const gpxData = createXmlString([latlngArray]);
    matchRoute({gpxData});
  };

  return (
     <Button 
      startIcon={<DirectionsWalkIcon/>} 
      variant="contained" 
      onClick={handleClick}
      loading={isPending}
     >
      Притянуть к тропе
    </Button>
  );
};

export default MatchCurrentPathButton;
