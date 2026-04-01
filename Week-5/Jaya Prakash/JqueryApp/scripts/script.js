let token = localStorage.getItem("userToken");
if (token) {
  window.location.href = "./dashboard.html";
}
clearWarnings();
$("#loginBtn").click(function () {
  let userName = $("#userName");
  let userPass = $("#password");

  function formValidations(username, password) {
    if (
      username.val().length >= 4 &&
      username.val().length <= 15 &&
      password.val().length >= 8 &&
      password.val().length <= 16
    ) {
      return true;
    }
    return false;
  }

  function warnings(useCase = null) {
    if (useCase) {
      $("#userNameError").removeClass("d-none");
      $("#passwordError").removeClass("d-none");
    } else {
      $("#invalidCreds").removeClass("d-none");
    }
    $("#userName").addClass("is-invalid");
    $("#password").addClass("is-invalid");
  }
  if (formValidations(userName, userPass)) {
    $.ajax({
      url: "https://dummyjson.com/user/login",
      method: "POST",
      data: {
        username: userName.val(),
        password: userPass.val(),
      },
      success: function (response) {
        localStorage.setItem("userToken", response.accessToken);
        window.location.href = "./dashboard.html";
      },
      error: function (error) {
        warnings(1);
        console.log(error);
      },
    });
  } else {
    warnings();
  }
});

function clearWarnings() {
  $("#nameError").addClass("d-none");
  $("#passError").addClass("d-none");
  $("#invalidCreds").addClass("d-none");
  $("#userName").removeClass("is-invalid");
  $("#password").removeClass("is-invalid");
}
