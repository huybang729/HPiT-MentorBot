import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { HistoryTab, ChatItem } from '../components/HistoryTab';
import { ChatSide, Message } from '../components/ChatSide';
import { ChatInput } from '../components/ChatInput';
import { UserStatusBar } from '../components/UserStatusBar';
import { useNavigate } from 'react-router-dom';
import { deleteConversation, getConversations, getListMessages, newConversation, sendBPMessage, updateConversation } from '../api/api';
import { startSSEStream, stopSSEStream } from '../services/sseClient';

interface User {
  _id: string;
  [key: string]: any;
}

interface ApiResponse {
  messages: {
    messages: Message[];
    meta: {
      nextToken?: string;
    };
  };
}

interface ConversationResponse {
  conversations: Array<{
    id: string;
    title?: string;
  }>;
}

// ID đặc biệt cho đoạn chat tạm
export const PLACEHOLDER_CHAT_ID = '__placeholder_chat__';

export const ChatPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<string>(PLACEHOLDER_CHAT_ID);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [isBotResponding, setIsBotResponding] = useState<boolean>(false);
  const [nextMessageToken, setNextMessageToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesRef = useRef<Message[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const token = useMemo(() => localStorage.getItem('x-user-key') || "", []);

  // Tạo đoạn chat tạm cho history
  const placeholderChat: ChatItem = useMemo(() => ({
    id: PLACEHOLDER_CHAT_ID,
    title: "Cuộc hội thoại mới"
  }), []);

  // History với đoạn chat tạm ở đầu
  const historyWithPlaceholder = useMemo(() => {
    return [placeholderChat, ...history];
  }, [placeholderChat, history]);

  // Kiểm tra xem có phải đang ở đoạn chat tạm không
  const isPlaceholderChat = selectedChat === PLACEHOLDER_CHAT_ID;

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      stopSSEStream();
    };
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleLogOut = useCallback(() => {
    localStorage.clear();
    navigate("/login");
  }, [navigate]);

  const handleNewChat = useCallback(async (): Promise<string | null> => {
    if (!token) return null;

    try {
      const res = await newConversation(token);
      const conversationId = res.conversationId;

      await loadConversations();

      setSelectedChat(conversationId);
      setMessages([]);
      return conversationId;
    } catch (error: any) {
      console.error('Error creating new chat:', error.message);
      return null;
    }
  }, [token]);

  const loadMessage = useCallback(async (chatId?: string) => {
    const targetChat = chatId || selectedChat;

    if (targetChat === PLACEHOLDER_CHAT_ID) {
      setMessages([]);
      setNextMessageToken(null);
      return;
    }

    if (!targetChat || !token) return;

    setIsLoading(true);
    try {
      const res: ApiResponse = await getListMessages(targetChat, token);
      const { messages: apiMessages, meta } = res.messages;

      setMessages(apiMessages.reverse());
      setNextMessageToken(meta.nextToken || null);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedChat, token]);

  const loadMoreMessages = useCallback(async () => {
    if (!nextMessageToken || !selectedChat || !token || isLoading || isPlaceholderChat) return;

    setIsLoading(true);
    try {
      const res: ApiResponse = await getListMessages(selectedChat, token, nextMessageToken);
      const { messages: apiMessages, meta } = res.messages;

      setMessages(prevMessages => [...apiMessages, ...prevMessages]);
      setNextMessageToken(meta.nextToken || null);
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [nextMessageToken, selectedChat, token, isLoading, isPlaceholderChat]);

  const loadConversations = useCallback(async () => {
    if (!token) return;

    try {
      const res: ConversationResponse = await getConversations(token);
      const conversationHistory = res.conversations.map((conv) => ({
        id: conv.id,
        title: conv.title || `Cuộc hội thoại ${conv.id.slice(-8)}`
      }));

      setHistory(conversationHistory);

      if (firstLoad) {
        if (conversationHistory.length > 0) {
          setSelectedChat(conversationHistory[0].id);
        } else {
          setSelectedChat(PLACEHOLDER_CHAT_ID);
        }
        setFirstLoad(false);
      }
    } catch (err: any) {
      console.error('Error loading conversations:', err.message);
    }
  }, [token, firstLoad]);

  const isSelectedChatInHistory = useMemo(() =>
    history.some(chat => chat.id === selectedChat),
    [history, selectedChat]
  );

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isBotResponding) return;

    let currentChatId = selectedChat;
    let isFirstChat = false;
    if (isPlaceholderChat || !isSelectedChatInHistory) {
      const newChatId = await handleNewChat();
      if (!newChatId) return;
      currentChatId = newChatId;
      setSelectedChat(newChatId);
    }

    console.log('Current chat ID:', messages.length);
    if (messages.length === 0) {
      isFirstChat = true;
    }

    if (isFirstChat) {
      const hiMessage: Message = {
        id: `msg_${Date.now()}`,
        createdAt: new Date().toISOString(),
        userId: userId,
        payload: {
          type: 'text',
          text: "Hi",
        },
      };

      setMessages(prevMessages => [...prevMessages, hiMessage]);
      await sendBPMessage(currentChatId, "Hi", token);
       await updateConversation(currentChatId, text.slice(0, 30), token);
       await loadConversations();
    }

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      createdAt: new Date().toISOString(),
      userId: userId,
      payload: {
        type: 'text',
        text: text.trim(),
      },
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsBotResponding(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Timeout để hủy SSE sau 10 giây
    const timeoutId = setTimeout(() => {
      console.log('[SSE] Timeout after 10 seconds, stopping stream');
      stopSSEStream();
      setIsBotResponding(false);

      // Thêm message lỗi timeout (tùy chọn)
      const timeoutMessage: Message = {
        id: `msg_timeout_${Date.now()}`,
        createdAt: new Date().toISOString(),
        userId: 'system',
        payload: {
          type: 'text',
          text: 'Phản hồi quá lâu, vui lòng thử lại.',
        },
      };
      setMessages(prevMessages => [...prevMessages, timeoutMessage]);
    }, 15000);

    try {
      if (!token) throw new Error('Authentication token not found');

      await sendBPMessage(currentChatId, text.trim(), token);

      stopSSEStream();

      startSSEStream(
        currentChatId,
        token,
        (event) => {
          // Clear timeout khi nhận được response
          clearTimeout(timeoutId);

          let data;
          try {
            data = JSON.parse(event.data);
          } catch (err) {
            console.error('[SSE] JSON parse error:', err);
            return;
          }

          if (data.type === 'message_created') {
            const botMessage: Message = {
              id: data.data.id,
              createdAt: data.data.createdAt,
              userId: data.data.userId,
              payload: data.data.payload,
            };

            setMessages(prevMessages => [...prevMessages, botMessage]);
            stopSSEStream();
            setIsBotResponding(false);
            return;
          }

          if (data.isDone) {
            stopSSEStream();
            setIsBotResponding(false);
          }
        },
        (error) => {
          // Clear timeout khi có lỗi
          clearTimeout(timeoutId);
          console.error('[SSE] Error:', error);
          setIsBotResponding(false);
        }
      );
    } catch (error: any) {
      // Clear timeout khi có lỗi
      clearTimeout(timeoutId);
      console.error('[Send Message Error]', error.message);
      setIsBotResponding(false);
    }
  }, [selectedChat, isPlaceholderChat, isSelectedChatInHistory, handleNewChat, userId, token, isBotResponding]);

  const handleDeleteConversation = useCallback(async () => {
    if (!selectedChat || !token || isPlaceholderChat) return;

    try {
      await deleteConversation(selectedChat, token);

      // Reload conversations sau khi xóa
      await loadConversations();

      // Sau khi reload, kiểm tra xem còn conversations nào không
      const updatedRes: ConversationResponse = await getConversations(token);
      const remainingConversations = updatedRes.conversations;

      if (remainingConversations.length > 0) {
        // Nếu còn conversations, chọn conversation đầu tiên
        setSelectedChat(remainingConversations[0].id);
      } else {
        // Nếu không còn conversations nào, chuyển về placeholder chat
        setSelectedChat(PLACEHOLDER_CHAT_ID);
        setMessages([]);
        setNextMessageToken(null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }, [selectedChat, token, isPlaceholderChat, loadConversations]);

  const handleRenameConversation = useCallback(async (chatId: string, newTitle: string) => {
    await updateConversation(chatId, newTitle.slice(0, 30), token);
    await loadConversations();
  }, []);

  const handleSelectChat = useCallback(async (chatId: string) => {
    if (isBotResponding) return;
    setSelectedChat(chatId);
    if (chatId === PLACEHOLDER_CHAT_ID) {
      setMessages([]);
      setNextMessageToken(null);
    }
  }, [isBotResponding, selectedChat]);

  // Tạo chat mới từ button "New Chat"
  const handleNewChatFromButton = useCallback(async () => {
    if (isBotResponding) return;

    const newChatId = await handleNewChat();
    if (newChatId) {
      setSelectedChat(newChatId);
    }
  }, [handleNewChat, isBotResponding]);

  useEffect(() => {
    const storedUser = localStorage.getItem('vlUser');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    try {
      const userData: User = JSON.parse(storedUser);
      console.log('User data:', userData);
      console.log('User ID:', storedUser);
      setUser(userData);
      setUserId(userData._id);
      loadConversations();
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate, loadConversations]);

  useEffect(() => {
    if (selectedChat && selectedChat !== PLACEHOLDER_CHAT_ID) {
      loadMessage(selectedChat);
    } else if (selectedChat === PLACEHOLDER_CHAT_ID) {
      setMessages([]);
      setNextMessageToken(null);
    }
  }, [selectedChat, loadMessage]);

  const chatSideStyle = useMemo(() => ({
    marginLeft: isExpanded ? '256px' : '0px',
    width: isExpanded ? 'calc(100% - 256px)' : '100%',
  }), [isExpanded]);

  return (
    <div className="flex h-screen relative overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 h-full absolute left-0 top-0 z-0">
        <HistoryTab
          chats={historyWithPlaceholder}
          user={user}
          selectedChatId={selectedChat}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChatFromButton}
          onToggleSidebar={toggleExpand}
          handleDeleteConversation={handleDeleteConversation}
          handleRenameConversation={handleRenameConversation}
        />
      </div>

      {/* Main Chat Area */}
      <div
        className="flex flex-col transition-all duration-300 ease-in-out z-10 h-full bg-white"
        style={chatSideStyle}
      >
        <UserStatusBar
          user={user}
          isExpanded={isExpanded}
          toggleExpand={toggleExpand}
          onLogout={handleLogOut}
        />

        <div className="flex flex-col items-center w-full h-full bg-white">
          <ChatSide
            messages={messages}
            currentUserId={userId}
            isEnd={nextMessageToken === null}
            isLoading={isBotResponding}
            loadMoreMessages={loadMoreMessages}
            isPlaceholderChat={isPlaceholderChat}
            onSendTemplateMessage={handleSendMessage}
          />
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isBotResponding}
            placeholder={isPlaceholderChat ? "Bắt đầu cuộc hội thoại mới..." : "Nhập tin nhắn..."}
          />
        </div>
      </div>
    </div>
  );
};