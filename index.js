//SELECTORS

const todoInput = document.querySelector(".add-todo-input");
const addTodoButton = document.querySelector(".add-todo-button");
const todoItemContainer = document.querySelector(".todo-container");
const todoContainerUnchecked = document.querySelector(".unchecked-container");
const todoContainerChecked = document.querySelector(".checked-container");
const completeButton = document.getElementsByClassName("complete-button");
const deleteButton = document.getElementsByClassName("delete-button");

//EVENT LISTENERS
document.addEventListener("DOMContentLoaded", getLocalTodo);

addTodoButton.addEventListener("click", addTodoWrapper);
todoItemContainer.addEventListener("click", deleteComplete);
todoItemContainer.addEventListener("mouseover", setBackground);
todoItemContainer.addEventListener("mouseout", removeBackground);

//FUNCTIONS

function removeBackground(e) {
  const buttonWrapper = e.target.parentElement;
  const targetParentElement = buttonWrapper.parentElement;
  const li = targetParentElement.querySelector("li");

  if (
    e.target.classList.contains("complete-button") ||
    e.target.classList.contains("delete-button")
  ) {
    targetParentElement.style.backgroundColor = "#0000";
  }

  e.target.style.animation = "none";
  if (e.target.classList.contains("delete-button")) {
    buttonWrapper.querySelector(".complete-button").style.animation = "none";
  } else {
    if (e.target.classList.contains("complete-button")) {
      buttonWrapper.querySelector(".delete-button").style.animation = "none";
    }
  }
}
function setBackground(e) {
  if (e.target.classList.contains("delete-button")) {
    setDeleteBackground(e);
  } else {
    if (e.target.classList.contains("complete-button")) {
      setCompleteBackground(e);
    }
  }
}

function setCompleteBackground(e) {
  const buttonWrapper = e.target.parentElement;
  const targetParentElement = buttonWrapper.parentElement;
  const targetElement = targetParentElement.querySelector("li");
  e.target.style.animation = "move 0.1s ease forwards";
  buttonWrapper.querySelector(".delete-button").style.animation =
    "hide 0.1s ease forwards";
  targetParentElement.style.backgroundColor = "green";
}

function setDeleteBackground(e) {
  const buttonWrapper = e.target.parentElement;
  const targetParentElement = buttonWrapper.parentElement;
  const targetElement = targetParentElement.querySelector("li");
  e.target.style.animation = "move 0.1s ease forwards";
  buttonWrapper.querySelector(".complete-button").style.animation =
    "hide 0.1s ease forwards";
  targetParentElement.style.backgroundColor = "red";
}
function addTodoWrapper(e) {
  e.preventDefault();
  if (todoInput.value !== "") {
    console.log(todoInput.value);
    let todoInputValue = {
      taskname: todoInput.value,
      checked: "unchecked",
    };
    saveToLocal(todoInputValue);
    addTodo(todoInputValue);
    todoInput.value = "";
  } else {
    alert("input value is empty");
  }
}

function addTodo(todoInputValue) {
  const todoDiv = document.createElement("div");
  todoDiv.setAttribute(
    "class",
    `todo-item-container ${todoInputValue.checked}`
  );

  const todoItem = document.createElement("li");
  todoItem.setAttribute("class", "todo-item");
  todoItem.innerText = todoInputValue.taskname;
  todoDiv.appendChild(todoItem);

  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("button-wrapper");

  const todoCompleteButton = document.createElement("button");
  todoCompleteButton.setAttribute("class", "complete-button");
  todoCompleteButton.innerHTML = "<i class='fas fa-check'></i>";
  buttonWrapper.appendChild(todoCompleteButton);

  const todoDeleteButton = document.createElement("button");
  todoDeleteButton.setAttribute("class", "delete-button");
  todoDeleteButton.innerHTML = "<i class='fas fa-trash-alt'></i>";
  buttonWrapper.appendChild(todoDeleteButton);

  todoDiv.appendChild(buttonWrapper);

  //   const todoTimer = document.createElement("div");
  //   todoTimer.classList.add("timer-wrapper");

  //   const todoTimerButton = document.createElement("button");
  //   todoTimerButton.classList.add("timer-button");
  //   todoTimerButton.innerHTML = "<i class='fas fa-clock'></i>";
  //   todoTimer.appendChild(todoTimerButton);

  //   const todoTimerText = document.createElement("p");
  //   todoTimerText.classList.add("timer-text");
  //   todoTimer.appendChild(todoTimerText);

  //   todoDiv.appendChild(todoTimer);

  if (todoInputValue.checked === "unchecked") {
    todoContainerUnchecked.appendChild(todoDiv);
    todoItemContainer.appendChild(todoContainerUnchecked);
  } else {
    todoContainerChecked.appendChild(todoDiv);
    todoItemContainer.appendChild(todoContainerChecked);
  }
}

function deleteComplete(e) {
  if (e.target.classList.contains("delete-button")) {
    const deletethis = e.target.parentElement.parentElement;
    const task = deletethis.querySelector(".todo-item").innerText;
    let todos = checkTodo();
    const index = todos.indexOf(task);
    todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    deletethis.remove();
  }
  if (e.target.classList.contains("complete-button")) {
    const checkthis = e.target.parentElement.parentElement;
    const task = checkthis.querySelector(".todo-item").innerText;
    let todos = checkTodo();
    todos.forEach((todo) => {
      if (todo.taskname === task) {
        if (checkthis.classList.contains("checked")) {
          checkthis.classList.remove("checked");
          checkthis.classList.add("unchecked");
          todo.checked = "unchecked";
          todoContainerUnchecked.appendChild(checkthis);
          return todo;
        } else {
          checkthis.classList.remove("unchecked");
          checkthis.classList.add("checked");
          todo.checked = "checked";
          todoContainerChecked.appendChild(checkthis);
          return todo;
        }
      }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
  }
  //   if (e.target.classList.contains("timer-button")) {
  //     const targetParentElement = e.target.parentElement;
  //     const minutes = 10;
  //     let time = 60 * minutes;

  //     function startCountDown(e) {
  //       let minutesLeft = Math.floor(time / 60);
  //       let secondsLeft = time % 60;
  //       secondsLeft = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;
  //       minutesLeft = minutesLeft !== 10 ? `0${minutesLeft}` : minutesLeft;

  //       time--;
  //       targetParentElement.querySelector(
  //         ".timer-text"
  //       ).innerText = `${minutesLeft}:${secondsLeft}`;
  //     }
  //     setInterval(startCountDown, 1000);
  //   }
}
function saveToLocal(todoInputValue) {
  let todos = checkTodo();
  let todo = {
    taskname: todoInputValue.taskname,
    checked: todoInputValue.checked,
  };
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodo() {
  let todos = checkTodo();
  todos.forEach((todo) => addTodo(todo));
}

function checkTodo() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}
