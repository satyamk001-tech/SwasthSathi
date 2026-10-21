import React, { useState, useEffect, useRef } from 'react';
import { Member, ChatMessage } from '../types';
import { C } from '../data/seedData';
import { idb } from '../lib/idb';
import { chatWithAI } from '../lib/aiService';
import { uid } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { Btn } from '../components/common/Button';
import { Spin } from '../components/common/Spinner';

export const BotPage: React.FC = () => {
  const { toast } = useApp();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "👋 Namaste! I am your SwasthSathi AI Health Companion.\n\nI can assist you with:\n• Explaining lab reports & out-of-range biomarkers 🔬\n• Medication timing, interactions & side effects 💊\n• Personalized Indian diet & nutrition advice 🥗\n• Doctor appointment preparation & vital monitoring 🩺\n\nHow can I help you and your family today?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const QUICK_QUESTIONS = [
    'Explain HbA1c 7.8%',
    'Metformin side effects?',
    'How to lower LDL cholesterol?',
    'Safe blood pressure range?',
    'Foods good for arthritis?',
    'When is chest pain serious?'
  ];

  useEffect(() => {
    (async () => {
      const m = await idb.all<Member>('members');
      setMembers(m);
      if (m.length > 0) setSelectedMemberId(m[0].id);

      // Load previous conversation history if exists
      const history = await idb.all<any>('chat_history');
      if (history.length > 0) {
        const restored: ChatMessage[] = [];
        history.slice(-10).forEach((h) => {
          if (h.u) restored.push({ role: 'user', content: h.u });
          if (h.b) restored.push({ role: 'assistant', content: h.b });
        });
        if (restored.length > 0) {
          setMessages(restored);
        }
      }
    })();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: textToSend };
    setInputMessage('');
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const currentMember = members.find((m) => m.id === selectedMemberId);

    try {
      const reply = await chatWithAI([...messages, userMsg], currentMember);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);

      // Persist in IndexedDB
      await idb.put('chat_history', {
        id: uid(),
        memberId: selectedMemberId,
        u: textToSend,
        b: reply
      });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, an unexpected connection issue occurred. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if (!window.speechSynthesis) {
      toast('Speech synthesis is not supported on this device', 'warn');
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*•→🔬💊🩺🥗📅👋]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    toast('🔊 Playing audio...');
  };

  const handleClearChat = async () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat cleared! How can I help you today?'
      }
    ]);
    await idb.clear('chat_history');
    toast('Conversation cleared');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 88px)' }}>
      {/* Bot Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20
            }}
          >
            🤖
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, color: C.navy }}>SwasthSathi AI</div>
            <div style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>● Active Companion</div>
          </div>
        </div>

        <Btn small outline color={C.red} onClick={handleClearChat}>
          🗑 Clear
        </Btn>
      </div>

      {/* Member Context Pill Selector */}
      {members.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 6,
            marginBottom: 10,
            overflowX: 'auto',
            flexShrink: 0,
            paddingBottom: 2
          }}
        >
          {members.map((m) => {
            const isSelected = selectedMemberId === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMemberId(m.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 20,
                  border: `2px solid ${isSelected ? m.color : C.border}`,
                  background: isSelected ? `${m.color}18` : '#ffffff',
                  color: isSelected ? m.color : C.text,
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {m.avatar} {m.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      )}

      {/* Messages Stream */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          paddingBottom: 8
        }}
      >
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                gap: 8,
                alignItems: 'flex-end'
              }}
            >
              {!isUser && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    flexShrink: 0
                  }}
                >
                  🤖
                </div>
              )}

              <div style={{ maxWidth: '84%' }}>
                <div
                  style={{
                    background: isUser ? `linear-gradient(135deg, ${C.blue}, ${C.purple})` : '#ffffff',
                    color: isUser ? '#ffffff' : C.text,
                    borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    padding: '10px 14px',
                    fontSize: 13,
                    lineHeight: 1.6,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    border: isUser ? 'none' : `1px solid ${C.border}`,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {m.content}
                </div>

                {!isUser && (
                  <button
                    type="button"
                    onClick={() => handleSpeak(m.content)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 11,
                      color: C.muted,
                      padding: '3px 6px',
                      marginTop: 2
                    }}
                  >
                    🔊 Listen
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14
              }}
            >
              🤖
            </div>
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px 16px 16px 4px',
                padding: '12px 16px',
                border: `1px solid ${C.border}`
              }}
            >
              <Spin />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 4 && (
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, flexShrink: 0 }}>
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              style={{
                padding: '6px 12px',
                borderRadius: 20,
                border: `1px solid ${C.border}`,
                background: '#ffffff',
                color: C.text,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div style={{ display: 'flex', gap: 8, paddingTop: 8, flexShrink: 0 }}>
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
          placeholder="Ask anything about symptoms, labs, or medicines..."
          style={{
            flex: 1,
            padding: '11px 14px',
            borderRadius: 12,
            border: `1.5px solid ${C.border}`,
            fontSize: 13,
            outline: 'none',
            fontFamily: 'inherit',
            background: '#ffffff'
          }}
        />
        <button
          type="button"
          onClick={() => !isLoading && handleSend()}
          disabled={isLoading || !inputMessage.trim()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: 'none',
            background:
              isLoading || !inputMessage.trim()
                ? C.border
                : `linear-gradient(135deg, ${C.blue}, ${C.purple})`,
            color: '#ffffff',
            cursor: isLoading || !inputMessage.trim() ? 'not-allowed' : 'pointer',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isLoading ? <Spin size={4} color="#fff" /> : '↑'}
        </button>
      </div>
    </div>
  );
};
