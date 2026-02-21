import sys
import json
import pandas as pd
import numpy as np
import networkx as nx

def compute_cpm(df):
    G = nx.DiGraph()
    # Add Tasks
    for _, row in df.iterrows():
        task = row["id"] # Use ID to avoid parsing issues with names
        duration = row["duration"]
        G.add_node(task, duration=duration, name=row["name"])

    # Add dependencies and edges
    for _, row in df.iterrows():
        task = row["id"]
        dependencies = row.get("dependencies", [])
        if dependencies:
            for dep in dependencies:
                # Find the ID of the dependency by its name
                dep_id = None
                for _, dep_row in df.iterrows():
                     if dep_row["name"] == dep:
                         dep_id = dep_row["id"]
                         break
                if dep_id and dep_id in G.nodes:
                    G.add_edge(dep_id, task)

    return G

def calculate_cpm(df, G):
    # Forward Pass
    ES, EF = {}, {}
    for node in nx.topological_sort(G):
        if not list(G.predecessors(node)):
            ES[node] = 0
        else:
            ES[node] = max(EF[p] for p in G.predecessors(node))
        EF[node] = ES[node] + G.nodes[node]["duration"]

    # Backward Pass
    LF, LS = {}, {}
    # Handle disconnected graph or empty graph
    if not EF:
        maxEF = 0
    else:
        maxEF = max(EF.values())
        
    for node in reversed(list(nx.topological_sort(G))):
        if not list(G.successors(node)):
            LF[node] = maxEF
        else:
            LF[node] = min(LS[s] for s in G.successors(node))
        LS[node] = LF[node] - G.nodes[node]["duration"]

    # Slack and Critical Path
    slack = {task: LS[task] - ES[task] for task in G.nodes}
    critical_path = [G.nodes[task]["name"] for task in G.nodes if slack[task] == 0]
    
    # Sort tasks to maintain original order as much as possible, or by ES
    tasks_result = []
    
    # Re-map back to the frontend expected format
    for _, row in df.iterrows():
        task_id = row["id"]
        # In case a node was dropped or not calculated properly
        if task_id in ES:
            tasks_result.append({
                "id": task_id,
                "name": G.nodes[task_id]["name"],
                "duration": G.nodes[task_id]["duration"],
                "dependencies": row.get("dependencies", []),
                "es": int(ES[task_id]),
                "ef": int(EF[task_id]),
                "ls": int(LS[task_id]),
                "lf": int(LF[task_id]),
                "slack": int(slack[task_id]),
                "critical": slack[task_id] == 0
            })
        else:
            # Fallback for uncalculated nodes (e.g., circular dependencies)
             tasks_result.append({
                "id": task_id,
                "name": row["name"],
                "duration": row["duration"],
                "dependencies": row.get("dependencies", []),
                "es": 0, "ef": 0, "ls": 0, "lf": 0, "slack": 0, "critical": False
            })

    return {
        "tasks": tasks_result,
        "criticalPath": critical_path,
        "totalDuration": int(maxEF)
    }

def main():
    try:
        # Read JSON from standard input
        input_data = sys.stdin.read()
        if not input_data:
             print(json.dumps({"error": "No input provided"}))
             sys.exit(1)
             
        # Parse the JSON tasks
        tasks = json.loads(input_data)
        
        # Convert to pandas DataFrame
        df = pd.DataFrame(tasks)
        
        # If empty
        if df.empty:
             print(json.dumps({"tasks": [], "criticalPath": [], "totalDuration": 0}))
             return

        # Calculate CPM
        G = compute_cpm(df)
        
        # Handle circular dependencies
        try:
            list(nx.topological_sort(G))
        except nx.NetworkXUnfeasible:
             print(json.dumps({"error": "Circular dependency detected in tasks."}))
             sys.exit(1)
             
        result = calculate_cpm(df, G)
        
        # Output the result as JSON
        print(json.dumps(result))
        
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()