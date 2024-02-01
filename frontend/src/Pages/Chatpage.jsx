import { Box } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/misc/SideDrawer";
import MyChats from "../components/misc/MyChats";
import Chatbox from "../components/misc/Chatbox";

const Chatpage = () => {
  const { user } = ChatState();
  return (
    <div style={{ width: "95vw", paddingLeft: "10px" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="95vw"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <Chatbox />}
      </Box>
    </div>
  );
};

export default Chatpage;
