
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../services/api";

function Chat() {
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
      return;
    }

    loadChats();

    const socket = io("http://localhost:5000");

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("join", user._id);
    });

    socket.on("connect_error", (error) => {
      console.error(
        "Socket connection error:",
        error.message
      );
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("newMessage", (newMessage) => {
      const senderId =
        newMessage?.sender?._id ||
        newMessage?.sender ||
        null;

      if (
        selectedUser &&
        senderId &&
        selectedUser._id &&
        senderId.toString() ===
          selectedUser._id.toString()
      ) {
        setMessages((prev) => [
          ...prev,
          newMessage
        ]);

        socket.emit(
          "messageDelivered",
          newMessage._id
        );
      }

      loadChats();
    });

    socket.on("messageRead", (updatedMessage) => {
      setMessages((prev) =>
        prev.map((item) =>
          item?._id === updatedMessage?._id
            ? updatedMessage
            : item
        )
      );
    });

    socket.on(
      "messageDelivered",
      (updatedMessage) => {
        setMessages((prev) =>
          prev.map((item) =>
            item?._id === updatedMessage?._id
              ? updatedMessage
              : item
          )
        );
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [token, user?._id, navigate, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const loadChats = async () => {
    try {
      const response = await api.get(
        "/chat/chats",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "Chat API response:",
        response.data
      );

      const chatList =
        response.data?.chats || [];

      setChats(chatList);
    } catch (error) {
      console.error(
        error.response?.data?.message ||
          "Failed to load chats"
      );
    }
  };

  const getChatUser = (chat) => {
    if (!chat) {
      return null;
    }

    if (chat.user) {
      return chat.user;
    }

    if (chat.otherUser) {
      return chat.otherUser;
    }

    if (
      chat.sender &&
      chat.sender._id &&
      chat.sender._id.toString() !==
        user?._id?.toString()
    ) {
      return chat.sender;
    }

    if (
      chat.receiver &&
      chat.receiver._id &&
      chat.receiver._id.toString() !==
        user?._id?.toString()
    ) {
      return chat.receiver;
    }

    if (chat._id && chat.fullName) {
      return chat;
    }

    return null;
  };

  const openChat = async (chatUser) => {
    if (!chatUser?._id) {
      return;
    }

    try {
      setSelectedUser(chatUser);

      const response = await api.get(
        `/chat/conversation/${chatUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const conversation =
        response.data?.messages ||
        response.data?.conversation ||
        response.data?.data ||
        [];

      console.log(
        "Conversation API response:",
        response.data
      );

      console.log(
        "Conversation messages:",
        conversation
      );

      setMessages(conversation);

      conversation.forEach((item) => {
        if (!item) {
          return;
        }

        const receiverId =
          item?.receiver?._id ||
          item?.receiver ||
          null;

        if (
          receiverId &&
          user?._id &&
          receiverId.toString() ===
            user._id.toString() &&
          item?.status !== "read" &&
          item?._id
        ) {
          socketRef.current?.emit(
            "messageRead",
            {
              messageId: item._id,
              userId: user._id
            }
          );
        }
      });
    } catch (error) {
      console.error(
        "Failed to load conversation:",
        error.response?.data ||
          error.message
      );
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    if (
      !message.trim() ||
      !selectedUser?._id
    ) {
      return;
    }

    try {
      const response = await api.post(
        `/chat/send/${selectedUser._id}`,
        {
          message: message.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const sentMessage =
        response.data?.message;

      if (sentMessage) {
        setMessages((prev) => [
          ...prev,
          sentMessage
        ]);
      }

      setMessage("");

      loadChats();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to send message"
      );
    }
  };

  const isOnline = (userId) => {
    if (!userId) {
      return false;
    }

    return onlineUsers.some(
      (id) =>
        id?.toString() ===
        userId?.toString()
    );
  };

  return (
    <div>
      <h1>Study Buddy Chat</h1>

      <button
        onClick={() =>
          navigate("/dashboard")
        }
      >
        Back to Dashboard
      </button>

      <hr />

      <div>
        <h2>My Chats</h2>

        {chats.length === 0 ? (
          <p>
            No conversations yet.
          </p>
        ) : (
          chats.map((chat, index) => {
            const chatUser =
              getChatUser(chat);

            if (!chatUser) {
              return null;
            }

            return (
              <button
                key={
                  chatUser._id ||
                  index
                }
                onClick={() =>
                  openChat(chatUser)
                }
              >
                {chatUser.fullName ||
                  "Study Buddy"}

                {isOnline(
                  chatUser._id
                ) && " 🟢"}
              </button>
            );
          })
        )}
      </div>

      <hr />

      {selectedUser ? (
        <div>
          <h2>
            {selectedUser.fullName ||
              "Study Buddy"}

            {isOnline(
              selectedUser._id
            ) && " 🟢"}
          </h2>

          <div>
            {messages.map((item, index) => {
              if (!item) {
                return null;
              }

              const senderId =
                item?.sender?._id ||
                item?.sender ||
                null;

              const currentUserId =
                user?._id || null;

              const isMine =
                senderId &&
                currentUserId &&
                senderId.toString() ===
                  currentUserId.toString();

              return (
                <div
                  key={
                    item?._id ||
                    index
                  }
                  style={{
                    textAlign: isMine
                      ? "right"
                      : "left",
                    margin: "10px"
                  }}
                  onClick={() => {
                    if (
                      !isMine &&
                      item?._id &&
                      item?.status !==
                        "read"
                    ) {
                      socketRef.current?.emit(
                        "messageRead",
                        {
                          messageId:
                            item._id,
                          userId:
                            currentUserId
                        }
                      );
                    }
                  }}
                >
                  <div>
                    {item?.message ||
                      ""}
                  </div>

                  {isMine && (
                    <small>
                      {item?.status ===
                      "read"
                        ? "✓✓ Read"
                        : item?.status ===
                          "delivered"
                        ? "✓✓ Delivered"
                        : "✓ Sent"}
                    </small>
                  )}
                </div>
              );
            })}

            <div
              ref={messagesEndRef}
            />
          </div>

          <form
            onSubmit={sendMessage}
          >
            <input
                id="message"
                name="message"
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(event) =>
                setMessage(event.target.value)
                }
            />

            <button type="submit">
              Send
            </button>
          </form>
        </div>
      ) : (
        <p>
          Select a study buddy to
          start chatting.
        </p>
      )}
    </div>
  );
}

export default Chat;