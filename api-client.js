//GET data from database
const getData = async () => {
    try {
        const response = await fetch('https://wincacademydatabase.firebaseio.com/bart/tasks.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error)
    }
}

//function to add task to database
const postTask = async (taskObject) => {
    try {
        await fetch("https://wincacademydatabase.firebaseio.com/bart/tasks.json", {
            method: "POST",
            body: taskObject,
        });
    } catch (error) {
        console.log(error);
    }
}

//Function to update description or status
const postUpdatedTask = async (updatedTaskObject, id) => {
    try {
        await fetch(`https://wincacademydatabase.firebaseio.com/bart/tasks/${id}.json`, { method: 'PUT', body: updatedTaskObject })
    } catch (error) {
        console.log(error)
    }
}

//Function to delete task with DELETE request
const deleteFromDatabase = async (id) => {
    try {
        await fetch(`https://wincacademydatabase.firebaseio.com/bart/tasks/${id}.json`, { method: 'DELETE' })
    } catch (error) {
        console.log(error)
    }
}
