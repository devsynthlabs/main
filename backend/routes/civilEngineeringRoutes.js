import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from "jsonwebtoken";
import CivilProject from '../models/CivilProject.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};

// Endpoint to calculate the CPM using the Python script
router.post('/calculate-cpm', (req, res) => {
    const tasks = req.body.tasks;

    if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).json({ error: 'Valid tasks array is required' });
    }

    // Path to the python script
    const scriptPath = path.join(__dirname, '..', 'civil_engineering_project_schedule_ui_ai.py');

    // Determine the python command (use python3 for mac/linux, python for windows usually, but venv is mostly python3)
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';

    // Default to the system python, but preferably use the venv python if it exists
    const venvPythonPath = path.join(__dirname, '..', 'venv', 'bin', 'python3');

    // We will try running it with the virtual environment python for better dependency resolution
    const pythonProcess = spawn(venvPythonPath, [scriptPath]);

    let pythonOutput = '';
    let pythonError = '';

    // Pass the tasks as a JSON string to standard input
    pythonProcess.stdin.write(JSON.stringify(tasks));
    pythonProcess.stdin.end();

    // Listen for data from standard output
    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
    });

    // Listen for data from standard error
    pythonProcess.stderr.on('data', (data) => {
        pythonError += data.toString();
    });

    // Handle process completion
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script exited with code ${code}. Error: ${pythonError}`);
            return res.status(500).json({ error: 'Failed to calculate CPM. Please check the project dependencies and try again.', details: pythonError });
        }

        try {
            // Parse the JSON output from the python script
            const result = JSON.parse(pythonOutput);

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Failed to parse Python output:', pythonOutput);
            res.status(500).json({ error: 'Failed to parse CPM results.', details: error.message });
        }
    });
});

// Endpoint to save a calculated project to project history
router.post('/save-project', verifyToken, async (req, res) => {
    try {
        const { projectName, projectId, projectDescription, startDate, endDate, status, tasks, criticalPath, totalDuration } = req.body;

        const newProject = new CivilProject({
            userId: req.user.id,
            projectName,
            projectId,
            projectDescription,
            startDate,
            endDate,
            status,
            tasks,
            criticalPath,
            totalDuration
        });

        await newProject.save();
        res.status(201).json({ message: "Project saved successfully", project: newProject });
    } catch (error) {
        console.error("Error saving project:", error);
        res.status(500).json({ error: "Failed to save project. Please try again.", details: error.message });
    }
});

// Endpoint to fetch project history for the user
router.get('/history', verifyToken, async (req, res) => {
    try {
        const history = await CivilProject.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        console.error("Error fetching project history:", error);
        res.status(500).json({ error: "Failed to load project history." });
    }
});

export default router;
