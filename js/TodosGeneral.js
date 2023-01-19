const select = (...args) => document.querySelector(...args);
const createdElement = (...args) => document.createElement(...args);


const todos = [];

const container = select('#todos-container');
const newTodoInput = select('#new-todo');
newTodoInput.onkeydown = e => {
    if (e.key === 'Enter') {
        const todo = {completed: false, text: newTodoInput.value};
        if (e.key === 'Enter' && !newTodoInput.value) {
            alert("you dont have any text !");
            return;
        }
        todos.push(todo);
        reRenderTodoListItems();
        newTodoInput.value = '';
    }
}
renderTodoListItems();

function reRenderTodoListItems() {
    container.innerHTML = '';
    renderTodoListItems();
}

function renderTodoListItems() {
    todos.forEach(todo => {
        const itemContainer = createdElement('li');
        const itemText = createdElement('div');
        itemText.style.cursor = 'pointer';
        itemText.innerHTML = todo.text;
        itemText.onclick = () => {
            todo.completed = !todo.completed;
            reRenderTodoListItems();
        }
        if (todo.completed) {
            itemText.style['text-decoration'] = 'line-through';
        }
        const itemDelete = createdElement('button');
        itemDelete.innerHTML = 'x';
        itemDelete.onclick = () => {
            const currentTodoIndex = todos.findIndex(t => t === todo);
            todos.splice(currentTodoIndex, 1);
            reRenderTodoListItems();
        }
        itemContainer.appendChild(itemText);
        itemContainer.appendChild(itemDelete);


        container.appendChild(itemContainer);

    });

}

const filterSelect = document.getElementById("filter-todos");

filterSelect.addEventListener("change", function (e) {

    if (e.target.localName === 'select') {
        let selectedFilter = filterSelect.value;

        if (selectedFilter === 'all') {
            reRenderTodoListItems();
        } else if (selectedFilter === 'uncompleted') {
            let activeToDos = todos.filter(todo => todo.completed === false);
            container.innerHTML = '';
            activeToDos.forEach(todo => {
                const todoEl = document.createElement('div');
                todoEl.textContent = todo.text;
                container.appendChild(todoEl);
            });

        } else if (selectedFilter === "completed") {
            let completedToDos = todos.filter(todo => todo.completed === true);
            container.innerHTML = '';
            completedToDos.forEach(todo => {
                const todoEl = document.createElement("div");
                todoEl.textContent = todo.text;
                container.appendChild(todoEl);
            });
        }
    }
});












