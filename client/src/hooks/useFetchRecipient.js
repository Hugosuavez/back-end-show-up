import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";


export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);
   
    const recipientId = chat?.members?.find((id) => id !== user?._id);
   
    console.log('chat', chat)
    console.log('chat.members', chat.members)
    console.log('recipientid', recipientId)
    

    useEffect(() => {
      const getRecipientUser = async () => {
        if (!recipientId) return null;
  
        const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);
  
        if (response.error) {
          return setError(error);
        }
  
        setRecipientUser(response);
        console.log(recipientUser)
      };
      getRecipientUser();
    }, [recipientId]);
  
    return { recipientUser };
  };