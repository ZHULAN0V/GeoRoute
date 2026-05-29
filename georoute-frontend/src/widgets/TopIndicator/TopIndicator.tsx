import { useSelector } from "react-redux";
import type { RootState } from "../../providers/store";
import styles from "./topIndicator.module.css";

function TopIndicator() {
  const currentPathId = useSelector(
    (state: RootState) => state.currentPathId.currentPathId,
  );
  const paths = useSelector(
    (state: RootState) => state.pathObject.present.paths,
  );
  const isEditing = useSelector(
    (state: RootState) => state.editMode.isEditing,
  );

  if (!currentPathId) {
    return null;
  }

  const path = paths[currentPathId];
  if (!path) {
    return null;
  }

  const text = isEditing
    ? `Выбран маршрут "${path.name}" в режиме редактирования. ПКМ — удаление вершин и КП`
    : `Выбран маршрут "${path.name}"`;

  return <div className={styles["top-indicator"]}>{text}</div>;
}

export default TopIndicator;
