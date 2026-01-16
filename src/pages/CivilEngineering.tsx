import { useState, useEffect } from "react";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Calculator, Sparkles, Search, FileText, Database, Calendar, Clock, Building2, Users, Target, Network, GanttChart, BarChart3, Home, Cpu, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Task {
    id: string;
    name: string;
    duration: number;
    dependencies: string[];
    es?: number;
    ef?: number;
    ls?: number;
    lf?: number;
    slack?: number;
    critical?: boolean;
}

interface Project {
    id: string;
    projectName: string;
    projectId: string;
    projectDescription: string;
    startDate: string;
    endDate: string;
    tasks: Task[];
    criticalPath: string[];
    totalDuration: number;
    status: 'Planning' | 'In Progress' | 'Completed' | 'Delayed';
    createdAt: string;
}

interface FormData {
    projectName: string;
    projectId: string;
    projectDescription: string;
    startDate: string;
    endDate: string;
    status: 'Planning' | 'In Progress' | 'Completed' | 'Delayed';
    tasks: Task[];
}

const CivilEngineering = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("calculator");
    const [dependencyWarnings, setDependencyWarnings] = useState<string[]>([]);

    // Project Form State
    const [formData, setFormData] = useState<FormData>({
        projectName: "Construction Project",
        projectId: "PROJ-2024-001",
        projectDescription: "Residential building construction with CPM scheduling",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "Planning",
        tasks: [
            { id: "1", name: "A-Site preparation", duration: 5, dependencies: [] },
            { id: "2", name: "B-Foundation", duration: 10, dependencies: ["A-Site Preparation"] },
            { id: "3", name: "C-Structure", duration: 20, dependencies: ["B-Foundation"] },
            { id: "4", name: "D-MEP", duration: 15, dependencies: ["C-Structure"] },
            { id: "5", name: "E-Finishing", duration: 12, dependencies: ["D-MEP"] },
            { id: "6", name: "F-Handover", duration: 5, dependencies: ["E-Finishing"] }
        ]
    });

    // Results State
    const [calculatedResults, setCalculatedResults] = useState<{
        tasks: Task[];
        criticalPath: string[];
        totalDuration: number;
    } | null>(null);
    const [showResult, setShowResult] = useState(false);

    // History State
    const [searchTerm, setSearchTerm] = useState("");
    const [projectHistory, setProjectHistory] = useState<Project[]>([]);
    const [filteredHistory, setFilteredHistory] = useState<Project[]>([]);

    // Initialize with sample data
    useEffect(() => {
        const sampleData: Project[] = [
            {
                id: "1",
                projectName: "Residential Tower",
                projectId: "PROJ-2024-001",
                projectDescription: "Construction of 20-story residential building",
                startDate: "2024-01-15",
                endDate: "2024-12-15",
                tasks: [
                    { id: "1", name: "A-Site preparation", duration: 5, dependencies: [], es: 0, ef: 5, ls: 25, lf: 30, slack: 25, critical: false },
                    { id: "2", name: "B-Foundation", duration: 10, dependencies: ["A-Site Preparation"], es: 0, ef: 10, ls: 0, lf: 10, slack: 0, critical: true },
                    { id: "3", name: "C-Structure", duration: 20, dependencies: ["B-Foundation"], es: 10, ef: 30, ls: 10, lf: 30, slack: 0, critical: true },
                    { id: "4", name: "D-MEP", duration: 15, dependencies: ["C-Structure"], es: 0, ef: 15, ls: 15, lf: 30, slack: 15, critical: false },
                    { id: "5", name: "E-Finishing", duration: 12, dependencies: ["D-MEP"], es: 0, ef: 12, ls: 13, lf: 25, slack: 13, critical: false },
                    { id: "6", name: "F-Handover", duration: 5, dependencies: ["E-Finishing"], es: 12, ef: 17, ls: 25, lf: 30, slack: 13, critical: false }
                ],
                criticalPath: ["B-Foundation", "C-Structure"],
                totalDuration: 30,
                status: "In Progress",
                createdAt: "2024-01-10"
            },
            {
                id: "2",
                projectName: "Commercial Complex",
                projectId: "PROJ-2024-002",
                projectDescription: "Shopping mall with parking facility",
                startDate: "2024-02-01",
                endDate: "2024-08-01",
                tasks: [
                    { id: "1", name: "Design Approval", duration: 10, dependencies: [], es: 0, ef: 10, ls: 5, lf: 15, slack: 5, critical: false },
                    { id: "2", name: "Excavation", duration: 7, dependencies: ["Design Approval"], es: 10, ef: 17, ls: 15, lf: 22, slack: 5, critical: false },
                    { id: "3", name: "Foundation", duration: 12, dependencies: ["Excavation"], es: 17, ef: 29, ls: 22, lf: 34, slack: 5, critical: false },
                    { id: "4", name: "Main Structure", duration: 25, dependencies: ["Foundation"], es: 29, ef: 54, ls: 34, lf: 59, slack: 5, critical: false },
                    { id: "5", name: "Utilities", duration: 10, dependencies: ["Foundation"], es: 29, ef: 39, ls: 49, lf: 59, slack: 20, critical: false },
                    { id: "6", name: "Finishing", duration: 15, dependencies: ["Main Structure", "Utilities"], es: 54, ef: 69, ls: 59, lf: 74, slack: 5, critical: false }
                ],
                criticalPath: ["Design Approval", "Excavation", "Foundation", "Main Structure", "Finishing"],
                totalDuration: 74,
                status: "Planning",
                createdAt: "2024-01-25"
            }
        ];

        setProjectHistory(sampleData);
        setFilteredHistory(sampleData);

        // Pre-calculate the sample project
        const tasksWithCPM = calculateCPM(formData.tasks);
        setCalculatedResults(tasksWithCPM);
        setShowResult(true);
    }, []);

    // Handle form input changes
    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Handle task changes
    const handleTaskChange = (taskId: string, field: keyof Task, value: string | number | string[]) => {
        setFormData(prev => ({
            ...prev,
            tasks: prev.tasks.map(task =>
                task.id === taskId
                    ? { ...task, [field]: Array.isArray(value) ? value : value }
                    : task
            )
        }));
    };

    // Add new task
    const addNewTask = () => {
        const newTaskId = (formData.tasks.length + 1).toString();
        setFormData(prev => ({
            ...prev,
            tasks: [
                ...prev.tasks,
                { id: newTaskId, name: `Task-${newTaskId}`, duration: 1, dependencies: [] }
            ]
        }));
    };

    // Remove task
    const removeTask = (taskId: string) => {
        if (formData.tasks.length <= 1) return;

        setFormData(prev => ({
            ...prev,
            tasks: prev.tasks.filter(task => task.id !== taskId)
        }));
    };

    // Clean task name for consistency
    const cleanTaskName = (name: string): string => {
        return name.trim().replace(/\s+/g, ' ').replace(/=/g, '-');
    };

    // Calculate CPM with enhanced dependency checking
    const calculateCPM = (tasks: Task[]) => {
        const warnings: string[] = [];
        const cleanedTasks = tasks.map(task => ({
            ...task,
            name: cleanTaskName(task.name),
            dependencies: task.dependencies.map(dep => cleanTaskName(dep))
        }));

        // Check for missing dependencies
        cleanedTasks.forEach(task => {
            task.dependencies.forEach(dep => {
                const depExists = cleanedTasks.some(t => cleanTaskName(t.name) === dep);
                if (!depExists && dep) {
                    warnings.push(`Warning: Dependency '${dep}' for task '${task.name}' not found in task list.`);
                }
            });
        });

        setDependencyWarnings(warnings);

        // Build graph
        const graph: Record<string, { duration: number, successors: string[], predecessors: string[] }> = {};
        const nameToId: Record<string, string> = {};

        // Initialize graph
        cleanedTasks.forEach(task => {
            graph[task.name] = {
                duration: task.duration,
                successors: [],
                predecessors: []
            };
            nameToId[task.name] = task.id;
        });

        // Build dependencies
        cleanedTasks.forEach(task => {
            task.dependencies.forEach(dep => {
                if (graph[dep] && dep !== task.name) {
                    graph[dep].successors.push(task.name);
                    graph[task.name].predecessors.push(dep);
                }
            });
        });

        // Forward Pass
        const ES: Record<string, number> = {};
        const EF: Record<string, number> = {};
        const visited = new Set<string>();

        function forwardPass(node: string): number {
            if (visited.has(node)) return EF[node];
            visited.add(node);

            if (graph[node].predecessors.length === 0) {
                ES[node] = 0;
            } else {
                ES[node] = Math.max(...graph[node].predecessors.map(p => forwardPass(p)));
            }

            EF[node] = ES[node] + graph[node].duration;
            return EF[node];
        }

        Object.keys(graph).forEach(node => forwardPass(node));

        // Backward Pass
        const LS: Record<string, number> = {};
        const LF: Record<string, number> = {};
        const reverseVisited = new Set<string>();
        const totalDuration = Math.max(...Object.values(EF));

        function backwardPass(node: string): number {
            if (reverseVisited.has(node)) return LS[node];
            reverseVisited.add(node);

            if (graph[node].successors.length === 0) {
                LF[node] = totalDuration;
            } else {
                LF[node] = Math.min(...graph[node].successors.map(s => backwardPass(s)));
            }

            LS[node] = LF[node] - graph[node].duration;
            return LS[node];
        }

        Object.keys(graph).forEach(node => backwardPass(node));

        // Calculate slack and critical path
        const slack: Record<string, number> = {};
        const criticalPath: string[] = [];

        const updatedTasks = cleanedTasks.map(task => {
            const taskSlack = LS[task.name] - ES[task.name];
            const isCritical = taskSlack === 0;

            if (isCritical) criticalPath.push(task.name);

            return {
                ...task,
                es: ES[task.name],
                ef: EF[task.name],
                ls: LS[task.name],
                lf: LF[task.name],
                slack: taskSlack,
                critical: isCritical
            };
        });

        return {
            tasks: updatedTasks,
            criticalPath,
            totalDuration
        };
    };

    const handleCalculateCPM = () => {
        const results = calculateCPM(formData.tasks);
        setCalculatedResults(results);
        setShowResult(true);

        // Add to history
        const newProject: Project = {
            id: Date.now().toString(),
            projectName: formData.projectName,
            projectId: formData.projectId,
            projectDescription: formData.projectDescription,
            startDate: formData.startDate,
            endDate: formData.endDate,
            tasks: results.tasks,
            criticalPath: results.criticalPath,
            totalDuration: results.totalDuration,
            status: formData.status,
            createdAt: new Date().toLocaleDateString()
        };

        setProjectHistory(prev => [newProject, ...prev]);
        setFilteredHistory(prev => [newProject, ...prev]);
    };

    // Search function
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setFilteredHistory(projectHistory);
            return;
        }

        const filtered = projectHistory.filter(
            (project) =>
                project.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.projectId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.projectDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.status?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredHistory(filtered);
    };

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredHistory(projectHistory);
        }
    }, [searchTerm, projectHistory]);

    // Download Gantt Chart
    const downloadGanttChart = (project: Project) => {
        const ganttContent = `
╔════════════════════════════════════════════╗
║        PROJECT SCHEDULE - ${project.createdAt}      ║
╚════════════════════════════════════════════╝

Project Details:
  Name: ${project.projectName || "N/A"}
  ID: ${project.projectId || "N/A"}
  Description: ${project.projectDescription || "N/A"}
  Start Date: ${project.startDate || "N/A"}
  End Date: ${project.endDate || "N/A"}
  Status: ${project.status || "N/A"}
  Total Duration: ${project.totalDuration || "0"} days

-------------------------------------------

CRITICAL PATH:
  ${project.criticalPath.join(" → ")}
  
-------------------------------------------

TASK SCHEDULE:

${project.tasks.map(task => `
╔════════════════════════════════════════════╗
  Task: ${task.name}
  Duration: ${task.duration} days
  Dependencies: ${task.dependencies.join(", ") || "None"}
  
  Early Start (ES): Day ${task.es || 0}
  Early Finish (EF): Day ${task.ef || 0}
  Late Start (LS): Day ${task.ls || 0}
  Late Finish (LF): Day ${task.lf || 0}
  Slack: ${task.slack || 0} days
  ${task.critical ? "★ CRITICAL TASK" : ""}
╚════════════════════════════════════════════╝
`).join('')}

-------------------------------------------

Generated by Civil Engineering Automation Platform
Powered by Advanced CPM Engine ⚙️
    `.trim();

        const blob = new Blob([ganttContent], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `project_schedule_${project.projectName.replace(/\s+/g, "_")}_${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const handleBackToDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
            </div>

            {/* Header */}
            <header className="relative backdrop-blur-xl bg-white/5 border-b border-blue-400/20 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Button
                        variant="ghost"
                        onClick={handleBackToDashboard}
                        className="mb-4 text-blue-200 hover:text-blue-100 hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-x-1"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <div className="flex items-center gap-4">
                        <div
                            className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl backdrop-blur-xl border border-blue-400/30 transition-transform duration-300"
                        >
                            <Building2 className="h-8 w-8 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                                Civil Engineering Scheduler
                            </h1>
                            <p className="text-blue-200/80 font-medium mt-1">Critical Path Method (CPM) Project Scheduling</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="grid w-full grid-cols-2 backdrop-blur-2xl bg-white/10 border border-blue-400/20 rounded-2xl p-1">
                        <TabsTrigger
                            value="calculator"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                        >
                            <Network className="h-4 w-4" />
                            CPM Calculator
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                        >
                            <FileText className="h-4 w-4" />
                            Project History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="calculator">
                        <Card
                            className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 shadow-2xl shadow-blue-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-blue-500/40"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-b from-blue-500/20 to-transparent blur-2xl" />

                            <CardHeader className="relative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-3xl font-black text-blue-100 flex items-center gap-3">
                                            <Network className="h-7 w-7 text-cyan-400 transition-transform duration-300" />
                                            CPM Project Scheduler
                                        </CardTitle>
                                        <CardDescription className="text-blue-200/70 mt-2 text-base">
                                            Enter project details and tasks to calculate Critical Path
                                        </CardDescription>
                                    </div>
                                    <div className="hidden sm:block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl backdrop-blur-md border border-blue-400/30">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            <span className="text-sm text-blue-200 font-semibold">Live CPM Engine</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-8 p-8">
                                {/* Dependency Warnings */}
                                {dependencyWarnings.length > 0 && (
                                    <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription className="text-red-200">
                                            {dependencyWarnings.map((warning, index) => (
                                                <div key={index} className="text-sm">{warning}</div>
                                            ))}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Project Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3 group">
                                        <Label htmlFor="projectName" className="text-blue-100 font-bold text-lg flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-cyan-400" />
                                            Project Name
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="projectName"
                                                placeholder="Enter project name"
                                                value={formData.projectName}
                                                onChange={(e) => handleInputChange("projectName", e.target.value)}
                                                className="bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl h-12 placeholder:text-blue-300/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300"
                                            />
                                            <VoiceButton onTranscript={(text) => handleInputChange("projectName", text)} />
                                        </div>
                                    </div>

                                    <div className="space-y-3 group">
                                        <Label htmlFor="projectId" className="text-blue-100 font-bold text-lg flex items-center gap-2">
                                            <Target className="h-4 w-4 text-cyan-400" />
                                            Project ID
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="projectId"
                                                placeholder="e.g., PROJ-2024-001"
                                                value={formData.projectId}
                                                onChange={(e) => handleInputChange("projectId", e.target.value)}
                                                className="bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl h-12 placeholder:text-blue-300/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300"
                                            />
                                            <VoiceButton onTranscript={(text) => handleInputChange("projectId", text)} />
                                        </div>
                                    </div>

                                    <div className="space-y-3 group">
                                        <Label htmlFor="startDate" className="text-blue-100 font-bold text-lg flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-cyan-400" />
                                            Start Date
                                        </Label>
                                        <Input
                                            id="startDate"
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => handleInputChange("startDate", e.target.value)}
                                            className="bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl h-12"
                                        />
                                    </div>

                                    <div className="space-y-3 group">
                                        <Label htmlFor="endDate" className="text-blue-100 font-bold text-lg flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-cyan-400" />
                                            End Date
                                        </Label>
                                        <Input
                                            id="endDate"
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => handleInputChange("endDate", e.target.value)}
                                            className="bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl h-12"
                                        />
                                    </div>

                                    <div className="space-y-3 group">
                                        <Label htmlFor="status" className="text-blue-100 font-bold text-lg flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-cyan-400" />
                                            Project Status
                                        </Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(value) => handleInputChange("status", value)}
                                        >
                                            <SelectTrigger className="bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl h-12">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border border-blue-400/30 text-white">
                                                <SelectItem value="Planning">Planning</SelectItem>
                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                                <SelectItem value="Delayed">Delayed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3 group md:col-span-2">
                                        <Label htmlFor="projectDescription" className="text-blue-100 font-bold text-lg flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-cyan-400" />
                                            Project Description
                                        </Label>
                                        <div className="flex items-start gap-2">
                                            <textarea
                                                id="projectDescription"
                                                placeholder="Describe the project..."
                                                value={formData.projectDescription}
                                                onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                                                className="w-full min-h-[80px] bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl p-3 placeholder:text-blue-300/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 resize-y"
                                            />
                                            <VoiceButton onTranscript={(text) => handleInputChange("projectDescription", text)} />
                                        </div>
                                    </div>
                                </div>

                                {/* Tasks Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-blue-100 font-bold text-2xl flex items-center gap-2">
                                            <GanttChart className="h-6 w-6 text-cyan-400" />
                                            Project Tasks
                                        </Label>
                                        <Button
                                            onClick={addNewTask}
                                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white"
                                        >
                                            + Add Task
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {formData.tasks.map((task, index) => (
                                            <Card key={task.id} className="bg-white/5 backdrop-blur-xl border border-blue-400/20 rounded-2xl">
                                                <CardContent className="p-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                        <div className="space-y-2">
                                                            <Label className="text-white text-sm">Task Name</Label>
                                                            <div className="flex items-center gap-1">
                                                                <Input
                                                                    value={task.name}
                                                                    onChange={(e) => handleTaskChange(task.id, "name", e.target.value)}
                                                                    placeholder="e.g., A-Site preparation"
                                                                    className="bg-white/10 border-blue-400/30 text-white"
                                                                />
                                                                <VoiceButton onTranscript={(text) => handleTaskChange(task.id, "name", text)} />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label className="text-white text-sm">Duration (days)</Label>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                value={task.duration}
                                                                onChange={(e) => handleTaskChange(task.id, "duration", parseInt(e.target.value) || 1)}
                                                                className="bg-white/10 border-blue-400/30 text-white"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label className="text-white text-sm">Dependencies</Label>
                                                            <Select
                                                                value=""
                                                                onValueChange={(value) => {
                                                                    if (value && !task.dependencies.includes(value)) {
                                                                        handleTaskChange(task.id, "dependencies", [...task.dependencies, value]);
                                                                    }
                                                                }}
                                                            >
                                                                <SelectTrigger className="bg-white/10 border-blue-400/30 text-white">
                                                                    <SelectValue placeholder="Select dependency" />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-slate-900 border border-blue-400/30 text-white">
                                                                    {formData.tasks
                                                                        .filter(t => t.id !== task.id && t.name)
                                                                        .map(t => (
                                                                            <SelectItem key={t.id} value={t.name}>
                                                                                {t.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                </SelectContent>
                                                            </Select>
                                                            {task.dependencies.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-2">
                                                                    {task.dependencies.map(dep => (
                                                                        <Badge
                                                                            key={dep}
                                                                            variant="outline"
                                                                            className="bg-blue-500/20 text-white border-blue-400/30"
                                                                        >
                                                                            {dep}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleTaskChange(task.id, "dependencies", task.dependencies.filter(d => d !== dep))}
                                                                                className="ml-2 text-blue-400 hover:text-blue-300"
                                                                            >
                                                                                ×
                                                                            </button>
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex items-end gap-2">
                                                            {formData.tasks.length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => removeTask(task.id)}
                                                                    className="flex-1"
                                                                >
                                                                    Remove
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                {/* Calculate Button */}
                                <div className="flex gap-4 pt-4">
                                    <Button
                                        onClick={handleCalculateCPM}
                                        className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-lg rounded-xl shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-[1.02] border border-blue-400/30"
                                    >
                                        <Calculator className="mr-2 h-5 w-5" />
                                        Calculate Critical Path
                                    </Button>
                                </div>

                                {/* Display CPM Results */}
                                {showResult && calculatedResults && (
                                    <Card
                                        className="backdrop-blur-2xl bg-gradient-to-br from-slate-800/90 via-blue-900/80 to-indigo-900/90 border-2 border-cyan-400/60 shadow-2xl shadow-cyan-500/60 rounded-3xl overflow-hidden animate-in fade-in duration-700 relative"
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

                                        <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400/30 to-amber-400/30 rounded-full backdrop-blur-md border border-yellow-400/50 flex items-center gap-1 shadow-lg shadow-yellow-400/30">
                                            <Sparkles className="h-3 w-3 text-yellow-300" />
                                            <span className="text-xs text-yellow-100 font-bold">CPM Calculated</span>
                                        </div>

                                        <CardContent className="pt-12 pb-12 px-8 text-center relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 blur-2xl" />

                                            <div className="relative z-10">
                                                <p className="text-xl text-cyan-300 mb-4 font-semibold tracking-wide uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                                                    Critical Path Analysis
                                                </p>

                                                {/* Project Summary */}
                                                <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-blue-400/20">
                                                    <p className="text-lg text-blue-200 mb-2">Project Duration</p>
                                                    <p className="text-3xl font-bold text-green-400">{calculatedResults.totalDuration} days</p>
                                                </div>

                                                {/* Critical Path */}
                                                <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-red-400/20">
                                                    <p className="text-lg text-red-300 mb-2">Critical Path</p>
                                                    <p className="text-xl font-bold text-cyan-300">
                                                        {calculatedResults.criticalPath.join(" → ")}
                                                    </p>
                                                </div>

                                                {/* CPM Table */}
                                                <div className="mb-8 overflow-x-auto">
                                                    <div className="mb-4 flex justify-between items-center">
                                                        <div className="text-blue-300 text-sm">
                                                            Showing {calculatedResults.tasks.length} of {calculatedResults.tasks.length} entries
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-blue-300 text-sm">Search:</span>
                                                            <Input
                                                                placeholder="Search tasks..."
                                                                className="bg-white/5 border-blue-400/30 w-40 text-white"
                                                            />
                                                        </div>
                                                    </div>

                                                    <Table className="backdrop-blur-xl bg-white/5 border border-blue-400/20 rounded-2xl">
                                                        <TableHeader>
                                                            <TableRow className="border-b border-blue-400/30">
                                                                <TableHead className="text-white font-bold">Task</TableHead>
                                                                <TableHead className="text-white font-bold">Duration</TableHead>
                                                                <TableHead className="text-white font-bold">ES</TableHead>
                                                                <TableHead className="text-white font-bold">EF</TableHead>
                                                                <TableHead className="text-white font-bold">LS</TableHead>
                                                                <TableHead className="text-white font-bold">LF</TableHead>
                                                                <TableHead className="text-white font-bold">Slack</TableHead>
                                                                <TableHead className="text-white font-bold">Critical</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {calculatedResults.tasks.map((task) => (
                                                                <TableRow
                                                                    key={task.id}
                                                                    className={`${task.critical ? "bg-red-500/10" : ""} hover:bg-white/5`}
                                                                >
                                                                    <TableCell className="font-bold text-white">
                                                                        {task.name}
                                                                        {task.critical && (
                                                                            <Badge className="ml-2 bg-red-500/20 text-red-300 border-red-400/30 text-xs">
                                                                                Critical
                                                                            </Badge>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="text-white">{task.duration} days</TableCell>
                                                                    <TableCell className="text-white font-medium">Day {task.es}</TableCell>
                                                                    <TableCell className="text-white font-medium">Day {task.ef}</TableCell>
                                                                    <TableCell className="text-purple-300 font-medium">Day {task.ls}</TableCell>
                                                                    <TableCell className="text-purple-300 font-medium">Day {task.lf}</TableCell>
                                                                    <TableCell className={task.slack === 0 ? "text-red-400 font-bold" : "text-green-400 font-medium"}>
                                                                        {task.slack} days
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {task.critical ? (
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-red-400 font-bold">*</span>
                                                                                <span className="text-red-300">Critical</span>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-green-400">-</span>
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>

                                                    <div className="mt-4 text-sm text-blue-300/70">
                                                        <div className="flex justify-between items-center">
                                                            <span>Showing 1 to {calculatedResults.tasks.length} of {calculatedResults.tasks.length} entries</span>
                                                            <div className="flex items-center gap-2">
                                                                <Button variant="outline" size="sm" className="border-blue-400/30 text-white">Previous</Button>
                                                                <Button variant="outline" size="sm" className="border-blue-400/30 bg-blue-500/20 text-white">1</Button>
                                                                <Button variant="outline" size="sm" className="border-blue-400/30 text-white">Next</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Gantt Chart Preview */}
                                                <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-blue-400/20">
                                                    <h3 className="text-lg font-bold text-blue-200 mb-4 flex items-center gap-2">
                                                        <BarChart3 className="h-5 w-5 text-cyan-400" />
                                                        Gantt Chart Preview
                                                    </h3>
                                                    <div className="space-y-4">
                                                        {calculatedResults.tasks.map((task) => (
                                                            <div key={task.id} className="space-y-2">
                                                                <div className="flex justify-between text-sm">
                                                                    <span className={`font-medium ${task.critical ? 'text-red-300' : 'text-blue-300'}`}>
                                                                        {task.name}
                                                                    </span>
                                                                    <span className="text-blue-400/70">
                                                                        {task.duration} days (ES: {task.es}, EF: {task.ef})
                                                                    </span>
                                                                </div>
                                                                <div className="relative h-4 bg-blue-900/30 rounded-full overflow-hidden">
                                                                    <div
                                                                        className={`absolute h-full rounded-full ${task.critical ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}
                                                                        style={{
                                                                            left: `${(task.es || 0) / calculatedResults.totalDuration * 100}%`,
                                                                            width: `${task.duration / calculatedResults.totalDuration * 100}%`
                                                                        }}
                                                                    ></div>
                                                                    {!task.critical && (
                                                                        <div
                                                                            className="absolute h-full bg-gradient-to-r from-purple-500/30 to-violet-500/30 rounded-full border border-dashed border-purple-400/50"
                                                                            style={{
                                                                                left: `${(task.ls || 0) / calculatedResults.totalDuration * 100}%`,
                                                                                width: `${task.duration / calculatedResults.totalDuration * 100}%`
                                                                            }}
                                                                        ></div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="flex justify-between text-xs text-blue-400/60 mt-2">
                                                            <span>Day 0</span>
                                                            <span>Day {calculatedResults.totalDuration}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 justify-center">
                                                    <Button
                                                        onClick={() => {
                                                            const currentProject: Project = {
                                                                id: Date.now().toString(),
                                                                projectName: formData.projectName,
                                                                projectId: formData.projectId,
                                                                projectDescription: formData.projectDescription,
                                                                startDate: formData.startDate,
                                                                endDate: formData.endDate,
                                                                tasks: calculatedResults.tasks,
                                                                criticalPath: calculatedResults.criticalPath,
                                                                totalDuration: calculatedResults.totalDuration,
                                                                status: formData.status,
                                                                createdAt: new Date().toLocaleDateString()
                                                            };
                                                            downloadGanttChart(currentProject);
                                                        }}
                                                        className="px-8 py-4 h-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-lg font-bold rounded-2xl shadow-2xl shadow-cyan-500/50 transition-all duration-300 hover:scale-105 border border-cyan-400/30"
                                                    >
                                                        <Download className="mr-2 h-5 w-5" />
                                                        Download Schedule
                                                    </Button>
                                                    <Button
                                                        onClick={() => setActiveTab("history")}
                                                        variant="outline"
                                                        className="px-8 py-4 h-auto border-2 border-cyan-400/40 hover:bg-cyan-400/10 text-cyan-300 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105"
                                                    >
                                                        Save to History
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history">
                        {/* Search Section */}
                        <Card
                            className="mb-8 backdrop-blur-2xl bg-white/10 border border-blue-400/30 rounded-3xl shadow-2xl shadow-blue-500/30 transition-all duration-500"
                        >
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Search className="h-5 w-5 text-cyan-400" />
                                    <CardTitle className="text-2xl font-bold text-blue-100">Project History</CardTitle>
                                </div>
                                <CardDescription className="text-blue-300/70">
                                    {projectHistory.length} project{projectHistory.length !== 1 ? 's' : ''} in history
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-3 items-center">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400/60" />
                                        <div className="flex items-center gap-2">
                                            <Input
                                                placeholder="Search by project name, ID, or status..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                className="pl-12 h-12 bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 focus:border-cyan-400/50 rounded-2xl placeholder:text-blue-400/40 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300"
                                            />
                                            <VoiceButton onTranscript={(text) => setSearchTerm(text)} />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleSearch}
                                        className="h-12 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/40 transition-all duration-300"
                                    >
                                        <Search className="mr-2 h-5 w-5" />
                                        Search
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Project List */}
                        {filteredHistory.length > 0 ? (
                            <div className="grid gap-6">
                                {filteredHistory.map((project, index) => (
                                    <Card
                                        key={project.id}
                                        className="backdrop-blur-2xl bg-white/5 border border-blue-400/20 rounded-3xl shadow-2xl shadow-blue-500/20 transition-all duration-500 relative overflow-hidden"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <CardContent className="pt-6 relative z-10">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="space-y-3 flex-1">
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <h3 className="font-bold text-xl text-blue-100">
                                                            {project.projectName}
                                                        </h3>
                                                        <Badge
                                                            className={`px-3 py-1 rounded-xl font-semibold border-0 ${project.status === 'Completed'
                                                                ? 'bg-green-500/80 text-white shadow-green-500/30'
                                                                : project.status === 'In Progress'
                                                                    ? 'bg-blue-500/80 text-white shadow-blue-500/30'
                                                                    : project.status === 'Delayed'
                                                                        ? 'bg-red-500/80 text-white shadow-red-500/30'
                                                                        : 'bg-blue-500/80 text-white shadow-blue-500/30'
                                                                }`}
                                                        >
                                                            {project.status}
                                                        </Badge>
                                                        <Badge className="bg-gradient-to-r from-purple-500/80 to-violet-500/80 text-white border-0 px-3 py-1 rounded-xl font-semibold shadow-lg shadow-purple-500/30">
                                                            ID: {project.projectId}
                                                        </Badge>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-sm text-blue-300/80">
                                                            {project.projectDescription}
                                                        </p>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                                            <div className="space-y-1 p-3 bg-white/5 rounded-xl border border-blue-400/20">
                                                                <p className="text-xs text-blue-400/80">Duration</p>
                                                                <p className="text-lg font-bold text-white">{project.totalDuration} days</p>
                                                            </div>
                                                            <div className="space-y-1 p-3 bg-white/5 rounded-xl border border-blue-400/20">
                                                                <p className="text-xs text-blue-400/80">Tasks</p>
                                                                <p className="text-lg font-bold text-white">{project.tasks.length}</p>
                                                            </div>
                                                            <div className="space-y-1 p-3 bg-white/5 rounded-xl border border-blue-400/20">
                                                                <p className="text-xs text-blue-400/80">Critical Path</p>
                                                                <p className="text-lg font-bold text-red-300">{project.criticalPath.length} tasks</p>
                                                            </div>
                                                            <div className="space-y-1 p-3 bg-white/5 rounded-xl border border-blue-400/20">
                                                                <p className="text-xs text-blue-400/80">Created</p>
                                                                <p className="text-lg font-bold text-white">{project.createdAt}</p>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 p-3 bg-white/5 rounded-xl border border-red-400/20">
                                                            <p className="text-sm font-bold text-red-300 mb-2">Critical Path:</p>
                                                            <p className="text-white font-medium">
                                                                {project.criticalPath.join(" → ")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => downloadGanttChart(project)}
                                                        className="text-white border-2 border-blue-400/40 hover:bg-gradient-to-r hover:from-blue-600/80 hover:to-cyan-600/80 hover:border-cyan-400/60 backdrop-blur-xl bg-white/5 rounded-2xl px-6 py-6 font-bold shadow-lg transition-all duration-300"
                                                    >
                                                        <Download className="mr-2 h-5 w-5" />
                                                        Download
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setFormData({
                                                                ...formData,
                                                                projectName: project.projectName,
                                                                projectId: project.projectId,
                                                                projectDescription: project.projectDescription,
                                                                startDate: project.startDate,
                                                                endDate: project.endDate,
                                                                status: project.status,
                                                                tasks: project.tasks
                                                            });
                                                            setActiveTab("calculator");
                                                            setCalculatedResults({
                                                                tasks: project.tasks,
                                                                criticalPath: project.criticalPath,
                                                                totalDuration: project.totalDuration
                                                            });
                                                            setShowResult(true);
                                                        }}
                                                        className="text-blue-400 border border-blue-400/30 hover:bg-blue-400/10 backdrop-blur-xl rounded-2xl px-6 py-6 font-bold transition-all duration-300"
                                                    >
                                                        <Calculator className="mr-2 h-5 w-5" />
                                                        View Analysis
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card
                                className="backdrop-blur-2xl bg-white/5 border border-blue-400/20 rounded-3xl shadow-2xl shadow-blue-500/30"
                            >
                                <CardContent className="pt-6 text-center py-16">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="p-6 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-400/30 shadow-lg shadow-blue-500/40">
                                            <Database className="h-12 w-12 text-blue-300 animate-pulse" />
                                        </div>
                                        <p className="text-blue-300/80 text-lg font-medium">No project records found.</p>
                                        <p className="text-blue-400/60 text-sm">Try adjusting your search terms or create a new project schedule</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>

                <div className="mt-8 text-center">
                    <p className="text-blue-300/50 text-sm backdrop-blur-md inline-block px-6 py-2 rounded-full border border-blue-400/20">
                        Powered by Advanced CPM Engine ⚙️ | Civil Engineering Automation
                    </p>
                </div>
            </main>
        </div>
    );
};

export default CivilEngineering;
