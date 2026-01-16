import React from 'react';
import { Input } from './input';
import { VoiceButton } from './VoiceButton';

interface VoiceInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    language?: string;
    showVoiceButton?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
    value,
    onChange,
    language = 'en-US',
    showVoiceButton = true,
    className = '',
    ...props
}) => {
    const handleVoiceTranscript = (transcript: string) => {
        // Create a synthetic event to maintain compatibility with existing onChange handlers
        const syntheticEvent = {
            target: { value: transcript },
            currentTarget: { value: transcript },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);
    };

    const handleClear = () => {
        const syntheticEvent = {
            target: { value: "" },
            currentTarget: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
    };

    return (
        <div className="relative flex items-center gap-2">
            <Input
                {...props}
                value={value}
                onChange={onChange}
                className={className}
            />
            {showVoiceButton && (
                <VoiceButton
                    onTranscript={handleVoiceTranscript}
                    onClear={handleClear}
                    language={language}
                    size="sm"
                />
            )}
        </div>
    );
};
