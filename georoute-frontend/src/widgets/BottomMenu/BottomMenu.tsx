import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import TurnSharpRightIcon from '@mui/icons-material/TurnSharpRight';
import styles from "./bottomMenu.module.css"
import { useDispatch, useSelector } from "react-redux";
import { selectButton } from "../../providers/paths/active-button-reducer";
import type {TButtonType} from "../../providers/paths/active-button-reducer";
import type { RootState } from "../../providers/store";

function BottomMenu() {
  // const currentPath = useSelector((state: RootState) => state.currentButton.currentButton)
  const dispatch = useDispatch();
  const currentButton = useSelector((state: RootState) => state.currentButton.currentButton);

  const handleClick = (action: TButtonType) => {
    return function () {
      dispatch(selectButton(action))
    }
  }
  
  return (
    <div className={styles['bottom-menu']}>
      {/* qwertyu */}
      <IconButton 
        onClick={handleClick('edit')}
        sx={{
          backgroundColor: currentButton === 'edit' ? 'rgba(37, 99, 235, 0.16)' : 'transparent',
          '&:hover': { backgroundColor: currentButton === 'edit' ? 'rgba(37, 99, 235, 0.24)' : undefined },
        }}
      ><EditIcon sx={{ color: '#212121' }}/></IconButton>
      <IconButton onClick={handleClick('delete')}><DeleteIcon sx={{ color: '#212121' }}/></IconButton>
      <IconButton onClick={handleClick('double')}><TurnSharpRightIcon sx={{ color: '#212121' }}/></IconButton>
      <IconButton onClick={handleClick('undo')}><UndoIcon sx={{ color: '#212121' }}/></IconButton>
      <IconButton onClick={handleClick('redo')}><RedoIcon sx={{ color: '#212121' }}/></IconButton>
    </div>
  );
} 

export default BottomMenu;