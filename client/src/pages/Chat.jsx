
import "./Chat.css";
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

  const storedUser =
  localStorage.getItem("user");

  let user = null;

  try {
  user = storedUser
    ? JSON.parse(storedUser)
    : null;
  } catch (error) {
  console.error(
    "Invalid user data in localStorage:",
    error
  );
  }

  
  useEffect(() => {
    if (!token) {
  console.log("❌ Token not found");
  navigate("/login");
  return;
  }

  if (!user) {
  console.log("❌ User not found in localStorage");
  return;
  }

  console.log("✅ Chat authentication:", {
  tokenExists: !!token,
  user,
  userId: user._id
  });
    
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
      setOnlineUsers(users || []);
    });


    socket.on("newMessage", (newMessage) => {
      console.log("New message received:", newMessage);

      const senderId =
        newMessage?.sender?._id ||
        newMessage?.sender ||
        null;

      if (
        selectedUser &&
        senderId &&
        selectedUser?._id &&
        senderId.toString() ===
          selectedUser._id.toString()
      ) {
        setMessages((prev) => [
          ...prev,
          newMessage
        ]);

        if (newMessage?._id) {
          socket.emit(
            "messageDelivered",
            newMessage._id
          );
        }
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

      console.error(
        "Send message error:",
        error.response?.data ||
          error.message
      );

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


  const getInitial = (name) => {

    if (!name) {
      return "?";
    }

    return name
      .charAt(0)
      .toUpperCase();
  };

  return (
    <div className="chat-page">

      <div className="chat-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="chat-header">

          <div>
            <h1>Study Buddy Chat</h1>

            <p
              style={{
                margin: "4px 0 0",
                fontSize: "13px",
                color: "#6b7280"
              }}
            >
              Connect and study together
            </p>
          </div>

          <button
            className="back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Dashboard
          </button>

        </div>


        {/* =========================
            BODY
        ========================= */}

        <div className="chat-body">


          {/* =========================
              SIDEBAR
          ========================= */}

          <div className="chat-sidebar">

            <h2 className="sidebar-title">
              My Chats
            </h2>

            {chats.length === 0 ? (

              <div className="no-chats">
                No conversations yet.
              </div>

            ) : (

              chats.map((chat, index) => {

                const chatUser =
                  getChatUser(chat);

                if (!chatUser) {
                  return null;
                }

                const active =
                  selectedUser?._id?.toString() ===
                  chatUser?._id?.toString();

                return (
                  <button
                    key={
                      chatUser._id ||
                      index
                    }
                    className={`chat-user-button ${
                      active
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      openChat(chatUser)
                    }
                  >

                    {/* AVATAR */}

                    <div className="avatar">

                      {getInitial(
                        chatUser.fullName
                      )}

                    </div>


                    {/* USER INFO */}

                    <div className="chat-user-info">

                      <span className="chat-user-name">

                        {chatUser.fullName ||
                          "Study Buddy"}

                      </span>


                      <span className="chat-user-status">

                        {isOnline(
                          chatUser._id
                        ) ? (

                          <span className="online-dot">
                            ● Online
                          </span>

                        ) : (

                          "Offline"

                        )}

                      </span>

                    </div>

                  </button>
                );
              })
            )}

          </div>


          {/* =========================
              MAIN CHAT
          ========================= */}

          <div className="chat-main">

            {!selectedUser ? (

              <div className="empty-chat">

                <div>

                  <div
                    style={{
                      fontSize: "50px",
                      marginBottom: "10px"
                    }}
                  >
                    💬
                  </div>

                  <h2>
                    Select a Study Buddy
                  </h2>

                  <p>
                    Choose a buddy from the
                    left to start chatting.
                  </p>

                </div>

              </div>

            ) : (

              <>

                {/* =========================
                    CHAT HEADER
                ========================= */}

                <div className="chat-main-header">

                  <div className="avatar">

                    {getInitial(
                      selectedUser.fullName
                    )}

                  </div>


                  <div>

                    <h2>

                      {selectedUser.fullName ||
                        "Study Buddy"}

                    </h2>


                    <span className="chat-user-status">

                      {isOnline(
                        selectedUser._id
                      ) ? (

                        <span className="online-dot">
                          ● Online
                        </span>

                      ) : (

                        "Offline"

                      )}

                    </span>

                  </div>

                </div>


                {/* =========================
                    MESSAGES
                ========================= */}

                <div className="chat-messages">

                  {messages.length === 0 ? (

                    <div className="empty-chat">

                      <div>

                        <div
                          style={{
                            fontSize: "40px"
                          }}
                        >
                          👋
                        </div>

                        <p>
                          No messages yet.
                          Say hello!
                        </p>

                      </div>

                    </div>

                  ) : (

                    messages.map(
                      (item, index) => {

                        if (!item) {
                          return null;
                        }

                        const senderId =
                          item?.sender?._id ||
                          item?.sender ||
                          null;

                        const currentUserId =
                          user?._id ||
                          null;

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
                            className={`message-row ${
                              isMine
                                ? "mine"
                                : ""
                            }`}
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

                            <div className="message-bubble">

                              <div className="message-text">

                                {item?.message ||
                                  ""}

                              </div>


                              {/* STATUS */}

                              {isMine && (

                                <span className="message-status">

                                  {item?.status ===
                                  "read"

                                    ? "✓✓ Read"

                                    : item?.status ===
                                      "delivered"

                                    ? "✓✓ Delivered"

                                    : "✓ Sent"}

                                </span>

                              )}

                            </div>

                          </div>
                        );
                      }
                    )

                  )}

                  <div
                    ref={messagesEndRef}
                  />

                </div>


                {/* =========================
                    MESSAGE INPUT
                ========================= */}

                <form
                  className="message-form"
                  onSubmit={sendMessage}
                >

                  <input
                    id="message"
                    name="message"
                    className="message-input"
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(event) =>
                      setMessage(
                        event.target.value
                      )
                    }
                    autoComplete="off"
                  />


                  <button
                    className="send-button"
                    type="submit"
                    disabled={
                      !message.trim()
                    }
                  >
                    Send
                  </button>

                </form>

              </>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Chat;