"use client";

import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import Conversation from "@/components/conversations/Conversation";
import { server } from "@/server";
import Chats from "@/components/chats/Chats";
import Notifications from "@/components/Notifications";

export default function page() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [jobSeekerId, setJobSeekerId] = useState(null);
  const [employerId, setEmployerId] = useState(null);
  const [noConversation, setNoConversation] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // const [notificationCount, setNotificationCount] = useState(0);
  const [notificationCounts, setNotificationCounts] = useState({});
  const socket = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        id: data.senderId,
        content: data.text,
        createdAt: Date.now(),
      });
      // setNotificationCount((prevCount) => prevCount + 1);
      setNotificationCounts((prevCounts) => {
        const updatedCounts = { ...prevCounts };
        updatedCounts[data.senderId] = (updatedCounts[data.senderId] || 0) + 1; // Increment notification count for sender
        return updatedCounts;
      });
    });
  }, []);

  useEffect(() => {
    // arrivalMessage &&
    //   currentChat?.id?.includes(arrivalMessage.id) &&
    //   setMessages((prev) => [...prev, arrivalMessage]);
      if (arrivalMessage && currentChat?.id?.includes(arrivalMessage.id)) {
        setMessages((prev) => [...prev, arrivalMessage]);
        if (currentChat?.id.includes(arrivalMessage.id)) {
          // Reset notification count to 0 for the user whose chat is opened
          setNotificationCounts((prevCounts) => ({
            ...prevCounts,
            [arrivalMessage.id]: 0,
          }));
        }
      }
  }, [arrivalMessage]);

  useEffect(() => {
    socket.current?.emit("addUser", userId);
    socket.current.on("getUsers", (users) => {
      console.log(users);
    });
  }, [userId]);

  useEffect(() => {
    if (currentChat) {
      const jobSeekerId =
        currentChat?.employerId === userId
          ? currentChat?.jobSeekerId._id
          : null;
      const employerId =
        currentChat?.jobSeekerId === userId
          ? currentChat?.employerId._id
          : null;
      setJobSeekerId(jobSeekerId);
      setEmployerId(employerId);
    }
  }, [currentChat]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const getConversations = async () => {
        try {
          await axios
            .get(`${server}conversation/getConversations/${userId}`)
            .then((res) => {
              setConversations(res.data);
            })
            .catch((err) => {
              console.log(err.response.status, "Error in messenger");
              if (err?.response?.status === 404) {
                setNoConversation("No conversations");
                console.log("I worked");
              }
            });
        } catch (error) {
          console.log(error, "Error in messenger");
          if (error?.response?.status === 404) {
            setNoConversation("No conversations");
          }
        }
      };
      getConversations();
    }, 2000);
    return () => clearTimeout(timer);
  }, [userId]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        await axios
          .get(`${server}message/allMessages/${currentChat?.id}`, {
            next: { validate: 1 },
          })
          .then((res) => {
            setMessages(res?.data);
          });
      } catch (err) {
        console.log(err, "Error in messenger when fetching all messages.");
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    socket.current.emit("sendMessage", {
      senderId: userId,
      receiverId: employerId === null ? jobSeekerId : employerId,
      text: newMessage,
    });
    const url =
      employerId === null
        ? `message/${userId}/with/${jobSeekerId}`
        : `message/${employerId}/with/${userId}`;
    const res = await axios
      .post(`${server}${url}`, {
        id: userId,
        content: newMessage,
      })
      .then((res) => {
        setMessages([...messages, res?.data]);
      })
      .catch((err) => {
        console.log(err, "Error when trying to send message");
      })
      .finally(() => {
        setNewMessage("");
      });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className={styles.messenger}>
        <div className={styles.chatMenu}>
          <div className={styles.chatMenuWrapper}>
            <h3>Conversations</h3>
            {/* <Notifications notifications={notificationCount} /> */}
            {noConversation !== "" && <p>{noConversation}</p>}
            {conversations?.map((conversation) => (
              <div
                // onClick={() => setCurrentChat(conversation)}
                onClick={() => {
                  setCurrentChat(conversation);
                  // Reset notification count to 0 when chat is opened
                  setNotificationCounts((prevCounts) => ({
                    ...prevCounts,
                    [arrivalMessage?.id]: 0,
                  }));
                }}
                key={conversation._id}
              >
                <Conversation
                  conversation={conversation}
                  currentUser={userId}
                  key={conversation._id}
                  notificationCounts={notificationCounts}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.chatBox}>
          <div className={styles.chatBoxWrapper}>
            {currentChat ? (
              <>
                <div className={styles.chatsWrapper}>
                  <div className={styles.chatBoxHeader}>
                    {currentChat?.employerId === userId && (
                      <span>
                        Conversation with {currentChat?.jobSeekerId?.firstName}{" "}
                        {currentChat?.jobSeekerId?.lastName}
                      </span>
                    )}
                    {currentChat?.jobSeekerId === userId && (
                      <span>
                        Conversation with {currentChat?.employerId?.firstName}{" "}
                        {currentChat?.employerId?.lastName}
                      </span>
                    )}
                  </div>
                  <div className={styles.chatBoxTop}>
                    {messages.map((message) => (
                      <div ref={scrollRef} key={message._id}>
                        <Chats
                          message={message}
                          own={message.userId === userId}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.chatBoxBottom}>
                  <textarea
                    className={styles.chatMessageInput}
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button
                    className={styles.chatSubmitButton}
                    onClick={handleSubmit}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className={styles.noConversationText}>
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
