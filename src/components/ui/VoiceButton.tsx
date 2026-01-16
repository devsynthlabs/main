import React, { useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './button';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useToast } from '@/hooks/use-toast';

interface VoiceButtonProps {
    onTranscript: (text: string) => void;
    language?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
    onTranscript,
    language = 'en-US',
    className = '',
    size = 'sm',
}) => {
    const { toast } = useToast();

    const {
        transcript,
        isListening,
        isSupported,
        error,
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

    const handleClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
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
            className={`${sizeClasses[size]} ${className} ${isListening
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'border-blue-400/40 hover:bg-blue-500/20'
                } transition-all duration-300`}
            title={isListening ? 'Stop listening' : 'Click to speak'}
        >
            {isListening ? (
                <MicOff className="text-white" size={iconSizes[size]} />
            ) : (
                <Mic className="text-blue-400" size={iconSizes[size]} />
            )}
        </Button>
    );
};
