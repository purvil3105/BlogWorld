import React, { useState, useRef, useEffect } from 'react';
import axiosInstance from '../conf/axiosInstance';
import { X, Send, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from './index';

export default function AiWriterPanel({ isOpen, onClose, setValue, getValues, onCoverImageGenerated }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsGenerating(true);

    try {
      // The history sent to the backend
      const history = messages.map(m => ({ role: m.role, text: m.text }));

      const response = await axiosInstance.post('/ai/writer-chat', {
        history,
        message: userMessage
      });

      const aiData = response.data;

      setMessages(prev => [...prev, { role: 'model', text: aiData.reply }]);

      if (aiData.status === 'ready' && aiData.draft) {
        // Fill in the draft
        setValue('title', aiData.draft.title || '', { shouldValidate: true });
        setValue('slug', aiData.draft.slug || '', { shouldValidate: true });
        setValue('category', aiData.draft.category || 'Technology');
        setValue('content', aiData.draft.contentHtml || '', { shouldValidate: true });
        
        // Start cover image generation
        if (aiData.draft.imagePrompt) {
          generateCoverImage(aiData.draft.imagePrompt);
        }
      }
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error while trying to help. Please try again.' }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCoverImage = async (prompt) => {
    setIsGeneratingImage(true);
    try {
      const response = await axiosInstance.post('/ai/writer-chat/cover-image', { imagePrompt: prompt });
      if (response.data.imageUrl) {
        onCoverImageGenerated(response.data.imageUrl);
      }
    } catch (error) {
      console.error('Image Gen Error:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-gray-900 border-l border-gray-700 shadow-2xl flex flex-col z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold flex items-center text-white">
          <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
          BlogWorld AI
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50 text-purple-400" />
            <p>I'm your AI writing assistant.</p>
            <p className="text-sm mt-2">Tell me what you'd like to write about!</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-200 rounded-lg p-3 flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-purple-400" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}

        {isGeneratingImage && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-200 rounded-lg p-3 flex items-center">
              <ImageIcon className="w-4 h-4 mr-2 animate-pulse text-green-400" />
              <span className="text-sm">Generating cover image...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            disabled={isGenerating}
          />
          <Button onClick={handleSend} disabled={isGenerating || !input.trim()} className="bg-purple-600 hover:bg-purple-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
