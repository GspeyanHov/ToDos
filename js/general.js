let todos = {items: [], filter: 'all'};

const container = select('#todos-container');
const newTodoInput = select('#new-todo');
const filterSelect = select("#filter-todos");
const todoDescription = select("#todo-description");
const searchTodoById = select("#search");

filterSelect.addEventListener("change", function () {
    let selectedFilter = filterSelect.value;
    const filterBy = {
        all: () => reRenderTodoListItems(todos),
        completed: () => reRenderTodoListItems(todos.filter(todo => todo.completed)),
        uncompleted: () => reRenderTodoListItems(todos.filter(todo => !todo.completed)),
    };
    filterBy[selectedFilter]?.();
    reRenderTodoListItems(todos.items.filter(todos));


});

newTodoInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const title = newTodoInput.value || prompt("Please type the title of the task!");
        const description = todoDescription.value || prompt("Please type the description of the task!")

        if (!title) return;

        fetch('http://localhost:3000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                completed: false
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(todo => {
                console.log(todo);
                todos.push(todo);
                if (filterSelect.value === "completed" || filterSelect.value === "uncompleted" || filterSelect.value === "") {
                    filterSelect.value = "all";
                }
                reRenderTodoListItems(todos);
            })
            .catch(error => {
                console.error(error);
            });
    }
});
document.addEventListener('DOMContentLoaded', async function () {
    todos = await getTodos();
    reRenderTodoListItems(todos);
});

async function getTodos() {
    const response = await fetch('http://localhost:3000/');
    return await response.json();
}

function reRenderTodoListItems(todos) {
    container.innerHTML = '';
    renderTodoListItems(todos.filter(todo => !todo.deleted));
}

searchTodoById.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const todoId = e.target.value.trim();
        if (todoId !== '') {
            fetch(`http://localhost:3000/` + todoId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(todo => {
                    console.log(todo);
                    if (filterSelect.value === "completed" || filterSelect.value === "uncompleted" || filterSelect.value === 'all') {
                        filterSelect.value = '';
                    }
                    reRenderTodoListItems([todo]);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }
});

function renderTodoListItems(todoList = todos) {
    todoList = todoList.filter(todo => !todo.deleted);
    todoList.forEach(todo => {
        const itemContainer = createElement('li');

        /* Task title */
        const id = createElement('div');
        const title = createElement('div');
        const description = createElement('div');
        const completed = createElement('div');
        const createdAt = createElement('div');
        const updatedAt = createElement('div');

        title.style.cursor = 'pointer';
        id.innerHTML = todo.id;
        title.innerHTML = todo.title;
        description.innerHTML = todo.description;
        completed.innerHTML = todo.completed;
        createdAt.innerHTML = todo.createdAt;
        updatedAt.innerHTML = todo.updatedAt;

        title.onclick = () => {
            todo.completed = !todo.completed;
            fetch('http://localhost:3000/todos/' + todo.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: todo.title,
                    description: todo.description,
                    completed: todo.completed
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(updatedTodo => {
                    console.log(updatedTodo);

                })
                .catch(error => {
                    console.error(error);
                });
            reRenderTodoListItems(todoList);
        }
        if (todo.completed) {
            title.style['text-decoration'] = 'line-through';
        }
        itemContainer.appendChild(id);
        itemContainer.appendChild(title);
        itemContainer.appendChild(description);
        itemContainer.appendChild(completed);
        itemContainer.appendChild(createdAt);
        itemContainer.appendChild(updatedAt);


        /* Delete button */
        const itemDelete = createElement('button');
        itemDelete.innerHTML = 'x';
        itemDelete.onclick = () => {
            const currentTodoIndex = todoList.findIndex(t => t === todo);
            todoList.splice(currentTodoIndex, 1);
            todo.deleted = true;
            fetch('http://localhost:3000/todos/' + todo.id, {
                method: 'Delete',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: todo.title,
                    description: todo.description,
                    completed: todo.completed
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(updatedTodo => {
                    console.log(updatedTodo);

                })
                .catch(error => {
                    console.error(error);
                });

            reRenderTodoListItems(todoList);
        }
        itemContainer.appendChild(itemDelete);


        container.appendChild(itemContainer);
    });
}

function select() {
    return document.querySelector(...arguments)
}

function createElement() {
    return document.createElement(...arguments)
}