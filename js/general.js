/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects
 */
const todos = [];

const container = select('#todos-container');
const newTodoInput = select('#new-todo');
const filterSelect = select("#filter-todos");

newTodoInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const text = newTodoInput.value || prompt("Please type the title of the task!");

        if(!text) return;

        todos.push({text, completed: false});

        newTodoInput.value = '';

        reRenderTodoListItems();
    }
});

filterSelect.addEventListener("change", function (e) {
    let selectedFilter = filterSelect.value;

    const filterBy = {
        all: reRenderTodoListItems,
        completed: () => reRenderTodoListItems(todos.filter(todo => todo.completed)),
        uncompleted: () => reRenderTodoListItems(todos.filter(todo => !todo.completed)),
    };

    filterBy[selectedFilter]?.();
});

function reRenderTodoListItems(todos) {
    container.innerHTML = '';
    renderTodoListItems(todos);
}

function renderTodoListItems(todoList = todos) {
    todoList.forEach(todo => {
        const itemContainer = createElement('li');

        /* Task title */
        const itemText = createElement('div');
        itemText.style.cursor = 'pointer';
        itemText.innerHTML = todo.text;
        itemText.onclick = () => {
            todo.completed = !todo.completed;
            reRenderTodoListItems(todoList);
        }
        if (todo.completed) {
            itemText.style['text-decoration'] = 'line-through';
        }
        itemContainer.appendChild(itemText);


        /* Delete button */
        const itemDelete = createElement('button');
        itemDelete.innerHTML = 'x';
        itemDelete.onclick = () => {
            const currentTodoIndex = todoList.findIndex(t => t === todo);
            todoList.splice(currentTodoIndex, 1);
            reRenderTodoListItems(todoList);
        }
        itemContainer.appendChild(itemDelete);


        container.appendChild(itemContainer);
    });
}

function select(){
    return document.querySelector(...arguments)
}

function createElement(){
    return document.createElement(...arguments)
}
