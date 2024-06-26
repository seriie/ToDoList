// Notifikasi

function notification() {
    let isTabActive = true;
    let interactionDetected = false;
    let remainingTime = 20000; // 20 detik
    let timer;
    let notificationDismissed = false;
    
    // Custom alert
    
    function myNotif(msg) {
        const notifikasi = document.querySelector('.notification');
        const notif = document.querySelector('.notifBox');
        const notifMsg = document.querySelector('.notifTxt');
    
        if (notif && notifMsg) {
            notifMsg.innerHTML = msg.replace(/\n/g, '<br>'); // Replace \n with <br>
            notifikasi.classList.add('active');
            notif.classList.add('active');
        }
    }
    
    function startTimer() {
        if (notificationDismissed) return;
    
        // Jika timer sudah berjalan, hentikan dulu
        if (timer) clearTimeout(timer);
    
        timer = setTimeout(() => {
            if (isTabActive && interactionDetected) {
                myNotif('Pro tip:\nClick the text to edit text');
            }
        }, remainingTime);
    }
    
    function pauseTimer() {
        clearTimeout(timer);
        timer = null;
    }
    
    window.onfocus = () => {
        isTabActive = true;
        if (interactionDetected && !notificationDismissed) startTimer();
    };
    
    window.onblur = () => {
        isTabActive = false;
        pauseTimer();
    };
    
    document.addEventListener('mousemove', () => {
        if (!interactionDetected) {
            interactionDetected = true;
            if (isTabActive && !notificationDismissed) startTimer();
        }
    });
    
    document.addEventListener('keydown', () => {
        if (!interactionDetected) {
            interactionDetected = true;
            if (isTabActive && !notificationDismissed) startTimer();
        }
    });
    
    document.addEventListener('DOMContentLoaded', () => {
        const okBtn = document.querySelector('.okNotifBtn');
    
        okBtn.addEventListener('click', function() {
            pauseTimer();
            notificationDismissed = true;
            const notif = document.querySelector('.notifBox');    
            notif.classList.remove('active');
        });
    });
    
    startTimer(); // Mulai timer ketika halaman dimuat
}

const storedUsername = localStorage.getItem("username");
const loggedIn = localStorage.getItem("loggedIn");

if(loggedIn == "true" && storedUsername) {
    notification();
}