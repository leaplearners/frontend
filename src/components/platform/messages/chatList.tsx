import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Chat } from "@/lib/types";

function ChatList({
  chats,
  activeChat,
  setActiveChat,
  setShowChatList,
  messages,
}: {
  chats: Chat[];
  activeChat: string | null;
  setActiveChat: (id: string) => void;
  setShowChatList: (show: boolean) => void;
  messages: any[];
}) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUnreadCount = (chatId: string) =>
    messages.filter((m) => m.sender === chatId && !m.read).length;

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
              {messages.filter((m) => !m.read && m.sender !== "user").length}
            </span>
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 h-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => {
              setActiveChat(chat.id);
              setShowChatList(false);
            }}
            className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
              activeChat === chat.id
                ? "bg-blue-50 border-l-4 border-l-blue-500"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                  {chat.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-textSubtitle whitespace-nowrap">
                    {chat.lastTime}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-textSubtitle truncate">
                    {chat.lastMessage}
                  </p>
                  {getUnreadCount(chat.id) > 0 && (
                    <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                      {getUnreadCount(chat.id)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-textSubtitle mt-1 truncate">
                  {chat.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatList;
