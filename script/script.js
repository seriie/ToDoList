const inputBox = document.getElementById("inputBox");
const push = document.getElementById("push");
const level = document.querySelector(".headerText.Level");
const point = document.querySelector(".headerText.Point");

inputBox.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    push.click();
  }

  if(inputBox.value != 0) {
    push.classList.add('active');
  } else {
    push.classList.remove('active');
  }
});

push.addEventListener("click", function() {
  const userInput = inputBox.value.trim();
  if (userInput !== "") {
    addTask(userInput, false);
    inputBox.value = "";
  } else {
    myAlerts("Add List please!");
  }
});

function addTask(task, completed) {
  const tasksList = document.querySelector(".tasks");
  const li = document.createElement("li");
  li.className = "task";
  li.title = "Edit Text";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.style.width = "20px";
  checkbox.style.height = "20px";
  checkbox.style.border = "1px solid #ccc";
  checkbox.style.position = "";
  checkbox.style.float = "left";
  checkbox.style.cursor = "pointer";
  checkbox.checked = completed;

  if (completed) {
    li.style.textDecoration = "line-through";
    li.style.color = "gray";
  }
  checkbox.addEventListener('click', function() {
    var checkboxes = document.querySelectorAll("input[type='checkbox']");
    var checkArr = [];

    checkboxes.forEach(function(checkbox) {
      checkArr.push(checkbox.checked);
    });

    var checkedCount = checkArr.filter(function(checked) {
      return checked;
    }).length;

    var poin = checkedCount * 5;
    updatePointsAndLevel(poin);
    
    if (checkbox.checked) {
      li.style.textDecoration = "line-through";
      li.style.color = "gray";
      textSpan.removeEventListener("click", handleEditClick);
    } else {
      li.style.textDecoration = "none";
      li.style.color = "black";
      textSpan.addEventListener("click", handleEditClick);
    }
    updateAndSaveTasks();
  });

  const textSpan = document.createElement("span");
  textSpan.textContent = task;

  const handleEditClick = function() {
    editTask(textSpan);
  };

  if (!completed) {
    textSpan.addEventListener("click", handleEditClick);
  }

  const deleteButton = document.createElement("li");
  deleteButton.className = "bx bxs-trash";
  // deleteButton.innerHTML = '<i class="bx bxs-trash"></i>';
  deleteButton.addEventListener("click", function() {
    deleteTask(deleteButton, checkbox.checked);
  });

  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(deleteButton);

  tasksList.appendChild(li);

  updatePendingTasks();
  updateAndSaveTasks();
}

function editTask(textSpan) {
  const previousText = textSpan.textContent;
  const inputField = document.createElement("input");
  inputField.classList = "inputField";
  inputField.type = "text";
  inputField.value = previousText;
  textSpan.replaceWith(inputField);

  // Temukan elemen li yang berisi inputField
  const parentLi = inputField.closest(".task");
  // Dapatkan elemen checkbox di dalam parentLi
  const checkbox = parentLi.querySelector("input[type='checkbox']");
  // Nonaktifkan checkbox
  checkbox.disabled = true;

  inputField.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      const newText = inputField.value.trim();
      if (newText !== "") {
        inputField.replaceWith(textSpan);
        textSpan.textContent = newText;
        // Aktifkan kembali checkbox setelah selesai mengedit
        checkbox.disabled = false;
        updateAndSaveTasks();
      } else {
        inputField.placeholder = "Cannot be empty!";
      }
    }
  });

  inputField.addEventListener("blur", function() {
    const newText = inputField.value.trim();
    if (newText !== "") {
      inputField.replaceWith(textSpan);
      textSpan.textContent = newText;
      // Aktifkan kembali checkbox setelah selesai mengedit
      checkbox.disabled = false;
      updateAndSaveTasks();
    }
  });
}


function deleteTask(element, wasChecked) {
  element.parentElement.remove();
  
  if (wasChecked) {
    const currentPoints = parseInt(localStorage.getItem("points")) || 0;
    // const newPoints = currentPoints - 5;
    updatePointsAndLevel(currentPoints);
  }

  updatePendingTasks();
  updateAndSaveTasks();
}

function updatePendingTasks() {
  const tasksCount = document.querySelector(".tasksCount");
  const tasks = document.querySelectorAll(".task");
  tasksCount.textContent = tasks.length;
}

function deleteAllTasks() {
  const tasksList = document.querySelector(".tasks");
  const tasksCount = tasksList.querySelectorAll(".task").length;

  if(tasksCount == 0) {
    myAlerts("No tasks!");
    return;
  }

  const confirms = document.querySelector(".confirm");
  
  confirms.classList.add('active');
  
  const confirmMsg = document.querySelector(".confirm-msg");
  confirmMsg.innerHTML = "Are You Sure!?";
  
  const yes = document.getElementById("yes");
  const no = document.getElementById("no");
  
  yes.onclick = () => {
    const point = document.querySelector(".headerText.Point");
    const level = document.querySelector(".headerText.Level");

    tasksList.innerHTML = "";
    updatePendingTasks();
    updateAndSaveTasks();
    confirms.classList.remove('active');
    point.textContent = "Point : 0"
    level.textContent = "Level : 0";
    };
    
    no.onclick = () => {
    confirms.classList.remove('active');
  };
}

function updateAndSaveTasks() {
  updatePendingTasks();
  const username = localStorage.getItem("username");
  if (username) {
      saveTasksForUser(username);
      savePointsForUser(username, parseInt(point.textContent.split(": ")[1]));
      saveLevelForUser(username, parseInt(level.textContent.split(": ")[1])); // Mengubah ke integer
  } else {
      saveTasksToLocalStorage();
      savePointsToLocalStorage();
      saveLevelToLocalStorage();
  }
}


function updatePointsAndLevel(poin) {
  console.log("Poin sekarang:", poin);
  point.textContent = "Point : " + poin;
  const username = localStorage.getItem("username");
  if (username) {
      savePointsForUser(username, poin);
  } else {
      localStorage.setItem("points", poin);
  }

  let currentLevel = loadLevelForUser(username); // Load level yang tersimpan
  let newLevel = Math.floor(poin / 25); // Menghitung level baru berdasarkan poin (25 poin per level)
  console.log("Level sekarang:", newLevel);

  if (newLevel !== currentLevel) { // Perbarui level jika level berubah
      level.textContent = "Level : " + newLevel;
      const username = localStorage.getItem("username");
      if (username) {
          saveLevelForUser(username, newLevel);
      } else {
          localStorage.setItem("level", newLevel);
      }
  }
}

function toggleTheme() {
  const body = document.body;
  check = body.classList.toggle('dark-mode');

  if(check) {
    localStorage.setItem("theme", "dark-mode");
  } else {
     localStorage.setItem("theme", "light-mode");
  }
}

if(localStorage.theme == 'dark-mode' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.body.classList.add('dark-mode');
} else {
  document.body.classList.add('light-mode');
}

function refresh() {
  location.reload();
}

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  var scrollToTopBtn = document.getElementById("scrollToTopBtn");
  var scrollToTopContainer = document.getElementById("scrollToTopContainer");
  
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      scrollToTopContainer.style.display = "block";
  } else {
      scrollToTopContainer.style.display = "none";
  }
}

function scrollToTop() {
  var scrollStep = -window.scrollY / (200 / 5);
  
  function animateScroll() {
      window.scrollBy(0, scrollStep);

      if (window.scrollY <= 0) {
          scrollToTopContainer.style.display = "none";
          window.onscroll = function () {
              scrollFunction();
          };
          return;
      }
      
      requestAnimationFrame(animateScroll);
  }

  animateScroll();
}