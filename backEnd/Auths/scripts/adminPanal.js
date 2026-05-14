const userToken = localStorage.getItem("userToken");
if (!userToken) {
  window.location.replace("./index.html");
}

function validateAdmin() {
  $.ajax({
    type: "GET",
    headers: setHeader(),
    url: "../api/validateAdmin.php",
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (!response.status) {
        Swal.fire("Error", response.message, "warning").then(() => {
          logout();
        });
      }
      $("#navbarUsername").text(response.data.adminName)
    },
    error: function (err) {
      console.error(err);
      logout();
    },
  });
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

$(document).ready(function () {
  validateAdmin();
  $("#logoutBtn").on("click", () => logout());
});
