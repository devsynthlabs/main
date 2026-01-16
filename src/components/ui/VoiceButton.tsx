import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Trash2 } from 'lucide-react';
import { Button } from './button';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useToast } from '@/hooks/use-toast';

interface VoiceButtonProps {
    onTranscript: (text: string) => void;
    onClear?: () => void;
    language?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
    onTranscript,
    onClear,
    language = 'en-US',
    className = '',
    size = 'sm',
}) => {
    const { toast } = useToast();
    const [isPressing, setIsPressing] = useState(false);
    const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

    const {
        transcript,
        isListening,
        isSupported,
        startListening,
        stopListening,
    } = useVoiceInput({
        language,
        continuous: false,
        interimResults: true,
        onResult: (text) => {
            onTranscript(text);
            stopListening();
        },
        onError: (err) => {
            toast({
                variant: 'destructive',
                title: 'Voice Input Error',
                description: err,
            });
        },
    });

    useEffect(() => {
        if (transcript) {
            onTranscript(transcript);
        }
    }, [transcript, onTranscript]);

    const handleLongPress = () => {
        if (onClear) {
            onClear();
            toast({
                title: "Cleared",
                description: "Input field has been cleared.",
                duration: 2000,
            });
        }
    };

    const startPress = () => {
        setIsPressing(true);
        pressTimerRef.current = setTimeout(() => {
            handleLongPress();
            setIsPressing(false);
        }, 700); // 700ms long press
    };

    const cancelPress = () => {
        if (pressTimerRef.current) {
            clearTimeout(pressTimerRef.current);
            pressTimerRef.current = null;
        }
        setIsPressing(false);
    };

    const handleClick = (e: React.MouseEvent) => {
        // Only trigger voice if it wasn't a long press
        if (!onClear || !isPressing) {
            if (isListening) {
                stopListening();
            } else {
                startListening();
            }
        }
    };

    if (!isSupported) {
        return null; // Don't show button if not supported
    }

    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    return (
        <Button
            type="button"
            variant={isListening ? 'default' : 'outline'}
            size="icon"
            onClick={handleClick}
            onMouseDown={onClear ? startPress : undefined}
            onMouseUp={onClear ? cancelPress : undefined}
            onMouseLeave={onClear ? cancelPress : undefined}
            onTouchStart={onClear ? startPress : undefined}
            onTouchEnd={onClear ? cancelPress : undefined}
            className={`${sizeClasses[size]} ${className} ${isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : isPressing
                    ? 'bg-blue-500/40 border-blue-400 animate-pulse'
                    : 'border-blue-400/40 hover:bg-blue-500/20'
                } transition-all duration-300 relative`}
            title={onClear ? (isListening ? 'Stop listening (Hold to clear)' : 'Click to speak (Hold to clear)') : (isListening ? 'Stop listening' : 'Click to speak')}
        >
            {isListening ? (
                <MicOff className="text-white" size={iconSizes[size]} />
            ) : isPressing ? (
                <Trash2 className="text-blue-200" size={iconSizes[size]} />
            ) : (
                <Mic className="text-blue-400" size={iconSizes[size]} />
            )}
        </Button>
    );
};

