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

    const {
        transcript,
        isListening,
        isSupported,
        startListening,
        stopListening,
    } = useVoiceInput({
        language,
        continuous: true,
        interimResults: true,
        onResult: (text) => {
            onTranscript(text);
        },
        onError: (err) => {
            // Ignore benign "aborted" error which happens when stopping quickly
            if (err.includes('aborted')) return;

            toast({
                variant: 'destructive',
                title: 'Voice Input Error',
                description: err,
            });
        },
    });



    const handleStartListening = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if (onClear) {
            onClear();
        }
        startListening();
    };

    const handleStopListening = () => {
        if (isListening) {
            stopListening();
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
            onMouseDown={handleStartListening}
            onMouseUp={handleStopListening}
            onMouseLeave={handleStopListening}
            onTouchStart={handleStartListening}
            onTouchEnd={handleStopListening}
            className={`${sizeClasses[size]} ${className} ${isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110'
                : 'border-blue-400/40 hover:bg-blue-500/20'
                } transition-all duration-300 relative`}
            title={isListening ? 'Listening... release to stop' : 'Hold to speak'}
        >
            {isListening ? (
                <MicOff className="text-white" size={iconSizes[size]} />
            ) : (
                <Mic className="text-blue-400" size={iconSizes[size]} />
            )}
        </Button>
    );
};

