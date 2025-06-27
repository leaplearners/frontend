import { Chat } from "@/lib/types";
import { ArrowLeft, Send, Paperclip, Smile } from "lucide-react";
import React from "react";

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

export const MessageBubble = ({
  message,
  chats,
  activeChat,
}: {
  message: {
    id: number;
    sender: string;
    text: string;
    timestamp: string;
    type: string;
  };
  chats: Chat[];
  activeChat: string | null;
}) => {
  const isUser = message.sender === "user";
  const currentChat = chats.find((chat) => chat.id === activeChat);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
          {currentChat?.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>
      )}

      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl ${
          isUser
            ? "bg-blue-500 text-white rounded-br-md"
            : "bg-bgWhiteGray text-textGray rounded-bl-md"
        }`}
      >
        <div className="px-4 py-3">
          <p className="text-sm leading-relaxed">{message.text}</p>
          <p
            className={`text-xs mt-1.5 ${
              isUser ? "text-blue-100" : "text-gray-500"
            } text-right`}
          >
            {message.timestamp}
          </p>
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
  }: {
    newMessage: string;
    setNewMessage: (value: string) => void;
    handleSendMessage: () => void;
    inputRef: React.RefObject<HTMLTextAreaElement | null>;
  }) => {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    return (
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1 relative bg-gray-100 rounded-2xl">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-transparent border-0 resize-none focus:outline-none focus:ring-0 max-h-32"
              rows={1}
            />
            <button className="absolute right-3 bottom-3 p-1 hover:bg-gray-200 rounded-full transition-colors">
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full transition-all ${
              newMessage.trim()
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    );
  }
);
