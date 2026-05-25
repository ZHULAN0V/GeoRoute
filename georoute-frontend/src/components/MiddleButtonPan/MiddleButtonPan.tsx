import { useEffect } from "react";
import { useMap } from "react-leaflet";

function MiddleButtonPan() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    let isPanning = false;
    let lastX = 0;
    let lastY = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 1) return;
      e.preventDefault();
      isPanning = true;
      lastX = e.clientX;
      lastY = e.clientY;
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
  }, [map]);

  return null;
}

export default MiddleButtonPan;
