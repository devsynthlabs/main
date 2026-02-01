import { AlertCircle } from "lucide-react";

const ServerIssues = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-950 via-slate-900 to-slate-900 text-white p-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center">
                    <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20 animate-pulse">
                        <AlertCircle className="w-16 h-16 text-red-400" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-red-400">
                        Server is Down
                    </h1>
                    <p className="text-slate-400 text-lg">
                        We are currently facing internal issues. Our team is working hard to resolve the problem and restore services as soon as possible.
                    </p>
                </div>

                <div className="pt-8 flex flex-col items-center space-y-4">
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-600 to-orange-600 w-1/2 rounded-full animate-pulse" />
                    </div>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">
                        Investigating Internal Issues
                    </p>
                </div>

                <div className="text-slate-500 text-sm">
                    Check our status for updates or <a href="mailto:support@saaiss.in" className="text-red-400 hover:text-red-300 transition-colors">Contact Support</a>
                </div>
            </div>
        </div>
    );
};

export default ServerIssues;
