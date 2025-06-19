// Data storage (mimicking state)
let tasks = [
    {
        id: "1",
        title: "Design wireframes",
        description: "Create the wireframes for the homepage",
        priority: "High",
        assignee: "John Doe",
        dueDate: "2024-11-30",
        tags: ["Design", "UX"],
        status: "To Do",
    },
    {
        id: "2",
        title: "Set up database",
        description: "Initialize the PostgreSQL database",
        priority: "Medium",
        assignee: "Jane Smith",
        dueDate: "2024-11-25",
        tags: ["Backend", "Setup"],
        status: "Done",
    },
];

// Function to render the task form
function renderTaskForm() {
    const formHTML = `
        <div class="form-container hidden" id="formContainer">
            <input type="text" id="taskTitle" placeholder="Task Title">
            <input type="text" id="taskAssignee" placeholder="Assign To">
            <input type="date" id="taskDueDate" placeholder="Due Date">
            <select id="taskPriority" placeholder="Priority">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>
            <input type="text" id="taskDescription" placeholder="Task Description"></input>
            <input type="text" id="taskTags" placeholder="Tags (comma-separated)">
            <select id="taskStatus">
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
            </select>
            <button id="addTask">Add Task</button>
        </div>
        <button id="showForm">Add New Task</button>
    `;
    document.getElementById("taskForm").innerHTML = formHTML;

    // Toggle form visibility
    document.getElementById("showForm").onclick = () => {
        document.getElementById("formContainer").classList.toggle("hidden");
    };

    // Add task and update board
    document.getElementById("addTask").onclick = () => {
        const title = document.getElementById("taskTitle").value;
        const assignee = document.getElementById("taskAssignee").value;
        const dueDate = document.getElementById("taskDueDate").value;
        const priority = document.getElementById("taskPriority").value;
        const description = document.getElementById("taskDescription").value;
        const tags = document
            .getElementById("taskTags")
            .value.split(",")
            .map((tag) => tag.trim());
        const status = document.getElementById("taskStatus").value;

        if (title.trim()) {
            tasks.push({
                id: String(tasks.length + 1),
                title,
                description,
                priority,
                assignee,
                dueDate,
                tags,
                status,
            });
            renderTaskBoard();
            document.getElementById("formContainer").classList.add("hidden"); // Hide the form
        } else {
            alert("Task title is required!");
        }
    };
}

// Function to render the task board based on task status
function renderTaskBoard() {
    const columns = { "To Do": [], "In Progress": [], "Done": [] };
    tasks.forEach((task) => columns[task.status].push(task));

    let boardHTML = '<div class="board">';
    for (const column in columns) {
        boardHTML += `
            <div class="column">
                <h2>${column}</h2>
                <div class="tasks">
                    ${columns[column]
                        .map(
                            (task) => `
                            <div class="task" draggable="true" data-id="${task.id}">
                                <h3>${task.title}</h3>
                                <p><strong>Description:</strong> ${task.description}</p>
                                <p><strong>Assigned To:</strong> ${task.assignee}</p>
                                <p><strong>Priority:</strong> ${task.priority}</p>
                                <p><strong>Due Date:</strong> ${task.dueDate}</p>
                                <p><strong>Tags:</strong> ${task.tags.join(", ")}</p>
                            </div>
                        `
                        )
                        .join("")}
                </div>
            </div>
        `;
    }
    boardHTML += "</div>";
    document.getElementById("taskBoard").innerHTML = boardHTML;
}
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "Done").length;
    document.getElementById("totalTasks").textContent = totalTasks;
    document.getElementById("completedTasks").textContent = completedTasks;
}
renderTaskBoard();
updateStats();
document.getElementById("navButton").addEventListener("click", () => {
    const dropdown = document.getElementById("dropdownMenu");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});

// Close the dropdown if clicked outside
window.addEventListener("click", (event) => {
    const dropdown = document.getElementById("dropdownMenu");
    const button = document.getElementById("navButton");
    if (!dropdown.contains(event.target) && !button.contains(event.target)) {
        dropdown.style.display = "none";
    }
});


// Initialize
renderTaskForm();
renderTaskBoard();
