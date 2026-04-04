import type { LeafletMouseEvent } from "leaflet";
import { useMapEvent } from "react-leaflet";

interface MapHandlerComponentProps {
  handleMapClick: (e: LeafletMouseEvent) => void;
  handleMapMouseMove: (e: LeafletMouseEvent) => void;
  handleMapContextMenu: () => void;
}

function MapHandlerComponent(props: MapHandlerComponentProps) {
  const { handleMapClick, handleMapMouseMove, handleMapContextMenu } = props;
  // const map = useMap();
  useMapEvent('click', (e) => { // ЛКМ
    handleMapClick(e);
  });
  useMapEvent('mousemove', (e) => { // движение мыши
    handleMapMouseMove(e);
  });
  useMapEvent('dblclick', () => { // двойной клик и так понятно конечно
    // handleMapMouseMove(e);
  });
  useMapEvent('contextmenu', () => { // ПКМ
    handleMapContextMenu();
  });
  return null;
}

export default MapHandlerComponent;