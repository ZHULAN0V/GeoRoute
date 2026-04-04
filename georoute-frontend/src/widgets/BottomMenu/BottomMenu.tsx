import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import TurnSharpRightIcon from '@mui/icons-material/TurnSharpRight';
import styles from "./bottomMenu.module.css"
import { useDispatch } from "react-redux";
import { selectButton } from "../../providers/redux-test/active-button-reducer";
import type {TButtonType} from "../../providers/redux-test/active-button-reducer";

function BottomMenu() {
  // const currentPath = useSelector((state: RootState) => state.currentButton.currentButton)
  const dispatch = useDispatch();

  const handleClick = (action: TButtonType) => {
    return function () {
      dispatch(selectButton(action))
    }
  }
  
  return (
    <div className={styles['bottom-menu']}>
      {/* qwertyu */}
      <IconButton onClick={handleClick('edit')}><EditIcon sx={{ color: '#212121' }}/></IconButton>
      <IconButton onClick={handleClick('delete')}><DeleteIcon sx={{ color: '#212121' }}/></IconButton>
      <IconButton onClick={handleClick('double')}><TurnSharpRightIcon sx={{ color: '#212121' }}/></IconButton>
      <IconButton onClick={handleClick('undo')}><UndoIcon sx={{ color: '#212121' }}/></IconButton>
      <IconButton onClick={handleClick('redo')}><RedoIcon sx={{ color: '#212121' }}/></IconButton>
    </div>
  );
} 

export default BottomMenu;