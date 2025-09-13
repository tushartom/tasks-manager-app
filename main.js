const addTaskBtn = document.querySelector(".add-task-btn");
const tasksListEle = document.querySelector(".tasks-list");

//in localstorage object tasks are stored in this format
// {taskContent: "about task", completed: true/false}

if (!localStorage.getItem("tasksArray")) {
  localStorage.setItem("tasksArray", JSON.stringify([]));
}

document.addEventListener("DOMContentLoaded", renderTasksOnPageLoad);
addTaskBtn.addEventListener("click", handleAddTask);

function renderTasksOnPageLoad() {
  let tasksArray = JSON.parse(localStorage.getItem("tasksArray"));

  if (tasksArray.length == 0) return;

  tasksArray.forEach((task) => {
    let taskEle = createTaskEle(task.description);

    if (task.completed) {
      taskEle.classList.add("task-status-done");
      let taskStatusBtn = taskEle.querySelector(".task-status-btn");
      taskStatusBtn.textContent = "Undo";
    }
    tasksListEle.append(taskEle);
  });
}

function handleAddTask() {
  let taskTitle = getTask();
  if (taskTitle === "") {
    alert("Please enter task title");
    return;
  } else if (taskTitle === null) return;

  addTask(taskTitle);
}

function getTask() {
  let taskTitle = prompt("Enter Task ⚒️");
  return taskTitle;
}

function addTask(taskTitle) {
  let tasksArray = JSON.parse(localStorage.getItem("tasksArray"));
  let task = { description: taskTitle, completed: false };
  tasksArray.push(task);
  localStorage.setItem("tasksArray", JSON.stringify(tasksArray));

  let taskEle = createTaskEle(taskTitle);
  tasksListEle.append(taskEle);

  document.querySelector(".no-tasks").style.display = "none";
}
function createTaskEle(taskTitle) {
  let taskEle = document.createElement("li");
  taskEle.classList.add("task-item");

  let taskHtml = `<p class="task-description">${taskTitle}</p>
    <div class="btns-container"><button class="task-status-btn">Done</button>
  <button class="task-delete-btn"><i class="material-icons">delete</i></button></div>
  `;

  taskEle.innerHTML = taskHtml;
  return taskEle;
}

tasksListEle.addEventListener("click", function (event) {
  let target = event.target.closest("button");
  if (
    !(
      target.classList.contains("task-status-btn") ||
      target.classList.contains("task-delete-btn")
    )
  )
    return;
  else if (target.classList.contains("task-status-btn")) {
    let taskEle = target.closest(".task-item");

    toggleTaskStatus(taskEle, target);
  } else if (target.classList.contains("task-delete-btn")) {
    deleteTask(target.closest(".task-item"));
  }
});

function toggleTaskStatus(taskEle, taskStatusBtn) {
  taskEle.classList.toggle("task-status-done");

  if (taskEle.classList.contains("task-status-done")) {
    let isComplete = true;
    setTaskStatus(isComplete, taskEle);
    taskStatusBtn.textContent = "Undo";
  } else {
    let isComplete = false;
    setTaskStatus(isComplete, taskEle);
    taskStatusBtn.textContent = "Done";
  }
}

function setTaskStatus(taskStatus, taskEle) {
  let tasksArray = JSON.parse(localStorage.getItem("tasksArray"));
  let taskDescription = taskEle.querySelector(".task-description");
  tasksArray.forEach((task) => {
    if (task.description === taskDescription.textContent)
      task.completed = taskStatus;
  });
  localStorage.setItem("tasksArray", JSON.stringify(tasksArray));
}

function deleteTask(taskEle) {
  let tasksArray = JSON.parse(localStorage.getItem("tasksArray"));
  let taskDescription = taskEle.querySelector(".task-description");
  let taskEleIndex = tasksArray.findIndex(
    (obj) =>
      obj.description === taskDescription.textContent &&
      obj.completed === taskEle.classList.contains("task-status-done")
  );
  tasksArray.splice(taskEleIndex, 1);
  localStorage.setItem("tasksArray", JSON.stringify(tasksArray));

  if (!JSON.parse(localStorage.getItem("tasksArray")).length > 0) {
    document.querySelector(".no-tasks").style.display = "block";
  }
  taskEle.remove();
}
