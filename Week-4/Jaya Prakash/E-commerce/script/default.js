const user = JSON.parse(localStorage.getItem("user"));
document.getElementById("user").textContent = user.username;
