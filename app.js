const today = new Date();
const openTasksContainer = document.querySelector("#opentaskscontainer");
const completedTasksContainer = document.querySelector("#completedtaskscontainer");
const taskInput = document.querySelector("#textInput");
const dateInput = document.querySelector("#dateinput");
const nextTask = document.querySelector(".nextitem");
const nextTaskDate = document.querySelector(".nexttaskdate");
const body = document.querySelector("body");
const deleteCompleted = document.querySelector("#removecompletedbutton");

const showDate = () => {
    return dateInput.value;
}

document.querySelector("#addTask").addEventListener("click", async () => {
    if (dateInput.value == "" || taskInput.value == "") {
        alert("Please enter a task and a due date")
    } else {
        let taskToUpload = `{ "description": "${taskInput.value}", "done": false, "due_date": "${dateInput.value}" }`
        taskInput.value = "";
        await fetch("https://to-dolist-e1881.firebaseio.com/Apps/Tasklist.json", {
            method: "POST", body: taskToUpload,
        })
    }
    getData();
})

getData();

const buildList = (tasks) => {
    openTasksContainer.innerHTML = "";
    completedTasksContainer.innerHTML = "";
    tasks.forEach(task => {
        const taskItem = document.createElement('input');
        const taskName = document.createElement('label');
        const deleteButton = document.createElement('img');
        const editButton = document.createElement('img');
        const taskItemContainer = document.createElement('div');
        const dueDate = document.createElement('p');
        dueDate.className = "duedate";

        taskItemContainer.className = "taskitemcontainer";

        taskItem.type = "checkbox";
        taskItem.name = task.id;
        taskItem.className = "checkbox"
        taskName.for = task.id;
        taskName.innerHTML = task.description;

        dueDate.innerHTML = task.due_date;




        deleteButton.src = 'delete.svg';
        deleteButton.className = "deletebutton";
        editButton.className = "editbutton";
        editButton.src = 'edit.svg';

        taskItemContainer.appendChild(taskItem);
        taskItemContainer.appendChild(taskName);
        taskItemContainer.appendChild(dueDate);





        if (task.done === true) {

            taskItemContainer.appendChild(deleteButton);
            taskItem.checked = true;
            taskName.className = "completedtask";
            completedTasksContainer.appendChild(taskItemContainer);
        } else {
            if (((new Date(`${task.due_date}`).getTime() / 1000) - (today.getTime() / 1000)) < 172800) {
                taskItemContainer.classList += " urgent"
            } else if (((new Date(`${task.due_date}`).getTime() / 1000) - (today.getTime() / 1000)) < 604800) {
                taskItemContainer.classList += " moderate"
            } else {
                taskItemContainer.classList += " noturgent"
            }


            taskItemContainer.appendChild(editButton);
            taskItemContainer.appendChild(deleteButton);
            taskName.className = "opentask";
            openTasksContainer.appendChild(taskItemContainer);

        }
        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        })
        editButton.addEventListener("click", () => {
            updateTask(task.id, task.description, task.due_date)
        })
        taskItem.addEventListener("click", () => {
            updateTaskStatus(task.id, task.done, task.description, task.due_date)
        })

    });

    const nextToDo = tasks.filter(task => {
        return task.done == false;
    })
    console.log(nextToDo)
    nextTask.innerHTML = nextToDo[0].description;
    nextTaskDate.innerHTML = nextToDo[0].due_date;
    const tasksToRemove = tasks.filter(task => {
        return task.done == true;
    })
    console.log(tasksToRemove);

    deleteCompleted.addEventListener("click", () => {
        tasksToRemove.forEach(task => {
            deleteTask(task.id);
        })
    })
}

const reward = () => {
    console.log("compelted something")
    body.className = "completedtaskbody";
    setInterval(() => { body.className = "" }, 2000);
}


//To chamge existing item: Sent put request https://to-dolist-e1881.firebaseio.com/Apps/Tasklist/-MAgEjRYnc6gWClLjCmN.json