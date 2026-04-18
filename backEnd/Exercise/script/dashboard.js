const userToken = localStorage.getItem("userToken");
if (!userToken) {
  window.location.href = "./login.html";
}

function logout(res = {}, isExpired = false) {
  const title = isExpired ? "Session Expired" : "Logged Out";
  const icon = isExpired ? "warning" : "success";
  const message = res.message;
  Swal.fire(title, message, icon).then(() => {
    localStorage.removeItem("userToken");
    window.location.href = "./login.html";
  });
}

$(document).ready(function () {
  $.ajax({
    type: "post",
    url: "../php/utils/validateToken.php",
    data: { userToken: userToken },
    dataType: "json",
    success: function (response) {
      if (!response.status) {
        logout(response, true);
      }
      console.log(response);
    },
    error: function (err) {
      console.error(err);
    },
  });
  $("#logoutButton").click(() => {
    $.ajax({
      type: "post",
      url: "../php/utils/validateToken.php",
      data: { userToken: userToken, isLogout: 1 },
      dataType: "json",
      success: function (response) {
        if (!response.status) {
          logout(response);
        }
      },
      error: function (err) {
        console.error(err);
        logout();
      },
    });
  });
});
