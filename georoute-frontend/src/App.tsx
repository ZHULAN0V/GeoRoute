import Map from "./components/Map/Map"
import BottomMenu from "./widgets/BottomMenu/BottomMenu"
import LeftMenu from "./widgets/LeftMenu/LeftMenu"
import RightMenu from "./widgets/RightMenu/RightMenu"
// import { useState } from "react"

function App() {
  return (
    <>
      <Map/>  
      <BottomMenu/>
      <LeftMenu />
      <RightMenu/>
    </>
  )
}

export default App
