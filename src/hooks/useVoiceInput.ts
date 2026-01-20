import { useState, useEffect, useCallback, useRef } from 'react';

interface UseVoiceInputOptions {
    language?: string;
    continuous?: boolean;
    interimResults?: boolean;
    onResult?: (transcript: string) => void;
    onError?: (error: string) => void;
}

interface UseVoiceInputReturn {
    transcript: string;
    isListening: boolean;
    isSupported: boolean;
    error: string | null;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
}

export const useVoiceInput = ({
    language = 'en-US',
    continuous = false,
    interimResults = true,
    onResult,
    onError,
}: UseVoiceInputOptions = {}): UseVoiceInputReturn => {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(false);

    const recognitionRef = useRef<any>(null);
    const onResultRef = useRef(onResult);
    const onErrorRef = useRef(onError);

    // Update refs when callbacks change
    useEffect(() => {
        onResultRef.current = onResult;
        onErrorRef.current = onError;
    }, [onResult, onError]);

    // Check browser support
    useEffect(() => {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        setIsSupported(!!SpeechRecognition);

        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = continuous;
            recognitionRef.current.interimResults = interimResults;
            recognitionRef.current.lang = language;

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcriptPiece = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcriptPiece + ' ';
                    } else {
                        interimTranscript += transcriptPiece;
                    }
                }

                const fullTranscript = finalTranscript || interimTranscript;
                setTranscript(fullTranscript.trim());

                if (finalTranscript && onResultRef.current) {
                    onResultRef.current(finalTranscript.trim());
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                const errorMessage = `Speech recognition error: ${event.error}`;
                setError(errorMessage);
                setIsListening(false);

                if (onErrorRef.current) {
                    onErrorRef.current(errorMessage);
                }
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [language, continuous, interimResults]);

    const startListening = useCallback(() => {
        if (!isSupported) {
            const msg = 'Speech recognition is not supported in this browser';
            setError(msg);
            if (onError) onError(msg);
            return;
        }

        setError(null);
        setTranscript('');

        try {
            recognitionRef.current?.start();
            setIsListening(true);
        } catch (err: any) {
            const msg = err.message || 'Failed to start speech recognition';
            setError(msg);
            if (onError) onError(msg);
        }
    }, [isSupported, onError]);

    const stopListening = useCallback(() => {
        try {
            recognitionRef.current?.stop();
            setIsListening(false);
        } catch (err) {
            console.error('Error stopping speech recognition:', err);
        }
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setError(null);
    }, []);

    return {
        transcript,
        isListening,
        isSupported,
        error,
        startListening,
        stopListening,
        resetTranscript,
    };
};
