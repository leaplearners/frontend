"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ChatList from "./chatList";
import { chats, defaultMessages } from "@/lib/utils";
import { ChatHeader, MessageBubble, MessageInput } from "./chatHeader";
import { useEscapeClose } from "@/hooks/use-escape-close";

const MessagingPlatform = () => {
  const [messages, setMessages] = useState(
    defaultMessages.map((msg) => ({
      ...msg,
      read: msg.sender === "user", // user messages are read by default
    }))
  );
  const [newMessage, setNewMessage] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [showChatList, setShowChatList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (activeChat) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, activeChat, scrollToBottom]);

  useEscapeClose(() => {
    setActiveChat(null);
    setShowChatList(true);
  }, !!activeChat);

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim() && activeChat) {
      const message = {
        id: Date.now(),
        sender: "user",
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "text",
        read: true,
      };

      setMessages((prev) => [...prev, message]);
      setNewMessage("");

      setTimeout(() => {
        const response = {
          id: Date.now() + 1,
          sender: activeChat,
          text: "I'll prepare some examples for the chain rule. Give me a moment!",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: "text",
          read: false,
        };
        setMessages((prev) => [...prev, response]);
      }, 2000);
    }
  }, [newMessage, activeChat]);

  const handleSelectChat = (id: string) => {
    setActiveChat(id);
    setShowChatList(false);
    setMessages((prev) =>
      prev.map((msg) => (msg.sender === id ? { ...msg, read: true } : msg))
    );
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 flex shadow-lg rounded-xl overflow-auto scrollbar-hide border border-gray-200">
      <div className={`md:hidden ${showChatList ? "block" : "hidden"} w-full`}>
        <ChatList
          chats={chats}
          activeChat={activeChat}
          setActiveChat={handleSelectChat}
          setShowChatList={setShowChatList}
          messages={messages}
        />
      </div>

      <div className="hidden md:block">
        <ChatList
          chats={chats}
          activeChat={activeChat}
          setActiveChat={handleSelectChat}
          setShowChatList={setShowChatList}
          messages={messages}
        />
      </div>

      <div
        className={`${
          showChatList ? "hidden md:flex" : "flex"
        } flex-1 flex-col`}
      >
        {activeChat && (
          <ChatHeader
            chats={chats}
            activeChat={activeChat}
            setShowChatList={setShowChatList}
          />
        )}

        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-200 to-gray-300">
          <div className="max-w-3xl mx-auto h-full">
            {!activeChat ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="bg-gray-300 border-2 border-dashed rounded-xl w-16 h-16 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600 max-w-md">
                  Choose a chat from the list to start messaging.
                </p>
              </div>
            ) : (
              <>
                {messages
                  .filter(
                    (msg) => msg.sender === activeChat || msg.sender === "user"
                  )
                  .map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      chats={chats}
                      activeChat={activeChat}
                    />
                  ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {activeChat && (
          <MessageInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            inputRef={inputRef}
          />
        )}
      </div>
    </div>
  );
};

export default MessagingPlatform;
