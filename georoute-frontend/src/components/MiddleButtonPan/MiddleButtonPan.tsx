import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../providers/store";
import { toggleEditing } from "../../providers/paths/edit-mode-reducer";

const CLICK_MOVEMENT_THRESHOLD = 4;

function MiddleButtonPan() {
  const map = useMap();
  const dispatch = useDispatch();
  const currentPathId = useSelector(
    (state: RootState) => state.currentPathId.currentPathId,
  );

  useEffect(() => {
    const container = map.getContainer();
    let isPanning = false;
    let lastX = 0;
    let lastY = 0;
    let downX = 0;
    let downY = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 1) return;
      e.preventDefault();
      isPanning = true;
      lastX = e.clientX;
      lastY = e.clientY;
      downX = e.clientX;
      downY = e.clientY;
      container.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      map.panBy([-dx, -dy], { animate: false });
    };

    const onMouseUp = (e: MouseEvent) => {
      if (e.button !== 1) return;
      if (!isPanning) return;
      isPanning = false;
      container.style.cursor = "";

      const totalDx = Math.abs(e.clientX - downX);
      const totalDy = Math.abs(e.clientY - downY);
      const wasClick =
        totalDx < CLICK_MOVEMENT_THRESHOLD && totalDy < CLICK_MOVEMENT_THRESHOLD;

      if (wasClick && currentPathId) {
        dispatch(toggleEditing());
      }
    };

    const onMouseLeave = () => {
      if (!isPanning) return;
      isPanning = false;
      container.style.cursor = "";
    };

    const onAuxClick = (e: MouseEvent) => {
      if (e.button === 1) e.preventDefault();
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("auxclick", onAuxClick);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("auxclick", onAuxClick);
      container.style.cursor = "";
    };
  }, [map, dispatch, currentPathId]);

  return null;
}

export default MiddleButtonPan;
