document.querySelector('.registerButton').addEventListener('click', register);
document.querySelector('.loginButton').addEventListener('click', login);
document.querySelector('.haveAccount').addEventListener('click', switchToLogin);
document.querySelector('.dontHaveAccount').addEventListener('click', switchToRegister);
document.querySelector('.continueWithoutLogin').addEventListener('click', guessLogin);

const loginArea = document.querySelector(".centerLogin");
const alert = document.querySelector(".alert");
const yourToDo = document.querySelector('.toDoList');

function resetStorage() {
    localStorage.clear();
    myAlerts('Local storage has been reset!');
}

document.addEventListener('keydown', function(event) {
    return event.altKey && event.code === 'KeyR' ? resetStorage() : null;
})

function switchToLogin() {
    document.querySelector('.centerRegister').style.display = 'none';
    document.querySelector('.centerLogin').style.display = 'block';
    document.querySelector('.inputTextLogin').value = "";
    document.querySelector('.inputPasswordLogin').value = "";
}

function switchToRegister() {
    document.querySelector('.centerLogin').style.display = 'none';
    document.querySelector('.centerRegister').style.display = 'block';
    document.querySelector('.inputTextRegister').value = "";
    document.querySelector('.inputPasswordRegister').value = "";
}

function clearTasks() {
    const taskElements = document.querySelectorAll('.task');
    taskElements.forEach(task => task.remove());
}

function loadTasksForUser(username) {
    clearTasks();
    const tasksData = JSON.parse(localStorage.getItem(username + "_tasks"));
    if (tasksData) {
        tasksData.forEach(task => {
            addTask(task.text, task.completed);
        });
    }
}

function saveTasksForUser(username) {
    const tasks = document.querySelectorAll(".task");
    const tasksData = [];
    
    tasks.forEach(task => {
        const taskText = task.querySelector("span").textContent.trim();
        const taskCompleted = task.querySelector("input[type='checkbox']").checked;
        tasksData.push({ text: taskText, completed: taskCompleted });
    });
    localStorage.setItem(username + "_tasks", JSON.stringify(tasksData));
}

function loadPointsForUser(username) {
    const tasksData = JSON.parse(localStorage.getItem(username + "_tasks"));
    if (tasksData) {
        const completedTasks = tasksData.filter(task => task.completed);
        const completedCount = completedTasks.length;
        const totalPoints = completedCount * 5;
        point.textContent = "Point : " + totalPoints;
    } else {
        point.textContent = "Point : 0";
    }
}

function savePointsForUser(username, points) {
    localStorage.setItem(username + "_points", points);
}

function loadLevelForUser(username) {
    const savedLevel = localStorage.getItem(username + "_level");
    let currentLevel = 0;
    if (savedLevel && !isNaN(savedLevel)) {
        currentLevel = parseInt(savedLevel);
        level.textContent = "Level : " + savedLevel;
    } else {
        level.textContent = "Level : 0";
    }
    return currentLevel;
}

function saveLevelForUser(username, level) {
    localStorage.setItem(username + "_level", level);
}

function register() {
    const username = document.querySelector('.inputTextRegister').value.toLowerCase();
    const password = document.querySelector('.inputPasswordRegister').value;
    const textRegister = document.querySelector('.inputTextRegister');
    const passwordRegister = document.querySelector('.inputPasswordRegister');

    if (username === "" && password === "") {
        textRegister.classList.add('error');
        passwordRegister.classList.add('error');
        setTimeout(() => {
            textRegister.classList.remove('error');
            passwordRegister.classList.remove('error');
        }, 2000);
        myAlerts('Please fill in all fields!');
        return;
    } else if(username === "") {
        textRegister.classList.add('error');
        setTimeout(() => {
            textRegister.classList.remove('error');
        }, 2000);
        myAlerts('Please enter a username!');
        return;
    } else if(password === "") {
        passwordRegister.classList.add('error');
        setTimeout(() => {
            passwordRegister.classList.remove('error');
        }, 2000);
        myAlerts('Please enter a password!');
        return;
    }

    if (localStorage.getItem(username)) {
        myAlerts('Username already exists!');
        return;
    }

    localStorage.setItem(username, password);

    textRegister.classList.remove('error');
    passwordRegister.classList.remove('error');

    const alert = document.querySelector('.alert');
    alert.style.backgroundColor = "#baffba";
    alert.style.color = "green";
    myAlerts('Registration successful!');

    setTimeout(() => {
        alert.style.backgroundColor = "#f8d7da";
        alert.style.color = "#842029";
    }, 2000);

    clearTasks();

    // saveTasksForUser(username);
    savePointsForUser(username, 0);
    saveLevelForUser(username, 0);

    switchToLogin();
}

