const userToken = localStorage.getItem("userToken");
if (!userToken) {
  window.location.replace("./index.html");
}

function setHeader() {
  return { Authentication: localStorage.getItem("userToken") };
}

function logout() {
  $.ajax({
    type: "GET",
    headers: setHeader(),
    url: "../api/logout.php",
    dataType: "json",
    success: function (response) {
      if (response) {
        localStorage.removeItem("userToken");
        window.location.replace("./index.html");
      }
    },
    error: function (err) {
      localStorage.removeItem("userToken");
      window.location.replace("./index.html");
    },
  });
}

function validateToken() {
  $.ajax({
    type: "GET",
    headers: setHeader(),
    url: "../api/validateToken.php",
    dataType: "json",
    success: function (response) {
      if (!response.status) {
        Swal.fire("Error", response.message, "warning").then(() => {
          logout();
        });
      }
    },
    error: function (err) {
      console.error(err);
    },
  });
}

$(document).ready(function () {
  validateToken();

  $("#logoutBtn").on("click", () => logout());

});
