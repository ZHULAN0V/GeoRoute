import type { LeafletMouseEvent } from "leaflet";
import { useMapEvent } from "react-leaflet";
import { useDispatch } from "react-redux";
import { saveMapView } from "../../providers/paths/map-layer-reducer";

interface MapHandlerComponentProps {
  handleMapClick: (e: LeafletMouseEvent) => void;
  handleMapMouseMove: (e: LeafletMouseEvent) => void;
  handleMapContextMenu: () => void;
}

function MapHandlerComponent(props: MapHandlerComponentProps) {
  const { handleMapClick, handleMapMouseMove, handleMapContextMenu } = props;
  const dispatch = useDispatch();

  useMapEvent("click", (e) => {
    // ЛКМ
    handleMapClick(e);
  });
  useMapEvent("mousemove", (e) => {
    // движение мыши
    handleMapMouseMove(e);
  });
  useMapEvent("dblclick", () => {
    // двойной клик и так понятно конечно
    // handleMapMouseMove(e);
  });
  useMapEvent("contextmenu", () => {
    // ПКМ
    handleMapContextMenu();
  });
  useMapEvent("moveend", (e) => {
    const map = e.target;
    const center = map.getCenter();
    dispatch(
      saveMapView({ center: [center.lat, center.lng], zoom: map.getZoom() }),
    );
  });
  return null;
}

export default MapHandlerComponent;
