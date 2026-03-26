const user = JSON.parse(localStorage.getItem("user"));
document.getElementById("user").textContent = user.username;


function logout() {
  localStorage.removeItem("token");
  window.location.href = "../templates/index.html";
}