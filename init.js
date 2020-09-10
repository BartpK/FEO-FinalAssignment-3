const toDoItems = [
    { "description": "Update portfolio", "due_date": "2020-09-10", "done": false },
    { "description": "Take out trash", "due_date": "2020-09-12", "done": false },
    { "description": "Build to do app", "due_date": "2020-08-11", "done": true },
    { "description": "Buy Christmas presents", "due_date": "2020-12-11", "done": false },
    { "description": "Book flights", "due_date": "2020-11-05", "done": true },
    { "description": "Buy groceries", "due_date": "2020-09-18", "done": false }
];

const clearDatabase = async () => {

    const fetchRes = await fetch('https://to-dolist-e1881.firebaseio.com/Apps/Tasklist.json');
    const fetchData = await fetchRes.json();

    if (fetchData) {
        Object.keys(fetchData).forEach(async (key) => {
            try {
                const delResponse = await fetch(`https://to-dolist-e1881.firebaseio.com/Apps/Tasklist/${key}.json`, { method: 'DELETE' })

            } catch (error) {
            }
        })
    }
}

const populateDatabase = async () => {
    toDoItems.forEach(async (item) => {
        try {
            const popResponse = await fetch("https://to-dolist-e1881.firebaseio.com/Apps/Tasklist.json", {
                method: "POST",
                body: JSON.stringify(item),
            });
            updateList();
        } catch (error) {
        }
    })

}

