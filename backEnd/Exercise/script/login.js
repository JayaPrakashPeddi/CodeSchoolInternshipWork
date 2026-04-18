const token = localStorage.getItem("userToken");
if (token) {
  window.location.href = "../dashboard.html";
}

let url = new URL(window.location);
if (url.searchParams.get("signedup")) {
  Swal.fire("Success", "Successfully Signed Up!!", "success").then(() => {
    url.searchParams.delete("signedup");
    window.history.replaceState({}, document.title, url.toString());
  });
}

$("#loginBtn").click(function () {
  $("#loginBtn").addClass("disabled");
  $("#btnText").addClass("d-none");
  $("#spinner").removeClass("d-none");

  let userName = $("#userName");
  let userPass = $("#password");

  function formValidations(username, password) {
    return (
      username.val().length > 10 &&
      username.val().length <= 30 &&
      password.val().length >= 8 &&
      password.val().length <= 20
    );
  }

  function warnings(type = "validation") {
    if (type === "validation") {
      $("#userNameError").removeClass("d-none");
      $("#passwordError").removeClass("d-none");
    } else {
      $("#invalidCreds").removeClass("d-none");
    }

    $("#userName").addClass("is-invalid");
    $("#password").addClass("is-invalid");
  }

  const userEmail = userName.val();
  const userPassword = userPass.val();

  if (formValidations(userName, userPass)) {
    $.ajax({
      url: "../php/login.php",
      method: "POST",
      dataType: "json",
      data: {
        email: userEmail,
        password: userPassword,
      },
      success: function (response) {
        if (response.status) {
          localStorage.setItem("userToken", response.data["token"]);
          Swal.fire({
            title: "Success!",
            text: "Login successful",
            icon: "success",
          }).then(() => {
            window.location.href = "./dashboard.html";
          });
        } else {
          Swal.fire("Error", response.message, "error");
          $("#loginBtn").removeClass("disabled");
          $("#btnText").removeClass("d-none");
          $("#spinner").addClass("d-none");
        }
      },
      error: function (error) {
        console.error(error);
        $("#loginBtn").removeClass("disabled");
        $("#btnText").removeClass("d-none");
        $("#spinner").addClass("d-none");
        warnings("invalid");
      },
    });
  } else {
    console.log("something went wrong..!!");
    $("#loginBtn").removeClass("disabled");
    $("#btnText").removeClass("d-none");
    $("#spinner").addClass("d-none");
    warnings("validation");
  }
});

function clearWarnings() {
  $("#userNameError, #passwordError, #invalidCreds").addClass("d-none");
  $("#userName, #password").removeClass("is-invalid");
}

$("#userName, #password").on("input", clearWarnings);
