       // Get references to DOM elements
        const taskInput = document.getElementById("taskInput");
        const addTaskBtn = document.getElementById("addTask");
        const taskList = document.getElementById("taskList");
        const filterInput = document.getElementById("filterInput");
        const clearCompletedBtn = document.getElementById("clearCompleted");
        const clearAllBtn = document.getElementById("clearAll");

        // Save tasks to local storage
        function saveTasks() {
            const tasks = [];
            taskList.querySelectorAll("li").forEach(li => {
                tasks.push({
                    text: li.querySelector(".task-text").textContent,
                    completed: li.querySelector("input[type=checkbox]").checked
                });
            });
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }

        // Load tasks from local storage
        function loadTasks() {
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks.forEach(task => {
                addTaskToDOM(task.text, task.completed);
            });
        }

        // Add a task to the DOM
        function addTaskToDOM(text, completed = false) {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = completed;
            checkbox.className = "mr-3";
            checkbox.addEventListener("change", () => {
                li.classList.toggle("completed", checkbox.checked);
                saveTasks();
            });

            const span = document.createElement("span");
            span.className = "task-text flex-grow-1";
            span.textContent = text;
            if (completed) {
                li.classList.add("completed");
            }

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.className = "btn btn-danger btn-sm ml-3 btn-remove";
            removeBtn.type = "button";
            removeBtn.onclick = () => {
                taskList.removeChild(li);
                saveTasks();
            };

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(removeBtn);
            taskList.appendChild(li);
            saveTasks();
        }

        // Event listener for adding a task
        addTaskBtn.addEventListener("click", () => {
            const taskText = taskInput.value.trim();
            if (taskText) {
                addTaskToDOM(taskText);
                taskInput.value = "";
                taskInput.focus();
            }
        });

        // Allow adding a task by pressing Enter
        taskInput.addEventListener("keypress", e => {
            if (e.key === "Enter") {
                addTaskBtn.click();
            }
        });

        // Filter tasks based on input
        filterInput.addEventListener("input", () => {
            const filter = filterInput.value.toLowerCase();
            taskList.querySelectorAll("li").forEach(li => {
                const text = li.querySelector(".task-text").textContent.toLowerCase();
                li.style.display = text.includes(filter) ? "" : "none";
            });
        });

        // Clear completed tasks
        clearCompletedBtn.addEventListener("click", () => {
            taskList.querySelectorAll("li").forEach(li => {
                const checkbox = li.querySelector("input[type=checkbox]");
                if (checkbox.checked) taskList.removeChild(li);
            });
            saveTasks();
        });

        // Clear all tasks
        clearAllBtn.addEventListener("click", () => {
            while (taskList.firstChild) {
                taskList.removeChild(taskList.firstChild);
            }
            saveTasks();
        });

        // Load tasks when the page is loaded
        loadTasks();