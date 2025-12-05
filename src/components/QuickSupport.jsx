import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Mail, MessageSquare } from 'lucide-react';

const QuickSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm Zanu AI. How can I help you today?", sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen]);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newUserMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI delay
    setTimeout(() => {
      const newAiMsg = { id: Date.now() + 1, text: "Zanu AI is currently under development", sender: 'ai' };
      setMessages(prev => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const socialLinks = [
    {
      name: 'Zanu AI',
      action: () => { setIsChatOpen(true); setIsOpen(false); },
      color: 'bg-violet-600',
      hoverColor: 'hover:bg-violet-700',
      icon: <img src="/zanu-ai-icon.png" alt="Zanu AI" className="w-8 h-8 rounded-full object-cover" />
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/8801894634149',
      color: 'bg-[#25D366]',
      hoverColor: 'hover:bg-[#1fb855]',
      icon: (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/ZanTechBD',
      color: 'bg-[#1877F2]',
      hoverColor: 'hover:bg-[#0d65d9]',
      icon: (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'Email',
      url: 'mailto:zantechbd@gmail.com',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      icon: <Mail className="w-5 h-5 text-white" />
    }
  ];

  return (
    <div className="fixed right-6 bottom-6 z-[9999] flex flex-col items-end gap-4 font-sans">
      {/* Chat Window */}
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-[350px] h-[450px] flex flex-col overflow-hidden border border-gray-100 mb-2 transition-all duration-300 origin-bottom-right ${
          isChatOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none absolute bottom-16 right-0'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-white/20 rounded-full backdrop-blur-sm">
              <img src="/zanu-ai-icon.png" alt="Zanu AI" className="w-8 h-8 rounded-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Zanu AI</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsChatOpen(false)} 
            className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-3.5 text-sm shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-2xl rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex gap-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 rounded-full px-4 py-2.5 text-sm transition-all outline-none"
          />
          <button 
            type="submit" 
            className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg" 
            disabled={!inputText.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Expanded Options */}
      <div className={`flex flex-col gap-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none absolute bottom-16 right-0'}`}>
        {socialLinks.map((link, index) => (
          link.url ? (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${link.color} ${link.hoverColor} hover:scale-110 text-white`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {link.icon}
              <span className="absolute right-14 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
                {link.name}
              </span>
            </a>
          ) : (
            <button
              key={index}
              onClick={link.action}
              className={`group relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${link.color} ${link.hoverColor} hover:scale-110 text-white`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {link.icon}
              <span className="absolute right-14 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
                {link.name}
              </span>
            </button>
          )
        ))}
      </div>

      {/* Main Toggle Button */}
      <button 
        onClick={toggleWidget} 
        className={`relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-105 active:scale-95 z-50 ${isOpen ? 'bg-gray-800 rotate-90' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        
        {/* Pulse effect when closed */}
        {!isOpen && !isChatOpen && (
          <span className="absolute -inset-1 rounded-full bg-blue-400 opacity-30 animate-ping pointer-events-none"></span>
        )}
      </button>
    </div>
  );
};

export default QuickSupport;
