const body = document.querySelector("body");
const today = new Date();
const openTasksContainer = document.querySelector("#opentaskscontainer");
const completedTasksContainer = document.querySelector(
  "#completedtaskscontainer"
);
const taskInput = document.querySelector("#textInput");
const dateInput = document.querySelector("#dateinput");
const nextTask = document.querySelector(".nextitem");
const removeCompleted = document.querySelector("#removecompletedbutton");
const nextItemContainer = document.querySelector(".nextitemcontainer");
const nextItemDiv = document.querySelector(".nextitemdiv");

//Checks for input in text and date fields. Sends post request with user input. Starts getData function to retrieve updated data.
document.querySelector("#addTask").addEventListener("click", async () => {
  if (dateInput.value == "" || taskInput.value == "") {
    alert("Please enter a task and a due date");
  } else {
    await fetch("https://to-dolist-e1881.firebaseio.com/Apps/Tasklist.json", {
      method: "POST",
      body: `{ "description": "${taskInput.value}", "done": false, "due_date": "${dateInput.value}" }`,
    });
    taskInput.value = "";
  }
  getData();
});

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

//Function to display to-do list items based on data from getData function (in api-client.js)
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
      deleteTask(task.id);
    });
    editButton.addEventListener("click", () => {
      updateTask(task.id, task.description, task.due_date);
    });
    taskItem.addEventListener("click", () => {
      updateTaskStatus(task.id, task.done, task.description, task.due_date);
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
  const tasksToRemove = tasks.filter((task) => {
    return task.done == true;
  });

  //Calls the delete task function for each item in the array of completed items.
  removeCompleted.addEventListener("click", () => {
    tasksToRemove.forEach((task) => {
      deleteTask(task.id);
    });
  });
};

//Calls getData function to populate the list when the page loads
getData();
