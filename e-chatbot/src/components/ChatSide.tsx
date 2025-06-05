import React, { useEffect, useRef } from 'react';
import { CircleUserRound, MessageCircle, Sparkles } from "lucide-react";

interface MessagePayload {
  type: string;
  text: string;
}

export interface Message {
  id: string;
  createdAt: string;
  userId?: string;
  payload: MessagePayload;
}

interface ChatSideProps {
  messages: Message[];
  currentUserId: string;
  isEnd?: boolean;
  isLoading?: boolean;
  loadMoreMessages?: () => void;
  isPlaceholderChat?: boolean;
  onSendTemplateMessage: (template: string) => void;
}

export const ChatSide: React.FC<ChatSideProps> = ({
  messages,
  currentUserId,
  isEnd,
  isLoading,
  loadMoreMessages,
  isPlaceholderChat = false,
  onSendTemplateMessage
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadingMoreRef = useRef(false);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    if (container.scrollTop <= 0 && !isEnd) {
      isLoadingMoreRef.current = true;
      loadMoreMessages?.();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || messages.length === 0) return;

    if (isLoadingMoreRef.current) {
      isLoadingMoreRef.current = false;
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  const handleSendTemplateMessage = (template: string) => {
    onSendTemplateMessage(template);
    console.log('Sent template message:', template);
  };

  const PlaceholderChatContent = () => (
    <div className="flex flex-col select-none items-center justify-center h-full text-black px-4">
      <div className="relative mb-6">
        <img
          src="./src/assets/bot_avt.png"
          alt="Bot Avatar"
          className="w-32 h-32 rounded-full shadow-lg"
          draggable={false}
        />
        <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-2">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>

      <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        HPiT MentorBot
      </h1>

      <h3 className="text-lg text-gray-600 mb-6 text-center max-w-lg">
        Academic Advisor Chatbot for the Honors Program, Faculty of Information Technology
      </h3>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 max-w-md">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Bắt đầu cuộc hội thoại
          </h2>
        </div>
        <p className="text-gray-600 text-center">
          Bạn muốn tìm hiểu gì về thông tin học vụ?
        </p>
      </div>

      {/* Gợi ý câu hỏi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group"
          onClick={() => handleSendTemplateMessage("Chương trình đào tạo ngành của tôi gồm những môn học nào?")}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h4 className="font-medium text-gray-800 group-hover:text-blue-600">Thông tin chương trình học</h4>
          </div>
          <p className="text-sm text-gray-600">Tìm hiểu về khung chương trình, môn học, điều kiện tốt nghiệp</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group"
          onClick={() => handleSendTemplateMessage("Quy định và thủ tục trong trường")}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h4 className="font-medium text-gray-800 group-hover:text-green-600">Quy định và thủ tục</h4>
          </div>
          <p className="text-sm text-gray-600">Hướng dẫn các thủ tục học vụ, quy định điểm danh, thi cử</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group"
          onClick={() => handleSendTemplateMessage("Làm sao để đăng ký học bổng khuyến khích học tập?")}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <h4 className="font-medium text-gray-800 group-hover:text-purple-600">Học bổng và hỗ trợ</h4>
          </div>
          <p className="text-sm text-gray-600">Thông tin về học bổng, chế độ hỗ trợ sinh viên</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group"
          onClick={() => handleSendTemplateMessage("Các hoạt động và sự kiện trong trường")}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <h4 className="font-medium text-gray-800 group-hover:text-orange-600">Hoạt động và sự kiện</h4>
          </div>
          <p className="text-sm text-gray-600">Cập nhật các hoạt động, sự kiện của chương trình</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          💡 Nhập câu hỏi của bạn vào ô chat bên dưới để bắt đầu
        </p>
      </div>
    </div>
  );

  // Component cho empty state khi có lịch sử chat nhưng chưa có tin nhắn
  const EmptyChatContent = () => (
    <div className="flex flex-col select-none items-center justify-center h-full mt-20 text-black px-4">
      <img
        src="./src/assets/bot_avt.png"
        alt="Bot Avatar"
        className="w-24 h-24 rounded-full mb-4"
        draggable={false}
      />
      <h1 className="text-2xl font-semibold text-center mb-2">
        HPiT MentorBot
      </h1>
      <h3 className="text-base text-gray-600 mb-4 text-center">
        Academic Advisor Chatbot for the Honors Program, Faculty of Information Technology
      </h3>
      <h2 className="text-lg text-gray-600 mb-4 text-center">
        Bạn muốn tìm hiểu gì về thông tin học vụ?
      </h2>
    </div>
  );

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 p-4 w-3/4 h-3/5 overflow-y-auto bg-white"
    >
      <div className="space-y-4">
        {/* Hiển thị placeholder content khi là placeholder chat */}
        {isPlaceholderChat ? (
          <PlaceholderChatContent />
        ) : messages.length === 0 ? (
          <PlaceholderChatContent />
        ) : (
          <>
            {/* Hiển thị messages khi có tin nhắn */}
            {messages.map((msg) => {
              const isUserMessage = msg.userId === currentUserId;
              const text = msg.payload?.text;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 max-w-xl ${isUserMessage ? 'justify-end ml-auto' : 'justify-start mr-auto'
                    }`}
                >
                  {!isUserMessage && (
                    <img
                      src="./src/assets/bot_avt.png"
                      alt="Bot Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  )}

                  <div
                    className={`p-3 rounded-lg ${isUserMessage ? 'bg-blue-200' : 'bg-gray-200'
                      }`}
                  >
                    {text}
                  </div>

                  {isUserMessage && (
                    <img
                      src="./src/assets/user.jpg"
                      alt="Bot Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                </div>
              );
            })}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex flex-row gap-2 my-4">
                <div className="animate-pulse bg-gray-300 w-8 h-8 rounded-full"></div>
                <div className="flex flex-col gap-2">
                  <div className="animate-pulse bg-gray-300 w-28 h-4 rounded-full"></div>
                  <div className="animate-pulse bg-gray-300 w-36 h-4 rounded-full"></div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};