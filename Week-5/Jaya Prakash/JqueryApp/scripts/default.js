let token = localStorage.getItem("userToken");
if (!token) {
  logout();
}
function checkAuth() {
  $.ajax({
    url: "https://dummyjson.com/auth/me",
    headers: { Authorization: `Bearer ${token}` },
    success: function (response) {
      return;
    },
    error: function (err) {
      console.log("Invalid Token!! Logging Out...");
      logout();
    },
  });
  return true;
}
function logout() {
  localStorage.removeItem("userToken");
  window.location.href = "../templates/index.html";
  return;
}

$(document).ready(function () {
  $("#navBar").load("../templates/base.html");
});