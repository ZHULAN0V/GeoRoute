import { Button } from "@mui/material";
// import styles from './importGpxButton.module.css';
import { useSelector } from "react-redux";
import type { RootState } from "../../providers/store";
import { usePostFile } from "../../hooks/usePostFile";
import createGPXStringFromPath from "../../lib/helpers/createGPXStringFromPath";

const SavePathButton = () => {
  const pathObject = useSelector((state: RootState) => state.pathObject.paths);
  const pathId = useSelector(
    (state: RootState) => state.currentPathId.currentPathId,
  );

  const { mutate: postFile, isPending } = usePostFile();

  const handleClick = () => {
    const gpxData = createGPXStringFromPath(pathObject[pathId]);
    postFile({ gpxData, fileName: pathId });
  };

  return (
    <Button variant="contained" onClick={handleClick} loading={isPending}>
      Сохранить
    </Button>
  );
};

export default SavePathButton;
