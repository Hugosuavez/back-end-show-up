import { useContext } from "react";
import { Container, Stack } from "react-bootstrap";
import UserCard from "../components/chat/UserCard";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { user } = useContext(AuthContext);

  const { userChats, isUserChatsLoading, updateCurrentChat } =
    useContext(ChatContext);

  console.log("userchats", userChats);
  console.log("user", user);

  return (
    <Container>
      {userChats?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {isUserChatsLoading && <p>Fetching Chats..</p>}
            {/* {(!isUserChatsLoading && !userChats) ||
              (!userChats?.length === 0 && <p>No Chats..</p>)} */}
            {userChats?.map((chat, index) => {
              return (
                <div key={index} onClick={() => updateCurrentChat(chat)}>
                  <UserCard chat={chat} user={user} />
                </div>
              );
            })}
          </Stack>
          <p>CHatBox</p>
        </Stack>
      )}
    </Container>
  );
};

export default Chat;

//import AllUsers from "../components/Chat/AllUsers";
//import ChatBox from "../components/Chat/ChatBox";


//import { userChats } from "../../../server/controllers/chatController";

//console.log("userchats", userChats);

{
  /* <AllUsers /> */
}
