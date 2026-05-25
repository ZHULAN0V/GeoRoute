import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import styles from "./bottomMenu.module.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleEditing } from "../../providers/paths/edit-mode-reducer";
import type { RootState } from "../../providers/store";

function BottomMenu() {
  const dispatch = useDispatch();
  const isEditing = useSelector(
    (state: RootState) => state.editMode.isEditing,
  );
  const currentPathId = useSelector(
    (state: RootState) => state.currentPathId.currentPathId,
  );

  if (!currentPathId) {
    return null;
  }

  const handleToggleEdit = () => {
    dispatch(toggleEditing());
  };

  const handleUndo = () => {
    // todo: реализовать историю изменений
  };

  const handleRedo = () => {
    // todo: реализовать историю изменений
  };

  return (
    <div className={styles["bottom-menu"]}>
      <IconButton
        onClick={handleToggleEdit}
        title="редактировать"
        sx={{
          backgroundColor: isEditing
            ? "rgba(37, 99, 235, 0.16)"
            : "transparent",
          "&:hover": {
            backgroundColor: isEditing
              ? "rgba(37, 99, 235, 0.24)"
              : undefined,
          },
        }}
      >
        <EditIcon sx={{ color: "#212121" }} />
      </IconButton>

      <IconButton onClick={handleUndo} title="отменить">
        <UndoIcon sx={{ color: "#212121" }} />
      </IconButton>

      <IconButton onClick={handleRedo} title="вернуть отмененное">
        <RedoIcon sx={{ color: "#212121" }} />
      </IconButton>
    </div>
  );
}

export default BottomMenu;
