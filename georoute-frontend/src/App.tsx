import Map from "./components/Map/Map";
import BottomMenu from "./widgets/BottomMenu/BottomMenu";
import LeftMenu from "./widgets/LeftMenu/LeftMenu";
import RightMenu from "./widgets/RightMenu/RightMenu";
import TopIndicator from "./widgets/TopIndicator/TopIndicator";
import CheckpointNumberModal from "./components/CheckpointNumberModal/CheckpointNumberModal";
import { useAutosaveCurrentPath } from "./hooks/useAutosaveCurrentPath";

function App() {
  useAutosaveCurrentPath();
  return (
    <>
      <Map />
      <TopIndicator />
      <BottomMenu />
      <LeftMenu />
      <RightMenu />
      <CheckpointNumberModal />
    </>
  );
}

export default App;
