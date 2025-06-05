// HistoryTab.tsx
import React, { useState } from 'react';
import { BookMarked, SquarePen, Ellipsis, EditIcon, MoreVertical } from "lucide-react";
import { EditConversationMenu } from './EditConversationMenu';
import { PLACEHOLDER_CHAT_ID } from '../pages/ChatPage';

export interface ChatItem {
  id: string;
  title?: string;
}

interface HistoryTabProps {
  chats: ChatItem[];
  user: any,
  selectedChatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onToggleSidebar: () => void;
  handleDeleteConversation: () => void;
  handleRenameConversation: (chatId: string, title: string) => void;
}
export const HistoryTab: React.FC<HistoryTabProps> = ({ chats, user, selectedChatId, onSelectChat, onNewChat, onToggleSidebar, handleDeleteConversation, handleRenameConversation }) => {
  const [isRename, setIsRename] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [cursorChat, setCursorChat] = useState<string>(selectedChatId);

  const handleRename = () => {
    if (newTitle.trim()) {
      console.log('Renaming conversation to:', cursorChat,newTitle.trim());
      handleRenameConversation(cursorChat, newTitle.trim());
      const chatIndex = chats.findIndex(chat => chat.id === cursorChat);
      if (chatIndex !== -1) {
        chats[chatIndex].title = newTitle.trim();
      }
      setIsRename(false);
      setNewTitle('');
      setCursorChat(selectedChatId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      handleRename();
    }
    if (e.key === 'Escape') {
      setIsRename(false);
      setNewTitle('');
      setCursorChat(selectedChatId);
    }
  };

  const handleBlur = () => {
    handleRename();
  };

  return (
    <div className="bg-gray-900 text-white h-full p-4 w-64 relative">
      <div className="flex justify-between mb-4">
        <button
          onClick={onToggleSidebar}
          className="top-4 right-4 p-1.5 rounded-lg bg-gray-50 hover:bg-gray-300"
          aria-label="Ẩn sidebar"
        >
          <BookMarked color="black" />
        </button>
        <button
          onClick={onNewChat}
          className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-300"
          aria-label="Tạo cuộc trò chuyện mới"
        >
          <SquarePen color="black" />
        </button>
      </div>

      <div className="flex flex-col h-full justify-between mb-4">
        {/* Danh sách chat */}
        <ul className="space-y-2">
          {chats.map((chat, index) => (
            chat.id !== PLACEHOLDER_CHAT_ID && (
              <li
                key={chat.id}
                className={`flex justify-between items-center cursor-pointer px-3 py-2 rounded transition text-sm truncate
          ${chat.id === selectedChatId ? 'bg-gray-700 font-bold text-white' : 'hover:bg-gray-700'}
        `}
                title={chat.title || `Cuộc trò chuyện ${index + 1}`}
                onClick={() => {
                  onSelectChat(chat.id)
                  setCursorChat(chat.id);
                }}
              >
                <div className="flex-1 truncate">
                  {isRename && chat.id === cursorChat ? (
                    <input
                      type="text"
                      className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-400"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleBlur}
                      autoFocus
                    />
                  ) : (
                    chat.title || `Cuộc trò chuyện ${index + 1}`
                  )}
                </div>
                <EditConversationMenu
                  onRename={() => {
                    setIsRename(!isRename);
                    setCursorChat(chat.id);
                    setNewTitle(chat.title || `Cuộc trò chuyện ${index + 1}`);
                  }}
                  onDelete={handleDeleteConversation}
                />
              </li>
            )
          ))}
        </ul>

        <div className="flex items-center justify-between mb-15">
          <div className="flex flex-col items-start gap-1 w-50">
            <div className="flex items-center gap-2 max-w-full">
              <img
                src="./src/assets/user.jpg"
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-400 flex-shrink-0"
                draggable={false}
              />
              <h1 className="text-lg font-semibold text-gray-200 truncate max-w-[140px]">
                {user?.username || 'user'}
              </h1>
            </div>
            <p className="text-lg text-gray-600 ml-2 truncate max-w-[200px]">
              {user?.gmail || 'user@gmail.com'}
            </p>
          </div>
          <button
            className="p-2 rounded-full transition"
            aria-label="More options"
          >
            <MoreVertical className="w-6 h-6 text-gray-600" />
          </button>
        </div>

      </div>
    </div>
  );
};