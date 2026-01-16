import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { VoiceInput } from "@/components/ui/VoiceInput";
import { Button } from "@/components/ui/button";
import { Mic, CheckCircle2, XCircle } from "lucide-react";

const VoiceInputDemo = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Form submitted!\nName: ${name}\nEmail: ${email}\nAmount: ${amount}\nDescription: ${description}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <Mic className="h-12 w-12 text-cyan-400" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                            Voice Input Demo
                        </h1>
                    </div>
                    <p className="text-blue-200/80 text-lg">
                        Click the microphone icon next to any field and speak to fill it automatically
                    </p>
                </div>

                {/* Browser Support Info */}
                <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/20">
                    <CardHeader>
                        <CardTitle className="text-blue-100 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                            Browser Support
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-blue-200/80">
                        <p>✅ Chrome / Edge - Full support</p>
                        <p>✅ Safari (iOS 14.5+) - Full support</p>
                        <p>⚠️ Firefox - Limited support</p>
                        <p>❌ Older browsers - Not supported</p>
                    </CardContent>
                </Card>

                {/* Demo Form */}
                <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/20">
                    <CardHeader>
                        <CardTitle className="text-blue-100">Try Voice Input</CardTitle>
                        <CardDescription className="text-blue-200/70">
                            Fill out this form using your voice
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field with VoiceButton */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-blue-100 font-semibold">
                                    Name
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your name or click mic to speak"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12"
                                    />
                                    <VoiceButton
                                        onTranscript={(text) => setName(text)}
                                        language="en-US"
                                        size="md"
                                    />
                                </div>
                            </div>

                            {/* Email Field with VoiceButton */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-blue-100 font-semibold">
                                    Email
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email or click mic to speak"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12"
                                    />
                                    <VoiceButton
                                        onTranscript={(text) => setEmail(text)}
                                        language="en-US"
                                        size="md"
                                    />
                                </div>
                            </div>

                            {/* Amount Field with VoiceButton */}
                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-blue-100 font-semibold">
                                    Amount
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="amount"
                                        type="text"
                                        placeholder="Enter amount or speak (e.g., 'five thousand')"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12"
                                    />
                                    <VoiceButton
                                        onTranscript={(text) => setAmount(text)}
                                        language="en-US"
                                        size="md"
                                    />
                                </div>
                            </div>

                            {/* Description using VoiceInput wrapper */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-blue-100 font-semibold">
                                    Description (Using VoiceInput Component)
                                </Label>
                                <VoiceInput
                                    id="description"
                                    placeholder="Enter description or click mic to speak"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    language="en-US"
                                    className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-6 rounded-xl"
                            >
                                Submit Form
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Usage Instructions */}
                <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/20">
                    <CardHeader>
                        <CardTitle className="text-blue-100">How to Use</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-blue-200/80">
                        <p>1. Click the microphone icon next to any input field</p>
                        <p>2. Allow microphone access when prompted (first time only)</p>
                        <p>3. Speak clearly into your microphone</p>
                        <p>4. The text will appear in the field automatically</p>
                        <p>5. Click the mic again or pause to stop recording</p>
                    </CardContent>
                </Card>

                {/* Language Support */}
                <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/20">
                    <CardHeader>
                        <CardTitle className="text-blue-100">Supported Languages</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2 text-blue-200/80">
                        <p>🇺🇸 English (US)</p>
                        <p>🇬🇧 English (UK)</p>
                        <p>🇮🇳 Hindi</p>
                        <p>🇮🇳 Tamil</p>
                        <p>🇮🇳 Telugu</p>
                        <p>🇮🇳 Kannada</p>
                        <p>🇪🇸 Spanish</p>
                        <p>🇫🇷 French</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default VoiceInputDemo;