function login() {
    const username = document.querySelector('.inputTextLogin').value.toLowerCase();
    const password = document.querySelector('.inputPasswordLogin').value;

    const storedPassword = localStorage.getItem(username);

    if (storedPassword && storedPassword === password) {
        loginArea.style.display = "none";
        alert.style.backgroundColor = "#baffba";
        alert.style.color = "green";
        myAlerts('Login successful! Welcome, ' + username);
        window.scrollTo(0,0)
        setTimeout(() => {
            alert.style.backgroundColor = "#f8d7da";
            alert.style.color = "#842029";
        }, 2000);
        yourToDo.textContent = username + "'s To-Do List";

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", username);

        // Load tasks, points, dan level untuk user
        loadTasksForUser(username);
        loadPointsForUser(username);
        loadLevelForUser(username);

        // Update points and level yang ada di data yang ter load
        updatePointsAndLevel(parseInt(point.textContent.split(": ")[1])); // Update points

        // Inisialisasi poin dan level dari 0 jika pengguna belum memiliki data
        if (parseInt(point.textContent.split(": ")[1]) === 0) {
            savePointsForUser(username, 0);
        }
        if (parseInt(level.textContent.split(": ")[1]) === 0) {
            saveLevelForUser(username, 0);
        }
    } else if(username == "" && password == ""){
        myAlerts('Please fill the field');
    } else if(username == "") {
        myAlerts('Please enter your username');
    } else if(password == "") {
        myAlerts('Please enter your password');
    } else if(storedPassword && storedPassword != password) {
        myAlerts('Incorrect password');
    } else {
        myAlerts('Username not found');
    }
}




function guessLogin() {
    clearTasks();
    loginArea.style.display = "none";
    alert.style.backgroundColor = "#baffba";
    alert.style.color = "green";
    myAlerts('Login without an account successful!');
    setTimeout(() => {
        alert.style.backgroundColor = "#f8d7da";
        alert.style.color = "#842029";
    }, 2000);
    
    // Inisialisasi To-Do List untuk tamu
    yourToDo.textContent = "Your To-Do List";
    
    // Inisialisasi poin dan level untuk tamu
    point.textContent = "Point : 0";
    level.textContent = "Level : 0";
    
    // Menyimpan status login sebagai tamu
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", "guest");
    
    // Kosongkan input field
    inputBox.value = "";
}

document.addEventListener("DOMContentLoaded", function() {
    const storedUsername = localStorage.getItem("username");
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true" && storedUsername) {
        loadTasksForUser(storedUsername);
        loadPointsForUser(storedUsername);
        loadLevelForUser(storedUsername);
        yourToDo.textContent = storedUsername + "'s To-Do List";
        level.textContent = currentLevel;
        loginArea.style.display = "none";
    } else {
        loginArea.style.display = "block";
    }
});

function logout() {
    const username = localStorage.getItem("username");
    
    saveTasksForUser(username);
    savePointsForUser(username, point.textContent.split(": ")[1]);
    saveLevelForUser(username, level.textContent.split(": ")[1]);
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    
    clearTasks();
    point.textContent = "Point : 0";
    level.textContent = "Level : 0";
    
    loginArea.style.display = "block";
    document.querySelector('.inputPasswordLogin').value = "";
}

// Dummy function for displaying alerts
function myAlerts(message) {
    alert.textContent = message;
    alert.style.display = 'block';
    setTimeout(() => {
        alert.style.display = 'none';
    }, 3000);
}
