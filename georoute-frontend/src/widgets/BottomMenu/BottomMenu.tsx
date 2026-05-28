import { useEffect } from "react";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import styles from "./bottomMenu.module.css";
import { useDispatch, useSelector } from "react-redux";
import { ActionCreators } from "redux-undo";
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
  const canUndo = useSelector(
    (state: RootState) => state.pathObject.past.length > 0,
  );
  const canRedo = useSelector(
    (state: RootState) => state.pathObject.future.length > 0,
  );

  const handleUndo = () => {
    if (canUndo) dispatch(ActionCreators.undo());
  };

  const handleRedo = () => {
    if (canRedo) dispatch(ActionCreators.redo());
  };

  useEffect(() => {
    if (!currentPathId) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const ctrl = event.ctrlKey || event.metaKey;
      if (!ctrl) return;

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      if (key === "z" && !event.shiftKey) {
        event.preventDefault();
        if (canUndo) dispatch(ActionCreators.undo());
      } else if ((key === "z" && event.shiftKey) || key === "y") {
        event.preventDefault();
        if (canRedo) dispatch(ActionCreators.redo());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPathId, canUndo, canRedo, dispatch]);

  if (!currentPathId) {
    return null;
  }

  const handleToggleEdit = () => {
    dispatch(toggleEditing());
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

      <IconButton
        onClick={handleUndo}
        disabled={!canUndo}
        title="отменить (Ctrl+Z)"
      >
        <UndoIcon sx={{ color: canUndo ? "#212121" : "#9e9e9e" }} />
      </IconButton>

      <IconButton
        onClick={handleRedo}
        disabled={!canRedo}
        title="вернуть отмененное (Ctrl+Shift+Z)"
      >
        <RedoIcon sx={{ color: canRedo ? "#212121" : "#9e9e9e" }} />
      </IconButton>
    </div>
  );
}

export default BottomMenu;
