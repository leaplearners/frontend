import { Chat } from "@/lib/types";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";

export const ChatHeader = ({
  activeChat,
  chats,
  setShowChatList,
}: {
  activeChat: string | null;
  chats: Chat[];
  setShowChatList: (show: boolean) => void;
}) => {
  const currentChat = chats.find((chat) => chat.id === activeChat);

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowChatList(true)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {currentChat?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            {currentChat?.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">{currentChat?.name}</h2>
            <p className="text-sm text-gray-600 flex items-center">
              <span
                className={`w-2 h-2 rounded-full mr-1.5 ${
                  currentChat?.online ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
              {currentChat?.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const MessageStatus = ({
  status,
  isUser,
}: {
  status?: string;
  isUser: boolean;
}) => {
  if (!isUser) return null;

  switch (status) {
    case "sending":
      return (
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      );
    case "sent":
      return (
        <div className="flex items-center space-x-1">
          <Check className="w-3 h-3 text-gray-400" />
        </div>
      );
    case "delivered":
      return (
        <div className="flex items-center space-x-1">
          <CheckCheck className="w-3 h-3 text-gray-400" />
        </div>
      );
    case "read":
      return (
        <div className="flex items-center space-x-1">
          <CheckCheck className="w-3 h-3 text-blue-500" />
        </div>
      );
    default:
      return null;
  }
};

export const MessageBubble = ({
  message,
  chats,
  activeChat,
  isSending = false,
}: {
  message: {
    id: number;
    sender: string;
    text: string;
    timestamp: string;
    type: string;
    read?: boolean;
    status?: string;
  };
  chats: Chat[];
  activeChat: string | null;
  isSending?: boolean;
}) => {
  const isUser = message.sender === "user";
  const currentChat = chats.find((chat) => chat.id === activeChat);

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 group`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
          {currentChat?.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
      )}

      <div className="relative">
        <div
          className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl ${
            isUser
              ? "bg-blue-500 text-white rounded-br-md"
              : "bg-white text-gray-900 rounded-bl-md shadow-sm"
          } ${isSending ? "opacity-70" : ""}`}
        >
          <div className="px-4 py-3">
            <p className="text-sm leading-relaxed break-words">
              {message.text}
            </p>
            <div
              className={`flex items-center justify-between mt-1.5 ${
                isUser ? "text-blue-100" : "text-gray-500"
              }`}
            >
              <span className="text-xs">{message.timestamp}</span>
              {isUser && (
                <div className="flex items-center ml-2">
                  <MessageStatus status={message.status} isUser={isUser} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs ml-2">
          You
        </div>
      )}
    </div>
  );
};

export const MessageInput = React.memo(
  ({
    newMessage,
    setNewMessage,
    handleSendMessage,
    inputRef,
    isTyping = false,
    isTutorMode = false,
    quickResponses = [],
  }: {
    newMessage: string;
    setNewMessage: (value: string) => void;
    handleSendMessage: () => void;
    inputRef: React.RefObject<HTMLTextAreaElement | null>;
    isTyping?: boolean;
    isTutorMode?: boolean;
    quickResponses?: string[];
  }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showQuickResponses, setShowQuickResponses] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const quickResponsesRef = useRef<HTMLDivElement>(null);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewMessage(e.target.value);
      // Auto-resize textarea
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.height =
          Math.min(inputRef.current.scrollHeight, 120) + "px";
      }
    };

    const onEmojiClick = (emojiObject: any) => {
      const emoji = emojiObject.emoji;
      const cursor = inputRef.current?.selectionStart || 0;
      const textBefore = newMessage.substring(0, cursor);
      const textAfter = newMessage.substring(cursor);
      const newText = textBefore + emoji + textAfter;

      setNewMessage(newText);

      // Focus back to input and set cursor position after emoji
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const newCursor = cursor + emoji.length;
          inputRef.current.setSelectionRange(newCursor, newCursor);
        }
      }, 0);
    };

    const handleQuickResponse = (response: string) => {
      setNewMessage(response);
      setShowQuickResponses(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    // Close emoji picker and quick responses when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target as Node)
        ) {
          setShowEmojiPicker(false);
        }
        if (
          quickResponsesRef.current &&
          !quickResponsesRef.current.contains(event.target as Node)
        ) {
          setShowQuickResponses(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div className="bg-white border-t border-gray-200 p-4 relative">
        {/* Quick Responses for Tutor Mode */}
        {isTutorMode && quickResponses.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Quick Responses
              </span>
              <button
                onClick={() => setShowQuickResponses(!showQuickResponses)}
                className="text-xs text-blue-500 hover:text-blue-600"
              >
                {showQuickResponses ? "Hide" : "Show"}
              </button>
            </div>
            {showQuickResponses && (
              <div
                ref={quickResponsesRef}
                className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto"
              >
                {quickResponses.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickResponse(response)}
                    className="text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  >
                    {response}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-end space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1 relative bg-gray-100 rounded-2xl">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder={
                isTyping
                  ? "They are typing..."
                  : isTutorMode
                  ? "Type your response..."
                  : "Type your message..."
              }
              className="w-full px-4 py-3 bg-transparent border-0 resize-none focus:outline-none focus:ring-0 max-h-32 text-sm"
              rows={1}
              disabled={isTyping}
            />
            <button
              className="absolute right-3 bottom-3 p-1 hover:bg-gray-200 rounded-full transition-colors"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isTyping}
            className={`p-3 rounded-full transition-all ${
              newMessage.trim() && !isTyping
                ? "bg-blue-500 hover:bg-blue-600 transform hover:scale-105"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-full right-0 mb-2 z-50"
          >
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              width={350}
              height={400}
              searchPlaceholder="Search emoji..."
              lazyLoadEmojis={true}
            />
          </div>
        )}
      </div>
    );
  }
);
