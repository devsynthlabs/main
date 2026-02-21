import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export default router;
