const today = new Date();
const openTasksContainer = document.querySelector("#opentaskscontainer");
const completedTasksContainer = document.querySelector(
  "#completedtaskscontainer"
);
const taskInput = document.querySelector("#textInput");
const dateInput = document.querySelector("#dateinput");
const nextTask = document.querySelector(".nextitem");
const removeCompletedButton = document.querySelector("#removecompletedbutton");
const nextItemContainer = document.querySelector(".nextitemcontainer");
const nextItemDiv = document.querySelector(".nextitemdiv");

//function to update to-do list after each addition, remove, update
const updateList = async () => {
  const data = await getData();
  if (data !== null) {
    let tasks = Object.keys(data).map(key => ({
      id: key,
      description: data[key].description,
      done: data[key].done,
      due_date: data[key].due_date
    }));
    tasks.sort((a, b) => (a.due_date > b.due_date) ? 1 : -1)
    buildList(tasks);
  } else {
    tasks = [{ description: "Your list is empty. Nice job!", done: false, due_date: "2020-01-01" }];

    buildList(tasks);
  }
}

//Function to rewrite standard date format YYYY-MM-DD to DD/MM/YYYY
const reverseDate = (inputString) => {
  const oldDate = Array.from(inputString);
  return (
    oldDate[8] +
    oldDate[9] +
    "/" +
    oldDate[5] +
    oldDate[6] +
    "/" +
    oldDate[0] +
    oldDate[1] +
    oldDate[2] +
    oldDate[3]
  );
};

//Function to display to-do list items
const buildList = (tasks) => {
  openTasksContainer.innerHTML = "";
  completedTasksContainer.innerHTML = "";
  tasks.forEach((task) => {
    const taskItemContainer = document.createElement("div");
    const taskItem = document.createElement("input");
    const taskName = document.createElement("label");
    const dueDate = document.createElement("p");
    const editButton = document.createElement("img");
    const deleteButton = document.createElement("img");

    taskItemContainer.className = "taskitemcontainer";

    taskItem.type = "checkbox";
    taskItem.name = task.id;
    taskItem.className = "checkbox";

    taskName.for = task.id;
    taskName.innerHTML = task.description;

    dueDate.className = "duedate";
    dueDate.innerHTML = reverseDate(task.due_date);

    deleteButton.src = "delete.svg";
    deleteButton.className = "deletebutton";

    editButton.className = "editbutton";
    editButton.src = "edit.svg";

    taskItemContainer.appendChild(taskItem);
    taskItemContainer.appendChild(taskName);
    taskItemContainer.appendChild(dueDate);
    taskItemContainer.appendChild(deleteButton);
    //If item is done, append to completedTasksContainer and set class to 'completedtask' for styling
    if (task.done === true) {
      taskItem.checked = true;
      taskName.className = "completedtask";
      completedTasksContainer.appendChild(taskItemContainer);
    } else {
      //if task status === not done, if statement checks how far in the future a task deadline is. < 2 days = urgent(purple), < 1 week = moderate(blue), > 1 week = noturgent(green)
      if (
        new Date(`${task.due_date}`).getTime() / 1000 - today.getTime() / 1000 <
        172800
      ) {
        taskItemContainer.classList += " urgent";
      } else if (
        new Date(`${task.due_date}`).getTime() / 1000 - today.getTime() / 1000 <
        604800
      ) {
        taskItemContainer.classList += " moderate";
      } else {
        taskItemContainer.classList += " noturgent";
      }

      taskItemContainer.appendChild(editButton);
      taskName.className = "opentask";
      openTasksContainer.appendChild(taskItemContainer);
    }
    //add event listeners for delete and edit buttons, and checkbox
    deleteButton.addEventListener("click", () => {
      deleteTask(task);
    });
    editButton.addEventListener("click", () => {
      updateTask(task);
    });
    taskItem.addEventListener("click", () => {
      updateTaskStatus(task);
    });
  });

  //creates array of only open tasks
  const nextToDo = tasks.filter((task) => {
    return task.done == false;
  });

  //Displays current most urgent task in right side of page
  if (
    document.querySelector(".nexttask").innerHTML === nextToDo[0].description
  ) {
    //do nothing
  } else {
    nextItemContainer.innerHTML = "";
    const nextItemDiv = document.createElement("div");
    nextItemDiv.className = "nextitemdiv";

    const nexttaskheader = document.createElement("p");
    nexttaskheader.className = "nexttaskheader";
    nexttaskheader.innerHTML = "Next task:";
    nextItemDiv.appendChild(nexttaskheader);

    const nextTask = document.createElement("h1");
    nextTask.className = "nexttask";
    nextTask.innerHTML = nextToDo[0].description;
    nextItemDiv.appendChild(nextTask);

    const nextTaskDate = document.createElement("p");
    nextTaskDate.className = "nexttaskdate";
    nextTaskDate.innerHTML = reverseDate(nextToDo[0].due_date);
    nextItemDiv.appendChild(nextTaskDate);

    nextItemContainer.appendChild(nextItemDiv);
  }



  //Creates array of completed tasks
  let completedTasks = tasks.filter((task) => {
    return task.done == true;
  })

  removeCompletedButton.addEventListener("click", () => {
    removeCompleted(completedTasks)
  });
}
//function to add new to-do item
document.querySelector("#addTask").addEventListener("click", async () => {
  if (dateInput.value == "" || taskInput.value == "") {
    alert("Please enter a task and a due date");
  } else {
    const taskObject = `{ "description": "${taskInput.value}", "done": false, "due_date": "${dateInput.value}" }`;
    taskInput.value = "";
    await postTask(taskObject);
    updateList();
  }
})

//function to remove all completed list items
const removeCompleted = (completedItems) => {
  completedItems.forEach(item => {
    deleteTask(item)
  })
}
//Function to update task description
const updateTask = async (task) => {
  const taskPrompt = prompt("Please change your task description", task.description);
  if (taskPrompt) {
    const updatedTaskObject = `{ "description": "${taskPrompt}", "done": false, "due_date": "${task.due_date}" }`
    await postUpdatedTask(updatedTaskObject, task.id);
    updateList()
  };
}
//Function to update task status
const updateTaskStatus = async (task) => {
  const updatedTaskObject = `{ "description": "${task.description}", "done": ${!task.done}, "due_date": "${task.due_date}" }`
  await postUpdatedTask(updatedTaskObject, task.id);
  updateList();
}
//Function to delete task
const deleteTask = async (task) => {
  await deleteFromDatabase(task.id);
  updateList();
}

//initializes the app. Calls resetDatabase to clear database and update with standard listitems.

(async () => {
  await clearDatabase();
  await populateDatabase();
})()

