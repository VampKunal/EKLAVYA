'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface CompanionConversationProps {
  messages: CompanionMessage[];
  callStatus: 'INACTIVE' | 'CONNECTING' | 'ACTIVE' | 'FINISHED';
  name: string;
  userName: string;
  textInput: string;
  setTextInput: (val: string) => void;
  handleTextSubmit: (e: React.FormEvent) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const CompanionConversation = ({
  messages,
  callStatus,
  name,
  userName,
  textInput,
  setTextInput,
  handleTextSubmit,
  handleKeyPress,
  messagesEndRef
}: CompanionConversationProps) => {

  const formatTimestamp = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  return (
    <section className="w-full md:w-[400px] flex flex-col p-8 md:p-10 bg-black/20 backdrop-blur-sm">
      <div className="mb-10 flex justify-between items-baseline">
        <h3 className="text-xs uppercase tracking-[4px] font-black text-white/40">Log_History</h3>
        <p className="text-[10px] uppercase tracking-[2px] font-black italic text-magenta">
          {messages.length} // MESSAGES
        </p>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[60vh] space-y-8 pr-4 custom-scrollbar mb-10">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-20 text-center space-y-4">
            <div className="size-12 border border-white/20 rounded-full flex items-center justify-center">
              <span className="text-xs">!</span>
            </div>
            <p className="text-[10px] uppercase tracking-[3px] font-black">Waiting_For_Neural_Sync</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex flex-col gap-3',
                  message.role === 'assistant' ? 'items-start' : 'items-end'
                )}
              >
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "text-[9px] uppercase tracking-[3px] font-black",
                    message.role === 'assistant' ? "text-magenta" : "text-white/40"
                  )}>
                    {message.role === 'assistant' ? "NODE // " + name.split(' ')[0].toUpperCase() : "USER // " + userName.toUpperCase()}
                  </span>
                  {message.timestamp &&
                    <span className="text-[8px] uppercase tracking-[2px] opacity-20 italic">{formatTimestamp(message.timestamp)}</span>
                  }
                </div>
                <div className={cn(
                  'p-5 text-[11px] uppercase tracking-[1px] leading-relaxed font-medium border relative',
                  message.role === 'assistant' 
                    ? 'bg-white/5 border-white/10 text-white/80 rounded-tr-xl rounded-br-xl rounded-bl-xl' 
                    : 'bg-magenta/10 border-magenta/20 text-magenta rounded-tl-xl rounded-br-xl rounded-bl-xl'
                )}>
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {callStatus === 'ACTIVE' && (
        <form onSubmit={handleTextSubmit} className="relative mt-auto">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="INPUT_NEURAL_COMMAND..."
                className="w-full bg-black/40 border border-white/10 px-6 py-4 text-[10px] uppercase tracking-[3px] font-black focus:outline-none focus:border-magenta/50 transition-colors"
                disabled={callStatus !== 'ACTIVE'}
              />
              <div className="absolute top-0 right-0 h-full flex items-center px-4">
                <div className="size-2 bg-magenta animate-pulse" />
              </div>
            </div>
            <button
              type="submit"
              disabled={!textInput.trim() || callStatus !== 'ACTIVE'}
              className="bg-white text-black py-4 text-[10px] uppercase tracking-[4px] font-black hover:bg-magenta hover:text-white transition-all disabled:opacity-20"
            >
              Execute_Command
            </button>
          </div>
        </form>
      )}

      {/* Session Status Indicator */}
      <div className="mt-10 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'size-1.5 rounded-full',
                callStatus === 'ACTIVE'
                  ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                  : callStatus === 'CONNECTING'
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-white/10'
              )}
            />
            <span className="text-[9px] uppercase tracking-[3px] font-black opacity-30 italic">
              {callStatus === 'ACTIVE'
                ? 'Status // Link_Stable'
                : callStatus === 'CONNECTING'
                ? 'Status // Syncing...'
                : callStatus === 'FINISHED'
                ? 'Status // Link_Terminated'
                : 'Status // Ready_For_Link'}
            </span>
          </div>
          <div className="text-[8px] uppercase tracking-[2px] opacity-20 font-black">
            EKV_V.04 // CORE
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanionConversation;
