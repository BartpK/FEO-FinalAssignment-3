//GET data from database. Added due_date as object key
const getData = async () => {
    const response = await fetch('https://to-dolist-e1881.firebaseio.com/Apps/Tasklist.json');
    const data = await response.json();
    let tasks = Object.keys(data).map(key => ({
        id: key,
        description: data[key].description,
        done: data[key].done,
        due_date: data[key].due_date
    }));
    tasks.sort((a, b) => (a.due_date > b.due_date) ? 1 : -1)
    //Calls buildList function with tasks array as argument.
    buildList(tasks);
}

//Function to update task name via prompt, and pushes to database with PUT request
const updateTask = async (id, taskDescription, duedate) => {
    const taskPrompt = prompt("Please change your task description", taskDescription);
    const newTaskObject = `{ "description": "${taskPrompt}", "done": false, "due_date": "${duedate}" }`
    await fetch(`https://to-dolist-e1881.firebaseio.com/Apps/Tasklist/${id}.json`, { method: 'PUT', body: newTaskObject })
    getData();
}

//Function to update task status via PUT request based on user clicking checkbox
const updateTaskStatus = async (id, taskStatus, taskDescription, duedate) => {
    if (taskStatus === true) {
        const newStatusObject = `{ "description": "${taskDescription}", "done": false, "due_date":"${duedate}" }`
        await fetch(`https://to-dolist-e1881.firebaseio.com/Apps/Tasklist/${id}.json`, { method: 'PUT', body: newStatusObject })
        getData();
    } else {
        reward();
        const newStatusObject = `{ "description": "${taskDescription}", "done": true, "due_date":"${duedate}" }`
        await fetch(`https://to-dolist-e1881.firebaseio.com/Apps/Tasklist/${id}.json`, { method: 'PUT', body: newStatusObject })
        getData();
    }
};

//Function to delete task with DELETE request
const deleteTask = async (id) => {
    await fetch(`https://to-dolist-e1881.firebaseio.com/Apps/Tasklist/${id}.json`, { method: 'DELETE' })
    getData();
}
