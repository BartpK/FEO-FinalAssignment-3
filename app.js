const tasksContainer = document.querySelector("#taskscontainer");
const taskInput = document.querySelector("#textInput");
document.querySelector("#addTask").addEventListener("click", async () => {

    let taskToUpload = `{ "description": "${taskInput.value}", "done": false }`
    taskInput.value = "";
    await fetch("https://to-dolist-e1881.firebaseio.com/Apps/Tasklist.json", {
        method: "POST", body: taskToUpload,
    })
    getData();
})



const getData = async () => {
    const response = await fetch('https://to-dolist-e1881.firebaseio.com/Apps/Tasklist.json');

    const data = await response.json();

    let tasks = Object.keys(data).map(key => ({
        id: key,
        description: data[key].description,
        done: data[key].done
    }));
    buildList(tasks);
}

getData();

const buildList = (tasks) => {
    tasksContainer.innerHTML = "";
    tasks.forEach(task => {
        const taskItem = document.createElement('input');
        taskItem.type = "checkbox";
        taskItem.name = task.id;
        if (task.done === true) {
            taskItem.checked = true;
        } else { }

        tasksContainer.appendChild(taskItem);
        const taskName = document.createElement('label');
        taskName.for = task.id;
        taskName.innerHTML = task.description;
        tasksContainer.appendChild(taskName);
        const deleteButton = document.createElement('img');
        deleteButton.src = 'trash-delete-icon.jpg';
        deleteButton.className = "deletebutton";
        tasksContainer.appendChild(deleteButton);
        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        })
        const editButton = document.createElement('button');
        editButton.innerHTML = "Edit";
        editButton.addEventListener("click", () => {
            updateTask(task.id, task.description)
        })
        tasksContainer.appendChild(editButton);
    });

}

const deleteTask = async (id) => {
    await fetch(`https://to-dolist-e1881.firebaseio.com/Apps/Tasklist/${id}.json`, { method: 'DELETE' })
    getData();
}

const updateTask = async (id, taskDescription) => {
    const taskPrompt = prompt("Please change your task description", taskDescription);
    const newTaskObject = `{ "description": "${taskPrompt}", "done": false }`
    await fetch(`https://to-dolist-e1881.firebaseio.com/Apps/Tasklist/${id}.json`, { method: 'PUT', body: newTaskObject })
    getData();
}

//To chamge existing item: Sent put request https://to-dolist-e1881.firebaseio.com/Apps/Tasklist/-MAgEjRYnc6gWClLjCmN.json