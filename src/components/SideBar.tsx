import { useKeyboard } from "@opentui/react";
import { useState } from "react";
import { theme } from "../theme";

const SideBar = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  
  useKeyboard((key) => {
    if (key.ctrl && key.name === "s") {
      setSideBarOpen(!sideBarOpen); // Toggle sidebar
    }
  });
  return (
    <box
      style={{
        width: sideBarOpen ? 30 : 0, 
        height: "100%",
        backgroundColor: theme.colors.backgroundPanel,
        alignItems: "center",
        justifyContent: "center",
        
      }}
    >
      {sideBarOpen && <text>sidebar</text>}
    </box>
  )
}
export default SideBar