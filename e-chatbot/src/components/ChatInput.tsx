import React, { useState } from 'react'
import { Send } from 'lucide-react';
export const ChatInput = ({ onSendMessage }: any) => {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    onSendMessage(input)
    setInput('')
  }

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="flex w-2/5 rounded-4xl border border-gray-300 overflow-hidden mb-30">
      <input
        type="text"
        className="flex-1 px-4 py-2 outline-none"
        placeholder="Nhập nội dung..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <div className='flex items-center pr-1 py-1'>
        <button
          onClick={handleSend}
          className="bg-gray-400 text-white p-2 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-700 transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}