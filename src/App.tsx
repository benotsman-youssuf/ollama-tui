import { Box, Text } from "@opentui/core";
import SideBar from "./components/SideBar";
import Chat from "./components/Chat/Chat";

function App() {
  
  
  return (
    <box
      style={{
        flexDirection: "row",
        width: "100%",
        height: "100%",
      }}
    >
      <SideBar/>
      <Chat/>
    </box>
  );
}

export default App