'use client';

import { useEffect, useRef, useState } from 'react'
import { cn, getSubjectColor } from "@/lib/utils";
import { getCompanionVoice } from "@/lib/voice.sdk";
import Lottie, {LottieRefCurrentProps } from "lottie-react";
import soundwaves from '@/constants/soundwaves.json'
import { addToSessionHistory } from "@/lib/actions/companion.actions";
import CompanionConversation from './CompanionConversation';
import { VoiceSetting } from './VoiceSetting';
import { MicIcon, MicOffIcon } from 'lucide-react';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface CompanionComponentProps {
    companionId: string;
    subject: string;
    topic: string;
    name: string;
    userName: string;
    style: string;
    initialUserMessage?: string;
}

interface Message {
    type: string;
    transcriptType: string;
    role: 'user' | 'assistant';
    transcript: string;
}

const CompanionComponent = ({ 
    companionId, 
    subject, 
    topic, 
    name, 
    userName, 
    style, 
    initialUserMessage,
}: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSpeechSupported, setIsSpeechSupported] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [messages, setMessages] = useState<CompanionMessage[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [voiceSettings, setVoiceSettings] = useState<VoiceConfig>({
        voice: "",
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
    });

    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const companionVoice = getCompanionVoice();

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
            setIsSpeechSupported(supported);
        }
        if(lottieRef) {
            if(isSpeaking) {
                lottieRef.current?.play()
            } else {
                lottieRef.current?.stop()
            }
        }
    }, [isSpeaking, lottieRef])

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            addToSessionHistory(companionId)
        }

        const onMessage = (message: Message) => {
            if(message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage: CompanionMessage = { 
                    role: message.role, 
                    content: message.transcript,
                    timestamp: Date.now()
                }
                setMessages((prev) => [...prev, newMessage])
            }
        }

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error: Error) => {
            console.log('Error', error);
            if (error.message.includes('not-allowed')) {
                alert('Microphone access is required for voice conversation. Please enable microphone permissions and try again.');
                setCallStatus(CallStatus.FINISHED);
            }
        };

        // NEW: Listen for voice settings updates
        const onVoiceSettingsUpdated = (settings: VoiceConfig) => {
            setVoiceSettings(settings);
        };

        companionVoice.on('call-start', onCallStart);
        companionVoice.on('call-end', onCallEnd);
        companionVoice.on('message', onMessage);
        companionVoice.on('error', onError);
        companionVoice.on('speech-start', onSpeechStart);
        companionVoice.on('speech-end', onSpeechEnd);
        companionVoice.on('voice-settings-updated', onVoiceSettingsUpdated);

        setIsInitialized(true);

        return () => {
            companionVoice.off('call-start', onCallStart);
            companionVoice.off('call-end', onCallEnd);
            companionVoice.off('message', onMessage);
            companionVoice.off('error', onError);
            companionVoice.off('speech-start', onSpeechStart);
            companionVoice.off('speech-end', onSpeechEnd);
            companionVoice.off('voice-settings-updated', onVoiceSettingsUpdated);
        }
    }, [companionId, companionVoice]);

    const toggleMicrophone = () => {
        const currentMutedState = companionVoice.isMutedState();
        companionVoice.setMuted(!currentMutedState);
        setIsMuted(!currentMutedState);
    }

    const handleTextSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!textInput.trim() || callStatus !== CallStatus.ACTIVE) return;

        const userMessage = textInput.trim();
        setTextInput('');

        try {
            await companionVoice.sendTextMessage(userMessage);
        } catch (error) {
            console.error('Failed to send text message:', error);
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleTextSubmit(e);
        }
    }

    // NEW: Handle voice settings change
    const handleVoiceSettingsChange = (settings: VoiceConfig) => {
        setVoiceSettings(settings);
    };

    const handleCall = async () => {
        if (!isInitialized) return;
        
        setCallStatus(CallStatus.CONNECTING);
        setMessages([]);

        try {
            await companionVoice.start({
                subject,
                topic,
                style,
                name
            });
            if (initialUserMessage && initialUserMessage.trim()) {
                try {
                    await companionVoice.sendTextMessage(initialUserMessage.trim());
                } catch (e) {
                    console.error('Failed to send initial message:', e);
                }
            }
        } catch (error) {
            console.error('Failed to start voice session:', error);
            setCallStatus(CallStatus.FINISHED);
            alert('Failed to start voice session. Please check your microphone permissions and try again.');
        }
    }

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED);
        setTextInput('');
        companionVoice.stop();
    }

    return (
        <div className="flex flex-col md:flex-row h-full">
            {/* Main Companion Section */}
            <section className="flex flex-col flex-1 p-8 md:p-10 border-r border-white/5">
                {!isSpeechSupported && (
                    <div className="bg-magenta/10 border-l-4 border-magenta text-magenta p-6 mb-8 text-[11px] uppercase tracking-[2px] font-bold">
                        <p className="font-black mb-1">SYSTEM_ERROR // Browser Not Supported</p>
                        <p className="opacity-80">Speech recognition is not supported in your current browser. Please use Chrome, Safari, or Edge.</p>
                    </div>
                )}
                
                {/* Voice Settings - placed at the top */}
                <div className="flex justify-end mb-10">
                    <VoiceSetting
                        onSettingsChange={handleVoiceSettingsChange}
                        initialSettings={voiceSettings}
                    />
                </div>
                
                <div className="flex flex-col items-center justify-center flex-grow py-10">
                    <div className="relative group">
                        <div 
                            className="size-[240px] md:size-[300px] flex items-center justify-center border border-white/10 bg-black/20 backdrop-blur-xl relative z-10 overflow-hidden"
                            style={{ borderLeft: `4px solid ${getSubjectColor(subject) || 'var(--color-magenta)'}` }}
                        >
                            <Lottie
                                lottieRef={lottieRef}
                                animationData={soundwaves}
                                autoplay={false}
                                className="w-full h-full opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            
                            {isSpeaking && (
                                <div className="absolute inset-0 bg-magenta/5 animate-pulse pointer-events-none" />
                            )}
                        </div>
                        
                        {/* Decorative corners */}
                        <div className="absolute -top-2 -left-2 size-6 border-t-2 border-l-2 border-magenta z-20" />
                        <div className="absolute -bottom-2 -right-2 size-6 border-b-2 border-r-2 border-magenta z-20" />
                    </div>

                    {/* Current voice settings display */}
                    {callStatus !== CallStatus.INACTIVE && (
                        <div className="text-[10px] uppercase tracking-[3px] font-black italic opacity-40 mt-10 flex gap-6">
                            <span>VOICE // {voiceSettings.voice ? voiceSettings.voice.split(' ')[0] : 'NEURAL'}</span>
                            <span>SYNC // {voiceSettings.rate.toFixed(1)}X</span>
                        </div>
                    )}

                    <div className="mt-12 w-full max-w-sm flex flex-col gap-6">
                        {/* Microphone Control */}
                        {callStatus === CallStatus.ACTIVE && (
                            <button 
                                className="flex flex-col items-center gap-4 py-8 border border-white/5 bg-white/5 hover:bg-white/10 transition-all group" 
                                onClick={toggleMicrophone}
                            >
                                <div className={cn(
                                    "p-4 rounded-full transition-all duration-500",
                                    isMuted ? "bg-white/10 text-white/40" : "bg-magenta text-white shadow-[0_0_20px_rgba(255,0,110,0.4)]"
                                )}>
                                    {isMuted ? <MicOffIcon size={24} /> : <MicIcon size={24} />}
                                </div>
                                <span className="text-[10px] uppercase tracking-[4px] font-black opacity-40 group-hover:opacity-100 transition-opacity">
                                    {isMuted ? 'Microphone_Off' : 'Microphone_On'}
                                </span>
                            </button>
                        )}

                        {/* Start/End Session Button */}
                        <button 
                            className={cn(
                                'py-5 text-[11px] uppercase tracking-[4px] font-black transition-all relative overflow-hidden', 
                                callStatus === CallStatus.ACTIVE 
                                    ? 'bg-transparent border border-white/20 text-white hover:bg-white hover:text-black' 
                                    : 'bg-magenta text-white hover:scale-[1.02] shadow-xl', 
                                callStatus === CallStatus.CONNECTING && 'animate-pulse',
                                (!isSpeechSupported || !isInitialized) && 'opacity-20 cursor-not-allowed'
                            )} 
                            onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                            disabled={!isSpeechSupported || !isInitialized}
                        >
                            {callStatus === CallStatus.ACTIVE
                                ? "Terminate_Link"
                                : callStatus === CallStatus.CONNECTING
                                    ? 'Synchronizing...'
                                : 'Initialize_Protocol'
                            }
                        </button>
                    </div>
                </div>
            </section>

            {/* Conversation History Sidebar */}
            <CompanionConversation
                messages={messages}
                callStatus={callStatus}
                name={name}
                userName={userName}
                textInput={textInput}
                setTextInput={setTextInput}
                handleTextSubmit={handleTextSubmit}
                handleKeyPress={handleKeyPress}
                messagesEndRef={messagesEndRef}
            />
        </div>
    )
}

export default CompanionComponent;