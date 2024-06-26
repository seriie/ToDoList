// My Alerts
function myAlerts(error) {
    const alert = document.querySelector(".alert");
    const alertMsg = document.querySelector(".alert-msg");
  
    if (alert && alertMsg) {
      alert.style.transform = "translateY(-190px)";
      alertMsg.innerHTML = error;
  
      setTimeout(() => {
        alert.style.transform = "translateY(-350px)";
      }, 2000);
    } else {
      console.error("Element .alert or .alert-msg not found!");
    }
}