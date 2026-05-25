import Map from "./components/Map/Map";
import BottomMenu from "./widgets/BottomMenu/BottomMenu";
import LeftMenu from "./widgets/LeftMenu/LeftMenu";
import RightMenu from "./widgets/RightMenu/RightMenu";
import TopIndicator from "./widgets/TopIndicator/TopIndicator";

function App() {
  return (
    <>
      <Map />
      <TopIndicator />
      <BottomMenu />
      <LeftMenu />
      <RightMenu />
    </>
  );
}

export default App;
