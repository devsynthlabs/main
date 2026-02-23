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
import { apiRequest, API_ENDPOINTS } from "@/lib/api";
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
            { id: "1", name: "A-Site Preparation", duration: 5, dependencies: [] },
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
    const [isCalculating, setIsCalculating] = useState(false);
    const [calculationError, setCalculationError] = useState<string | null>(null);

    // History State
    const [searchTerm, setSearchTerm] = useState("");
    const [projectHistory, setProjectHistory] = useState<Project[]>([]);
    const [filteredHistory, setFilteredHistory] = useState<Project[]>([]);

    // Fetch history from Backend Database API
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await apiRequest(API_ENDPOINTS.CIVIL_GET_HISTORY);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        setProjectHistory(data);
                        setFilteredHistory(data);

                        // Load the first item to display something by default
                        setCalculatedResults({
                            tasks: data[0].tasks,
                            criticalPath: data[0].criticalPath,
                            totalDuration: data[0].totalDuration
                        });
                        setShowResult(true);
                    } else {
                        // Empty state: Set empty UI correctly if no projects found in DB
                        setProjectHistory([]);
                        setFilteredHistory([]);
                        setShowResult(false);
                    }
                }
            } catch (error) {
                console.error("Failed to load project history from server.", error);
            }
        };

        fetchHistory();
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
    const calculateCPM = async (tasks: Task[]) => {
        setIsCalculating(true);
        setCalculationError(null);
        setDependencyWarnings([]);

        try {
            const response = await apiRequest(API_ENDPOINTS.CIVIL_CPM_CALCULATE, {
                method: 'POST',
                body: JSON.stringify({ tasks: tasks })
            });

            const data = await response.json();

            if (!response.ok) {
                setCalculationError(data.error || "Failed to calculate CPM");
                return null;
            }

            return data;
        } catch (error: any) {
            console.error("CPM Calculation error:", error);
            setCalculationError(error.message || "Network error occurred while connecting to the backend.");
            return null;
        } finally {
            setIsCalculating(false);
        }
    };

    const handleCalculateCPM = async () => {
        const results = await calculateCPM(formData.tasks);

        if (results) {
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

            // Save to Backend Database Instead of Local Storage
            try {
                const saveResponse = await apiRequest(API_ENDPOINTS.CIVIL_SAVE_PROJECT, {
                    method: 'POST',
                    body: JSON.stringify(newProject)
                });

                if (saveResponse.ok) {
                    const savedData = await saveResponse.json();
                    setProjectHistory(prev => [savedData.project, ...prev]);
                    setFilteredHistory(prev => [savedData.project, ...prev]);
                } else {
                    console.error("Failed to save project to Database");
                }
            } catch (err) {
                console.error("Error saving project to network:", err);
            }
        }
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

    // Real-time dependency validation
    useEffect(() => {
        const taskNames = formData.tasks.map(t => t.name.trim()).filter(Boolean);
        const warnings: string[] = [];
        formData.tasks.forEach(task => {
            task.dependencies.forEach(dep => {
                if (!taskNames.includes(dep)) {
                    warnings.push(`Warning: Dependency '${dep}' for task '${task.name}' not found in task list.`);
                }
            });
        });
        setDependencyWarnings(warnings);
    }, [formData.tasks]);

    // Download / Print Professional Schedule
    const downloadGanttChart = (project: Project) => {
        const criticalCount = project.tasks.filter(t => t.critical).length;
        const nonCriticalCount = project.tasks.length - criticalCount;

        const printHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Project Schedule - ${project.projectName}</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 15mm;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1e293b;
            background: #fff;
            line-height: 1.5;
            font-size: 11px;
        }

        /* Header */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 12px;
            border-bottom: 3px solid #0f172a;
            margin-bottom: 16px;
        }
        .header-left h1 {
            font-size: 22px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.5px;
        }
        .header-left .subtitle {
            font-size: 11px;
            color: #64748b;
            margin-top: 2px;
        }
        .header-right {
            text-align: right;
            font-size: 10px;
            color: #64748b;
        }
        .header-right .project-id {
            font-size: 13px;
            font-weight: 700;
            color: #0f172a;
        }

        /* Info Grid */
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 10px;
            margin-bottom: 16px;
        }
        .info-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 8px 12px;
        }
        .info-box .label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #94a3b8;
            font-weight: 600;
        }
        .info-box .value {
            font-size: 13px;
            font-weight: 700;
            color: #0f172a;
            margin-top: 2px;
        }
        .info-box .value.critical-text { color: #dc2626; }
        .info-box .value.duration-text { color: #059669; }

        /* Critical Path Banner */
        .critical-banner {
            background: linear-gradient(135deg, #fef2f2, #fff1f2);
            border: 1px solid #fecaca;
            border-left: 4px solid #dc2626;
            border-radius: 6px;
            padding: 10px 14px;
            margin-bottom: 16px;
        }
        .critical-banner .label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #dc2626;
            font-weight: 700;
        }
        .critical-banner .path {
            font-size: 12px;
            font-weight: 600;
            color: #991b1b;
            margin-top: 4px;
        }

        /* Table */
        .schedule-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
            font-size: 10px;
        }
        .schedule-table thead th {
            background: #0f172a;
            color: #fff;
            padding: 8px 10px;
            text-align: center;
            font-weight: 700;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .schedule-table thead th:first-child { text-align: left; border-radius: 6px 0 0 0; }
        .schedule-table thead th:last-child { border-radius: 0 6px 0 0; }
        .schedule-table tbody tr { border-bottom: 1px solid #e2e8f0; }
        .schedule-table tbody tr:nth-child(even) { background: #f8fafc; }
        .schedule-table tbody tr.critical-row { background: #fef2f2; }
        .schedule-table tbody td {
            padding: 7px 10px;
            text-align: center;
            color: #334155;
        }
        .schedule-table tbody td:first-child { text-align: left; font-weight: 600; color: #0f172a; }
        .schedule-table .badge {
            display: inline-block;
            padding: 1px 6px;
            border-radius: 10px;
            font-size: 8px;
            font-weight: 700;
        }
        .badge-critical { background: #fecaca; color: #991b1b; }
        .badge-flexible { background: #d1fae5; color: #065f46; }
        .slack-zero { color: #dc2626; font-weight: 700; }
        .slack-positive { color: #059669; font-weight: 600; }

        /* Gantt Chart */
        .gantt-section { margin-bottom: 16px; }
        .gantt-section h3 {
            font-size: 13px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 10px;
            padding-bottom: 4px;
            border-bottom: 1px solid #e2e8f0;
        }
        .gantt-row {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
        }
        .gantt-label {
            width: 130px;
            font-size: 9px;
            font-weight: 600;
            color: #334155;
            text-align: right;
            padding-right: 10px;
            flex-shrink: 0;
        }
        .gantt-track {
            flex: 1;
            height: 18px;
            background: #f1f5f9;
            border-radius: 3px;
            position: relative;
            border: 1px solid #e2e8f0;
        }
        .gantt-bar {
            position: absolute;
            height: 100%;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 7px;
            font-weight: 700;
            color: #fff;
        }
        .gantt-bar.critical { background: #dc2626; }
        .gantt-bar.normal { background: #0891b2; }
        .gantt-slack {
            position: absolute;
            height: 100%;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                #e2e8f0 2px,
                #e2e8f0 4px
            );
            border-radius: 2px;
            opacity: 0.6;
        }
        .gantt-timeline {
            display: flex;
            margin-top: 4px;
        }
        .gantt-timeline-spacer { width: 130px; flex-shrink: 0; }
        .gantt-timeline-bar {
            flex: 1;
            display: flex;
            justify-content: space-between;
            font-size: 8px;
            color: #94a3b8;
        }

        /* Footer */
        .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 2px solid #0f172a;
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #94a3b8;
        }
        .footer strong { color: #0f172a; }

        /* Description */
        .description {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 8px 12px;
            margin-bottom: 16px;
            font-size: 10px;
            color: #475569;
        }
        .description .label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #94a3b8;
            font-weight: 600;
            margin-bottom: 2px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="header-left">
            <h1>${project.projectName || "Untitled Project"}</h1>
            <div class="subtitle">Critical Path Method (CPM) Schedule Report</div>
        </div>
        <div class="header-right">
            <div class="project-id">${project.projectId || ""}</div>
            <div>Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div>Status: <strong>${project.status || "N/A"}</strong></div>
        </div>
    </div>

    <!-- Info Grid -->
    <div class="info-grid">
        <div class="info-box">
            <div class="label">Start Date</div>
            <div class="value">${project.startDate || "N/A"}</div>
        </div>
        <div class="info-box">
            <div class="label">End Date</div>
            <div class="value">${project.endDate || "N/A"}</div>
        </div>
        <div class="info-box">
            <div class="label">Total Duration</div>
            <div class="value duration-text">${project.totalDuration || 0} Days</div>
        </div>
        <div class="info-box">
            <div class="label">Tasks</div>
            <div class="value">${project.tasks.length} Total <span style="color:#dc2626;font-size:10px;">(${criticalCount} Critical)</span></div>
        </div>
    </div>

    ${project.projectDescription ? `
    <div class="description">
        <div class="label">Project Description</div>
        ${project.projectDescription}
    </div>` : ''}

    <!-- Critical Path -->
    <div class="critical-banner">
        <div class="label">Critical Path (Longest Sequence - Zero Slack)</div>
        <div class="path">${project.criticalPath.join("  &#8594;  ")}</div>
    </div>

    <!-- CPM Schedule Table -->
    <table class="schedule-table">
        <thead>
            <tr>
                <th>Task Name</th>
                <th>Duration</th>
                <th>Dependencies</th>
                <th>ES</th>
                <th>EF</th>
                <th>LS</th>
                <th>LF</th>
                <th>Slack</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            ${project.tasks.map(task => `
            <tr class="${task.critical ? 'critical-row' : ''}">
                <td>${task.name}</td>
                <td>${task.duration} days</td>
                <td>${task.dependencies?.length ? task.dependencies.join(', ') : '—'}</td>
                <td>Day ${task.es ?? 0}</td>
                <td>Day ${task.ef ?? 0}</td>
                <td>Day ${task.ls ?? 0}</td>
                <td>Day ${task.lf ?? 0}</td>
                <td class="${(task.slack ?? 0) === 0 ? 'slack-zero' : 'slack-positive'}">${task.slack ?? 0}d</td>
                <td><span class="badge ${task.critical ? 'badge-critical' : 'badge-flexible'}">${task.critical ? 'CRITICAL' : '-'}</span></td>
            </tr>`).join('')}
        </tbody>
    </table>

    <!-- Gantt Chart -->
    <div class="gantt-section">
        <h3>Gantt Chart</h3>
        ${project.tasks.map(task => `
        <div class="gantt-row">
            <div class="gantt-label">${task.name}</div>
            <div class="gantt-track">
                <div class="gantt-bar ${task.critical ? 'critical' : 'normal'}"
                    style="left:${((task.es ?? 0) / (project.totalDuration || 1)) * 100}%;width:${Math.max((task.duration / (project.totalDuration || 1)) * 100, 2)}%;">
                    ${task.duration}d
                </div>
                ${!task.critical && (task.slack ?? 0) > 0 ? `<div class="gantt-slack" style="left:${((task.ef ?? 0) / (project.totalDuration || 1)) * 100}%;width:${((task.slack ?? 0) / (project.totalDuration || 1)) * 100}%;"></div>` : ''}
            </div>
        </div>`).join('')}
        <div class="gantt-timeline">
            <div class="gantt-timeline-spacer"></div>
            <div class="gantt-timeline-bar">
                <span>Day 0</span>
                <span>Day ${Math.round((project.totalDuration || 0) / 4)}</span>
                <span>Day ${Math.round((project.totalDuration || 0) / 2)}</span>
                <span>Day ${Math.round((project.totalDuration || 0) * 3 / 4)}</span>
                <span>Day ${project.totalDuration || 0}</span>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <div><strong>Civil Engineering Automation Platform</strong> &mdash; CPM Schedule Report</div>
        <div>Page 1 of 1 &nbsp;|&nbsp; ${new Date().toLocaleString()}</div>
    </div>
</body>
</html>`.trim();

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printHTML);
            printWindow.document.close();
            setTimeout(() => { printWindow.print(); }, 300);
        }
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
                                {/* Dependency Warnings & Errors */}
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

                                {calculationError && (
                                    <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription className="text-red-200">
                                            {calculationError}
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
                                            <VoiceButton
                                                onTranscript={(text) => handleInputChange("projectName", text)}
                                                onClear={() => handleInputChange("projectName", "")}
                                            />
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
                                            <VoiceButton
                                                onTranscript={(text) => handleInputChange("projectId", text)}
                                                onClear={() => handleInputChange("projectId", "")}
                                            />
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
                                            className="bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl h-12 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
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
                                            className="bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl h-12 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
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
                                            <VoiceButton
                                                onTranscript={(text) => handleInputChange("projectDescription", text)}
                                                onClear={() => handleInputChange("projectDescription", "")}
                                            />
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
                                                                <VoiceButton
                                                                    onTranscript={(text) => handleTaskChange(task.id, "name", text)}
                                                                    onClear={() => handleTaskChange(task.id, "name", "")}
                                                                />
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
                                                            {/* Inline dependency warnings */}
                                                            {task.dependencies.some(dep => !formData.tasks.some(t => t.name.trim() === dep)) && (
                                                                <div className="mt-2 space-y-1">
                                                                    {task.dependencies
                                                                        .filter(dep => !formData.tasks.some(t => t.name.trim() === dep))
                                                                        .map((dep, idx) => (
                                                                            <div key={idx} className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-400/20 rounded-lg px-2.5 py-1.5">
                                                                                <AlertCircle className="h-3 w-3 shrink-0" />
                                                                                Warning: Dependency '{dep}' for task '{task.name}' not found in task list.
                                                                            </div>
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
                                        disabled={isCalculating}
                                        className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-lg rounded-xl shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-[1.02] border border-blue-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Calculator className={`mr-2 h-5 w-5 ${isCalculating ? "animate-spin" : ""}`} />
                                        {isCalculating ? "Calculating via AI Backend..." : "Calculate Critical Path"}
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
                                                <div className="mb-8 overflow-x-auto text-left">
                                                    <div className="mb-4 flex justify-between items-center">
                                                        <div className="text-cyan-300/80 text-sm font-medium">
                                                            {calculatedResults.tasks.length} Tasks Analyzed
                                                        </div>
                                                    </div>

                                                    <div className="rounded-2xl overflow-hidden border border-blue-400/30">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow className="bg-slate-800/80 border-b border-blue-400/30">
                                                                    <TableHead className="text-cyan-300 font-bold text-sm tracking-wide">Task</TableHead>
                                                                    <TableHead className="text-cyan-300 font-bold text-sm tracking-wide text-center">Duration</TableHead>
                                                                    <TableHead className="text-cyan-300 font-bold text-sm tracking-wide text-center">ES</TableHead>
                                                                    <TableHead className="text-cyan-300 font-bold text-sm tracking-wide text-center">EF</TableHead>
                                                                    <TableHead className="text-cyan-300 font-bold text-sm tracking-wide text-center">LS</TableHead>
                                                                    <TableHead className="text-cyan-300 font-bold text-sm tracking-wide text-center">LF</TableHead>
                                                                    <TableHead className="text-cyan-300 font-bold text-sm tracking-wide text-center">Slack</TableHead>
                                                                    <TableHead className="text-cyan-300 font-bold text-sm tracking-wide text-center">Status</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {calculatedResults.tasks.map((task, index) => (
                                                                    <TableRow
                                                                        key={task.id}
                                                                        className={`border-b border-blue-400/10 transition-colors ${task.critical ? "bg-red-500/10 hover:bg-red-500/15" : index % 2 === 0 ? "bg-slate-800/40 hover:bg-slate-700/40" : "bg-slate-800/20 hover:bg-slate-700/30"}`}
                                                                    >
                                                                        <TableCell className="font-semibold text-white text-sm">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className={`w-1.5 h-8 rounded-full ${task.critical ? 'bg-red-400' : 'bg-cyan-400/40'}`} />
                                                                                {task.name}
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="text-blue-100 text-sm text-center font-medium">{task.duration}d</TableCell>
                                                                        <TableCell className="text-emerald-300 text-sm text-center font-medium">{task.es}</TableCell>
                                                                        <TableCell className="text-emerald-300 text-sm text-center font-medium">{task.ef}</TableCell>
                                                                        <TableCell className="text-violet-300 text-sm text-center font-medium">{task.ls}</TableCell>
                                                                        <TableCell className="text-violet-300 text-sm text-center font-medium">{task.lf}</TableCell>
                                                                        <TableCell className="text-center">
                                                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${task.slack === 0 ? 'bg-red-500/20 text-red-300 border border-red-400/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'}`}>
                                                                                {task.slack}d
                                                                            </span>
                                                                        </TableCell>
                                                                        <TableCell className="text-center">
                                                                            {task.critical ? (
                                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/25 text-red-300 border border-red-400/40">
                                                                                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                                                                                    Critical
                                                                                </span>
                                                                            ) : (
                                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300/80 border border-emerald-400/20">
                                                                                    -
                                                                                </span>
                                                                            )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>

                                                    {/* Legend */}
                                                    <div className="mt-4 flex items-center gap-6 text-xs text-blue-300/60">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-emerald-300">ES/EF</span> = Early Start / Early Finish
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-violet-300">LS/LF</span> = Late Start / Late Finish
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full" /> = Critical (0 slack)
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Gantt Chart Preview */}
                                                <div className="mb-8 p-6 bg-slate-800/50 rounded-2xl border border-blue-400/20">
                                                    <h3 className="text-lg font-bold text-cyan-300 mb-6 flex items-center gap-2">
                                                        <BarChart3 className="h-5 w-5 text-cyan-400" />
                                                        Gantt Chart Preview
                                                    </h3>

                                                    {/* Timeline header */}
                                                    <div className="mb-2 flex">
                                                        <div className="w-40 shrink-0" />
                                                        <div className="flex-1 flex justify-between text-xs text-blue-300/50 px-1">
                                                            <span>Day 0</span>
                                                            <span>Day {Math.round(calculatedResults.totalDuration / 4)}</span>
                                                            <span>Day {Math.round(calculatedResults.totalDuration / 2)}</span>
                                                            <span>Day {Math.round(calculatedResults.totalDuration * 3 / 4)}</span>
                                                            <span>Day {calculatedResults.totalDuration}</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {calculatedResults.tasks.map((task) => (
                                                            <div key={task.id} className="flex items-center gap-3">
                                                                {/* Task label */}
                                                                <div className="w-40 shrink-0 text-right pr-2">
                                                                    <span className={`text-sm font-medium ${task.critical ? 'text-red-300' : 'text-blue-200'}`}>
                                                                        {task.name}
                                                                    </span>
                                                                    <div className="text-[10px] text-blue-400/50">
                                                                        {task.duration}d
                                                                    </div>
                                                                </div>

                                                                {/* Bar area */}
                                                                <div className="flex-1 relative h-8 bg-slate-900/40 rounded-lg overflow-hidden border border-blue-400/10">
                                                                    {/* Grid lines */}
                                                                    <div className="absolute inset-0 flex">
                                                                        {[25, 50, 75].map(pct => (
                                                                            <div key={pct} className="absolute h-full border-l border-blue-400/5" style={{ left: `${pct}%` }} />
                                                                        ))}
                                                                    </div>

                                                                    {/* Task bar */}
                                                                    <div
                                                                        className={`absolute h-full rounded-md flex items-center justify-center text-[10px] font-bold text-white/90 shadow-lg transition-all ${task.critical ? 'bg-gradient-to-r from-red-500 to-rose-500 shadow-red-500/30' : 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-cyan-500/30'}`}
                                                                        style={{
                                                                            left: `${(task.es || 0) / calculatedResults.totalDuration * 100}%`,
                                                                            width: `${Math.max(task.duration / calculatedResults.totalDuration * 100, 3)}%`
                                                                        }}
                                                                    >
                                                                        {task.duration >= calculatedResults.totalDuration * 0.08 && `${task.duration}d`}
                                                                    </div>

                                                                    {/* Slack indicator for non-critical tasks */}
                                                                    {!task.critical && task.slack > 0 && (
                                                                        <div
                                                                            className="absolute h-full rounded-md bg-cyan-400/10 border border-dashed border-cyan-400/20"
                                                                            style={{
                                                                                left: `${(task.ef || 0) / calculatedResults.totalDuration * 100}%`,
                                                                                width: `${task.slack / calculatedResults.totalDuration * 100}%`
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Gantt Legend */}
                                                    <div className="mt-5 pt-4 border-t border-blue-400/10 flex items-center gap-6 text-xs text-blue-300/60">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-2.5 rounded-sm bg-gradient-to-r from-red-500 to-rose-500" />
                                                            Critical Path
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-2.5 rounded-sm bg-gradient-to-r from-cyan-500 to-blue-500" />
                                                            Early Start
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-2.5 rounded-sm border border-dashed border-cyan-400/30 bg-cyan-400/10" />
                                                            Late Start
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
                                                        onClick={() => {
                                                            setActiveTab("history");
                                                        }}
                                                        variant="outline"
                                                        className="px-8 py-4 h-auto border-2 border-cyan-400/40 hover:bg-cyan-400/10 text-cyan-300 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105"
                                                    >
                                                        View in History
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
                                            <VoiceButton
                                                onTranscript={(text) => setSearchTerm(text)}
                                                onClear={() => setSearchTerm("")}
                                            />
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
