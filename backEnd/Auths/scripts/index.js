const emailRegex = /^[a-zA-Z]+[a-zA-Z0-9+#$.]+@[a-zA-Z]{3,}\.[a-zA-Z]{2,}/;
const phoneRegex = /^[6-9][0-9]{9}$/;

const token = localStorage.getItem("userToken");

if (token) {
  window.location.replace("./home.html");
}

$(document).ready(function () {
  $("#authDiv").load("./templates/login.html");

  $(document).on("click", "#loginLink", function () {
    resetAnimations("#registerContainer");
    $("#registerContainer").addClass("center-right");
    setTimeout(() => {
      $("#authDiv").load("./templates/login.html", function () {
        $("#loginContainer").addClass("left-center");
      });
    }, 150);
  });

  $(document).on("click", "#registerLink", function () {
    resetAnimations("#loginContainer");
    $("#loginContainer").addClass("center-right");
    setTimeout(() => {
      $("#authDiv").load("./templates/signup.html", function () {
        $("#registerContainer").addClass("left-center");
      });
    }, 150);
  });

  $(document).on("click", "#forgotPasswordLink", function () {
    resetAnimations("#loginContainer");
    $("#loginContainer").addClass("center-down");
    setTimeout(() => {
      $("#authDiv").load("./templates/forgotPassword.html", function () {
        $("#verifyEmail").addClass("top-center");
      });
    }, 150);
  });

  $(document).on("click", "#cancleVerifyEmail", function () {
    resetAnimations("#verifyEmail");
    $("#verifyEmail").addClass("center-down");
    setTimeout(() => {
      $("#authDiv").load("./templates/login.html", function () {
        $("#loginContainer").addClass("top-center");
      });
    }, 150);
  });

  $(document).on("click", "#loginBtn", function () {
    // $("#loginBtn").addClass("disabled");
    // $("#btnText").addClass("d-none");
    // $("#spinner").removeClass("d-none");
    const userEmail = $("#emailInput");
    const userPassword = $("#passwordInput");
    const userEmailVal = userEmail.val();
    const userPasswordVal = userPassword.val();
    let errorFlag = false;

    if (!emailRegex.test(userEmailVal)) {
      $("#emailInputError").removeClass("d-none");
      userEmail.addClass("is-invalid");
      errorFlag = true;
    }

    if (userPasswordVal.length < 6 || userPasswordVal.length > 25) {
      $("#passwordInputError").removeClass("d-none");
      userPassword.addClass("is-invalid");
      errorFlag = true;
    }

    if (errorFlag) {
      return;
    }
    $.ajax({
      url: "../api/login.php",
      method: "POST",
      dataType: "json",
      data: {
        email: userEmail,
        password: userPassword,
      },
      success: function (response) {
        if (response.status) {
          console.log(response);
          localStorage.setItem("userToken", response.data.token);
          Swal.fire({
            title: "Success!",
            text: "Login successful",
            icon: "success",
          }).then(() => {
            if (response.data.isAdmin) {
              window.location.href = "../adminDashboard.html";
            } else {
              window.location.href = "../userDashboard.html";
            }
          });
        } else {
          Swal.fire("Error", response.message, "error");
          // $("#loginBtn").removeClass("disabled");
          // $("#btnText").removeClass("d-none");
          // $("#spinner").addClass("d-none");
        }
      },
      error: function (error) {
        console.error(error);
        // $("#loginBtn").removeClass("disabled");
        // $("#btnText").removeClass("d-none");
        // $("#spinner").addClass("d-none");
      },
    });
  });

  $(document).on("submit", "#registerForm", function (e) {
    e.preventDefault();
    const firstName = $("#firstNameInput");
    const lastName = $("#lastNameInput");
    const email = $("#registerEmailInput");
    const number = $("#registerPhoneInput");
    const password = $("#registerPasswordInput");
    const conformPassword = $("#registerConfirmPasswordInput");

    let errorFlag = false;

    if (firstName.val().length < 4 || firstName.val().length > 30) {
      $("#firstNameInputError").removeClass("d-none");
      firstName.addClass("is-invalid");
      errorFlag = true;
    }

    if (lastName.val().length < 4 || lastName.val().length > 30) {
      $("#lastNameInputError").removeClass("d-none");
      lastName.addClass("is-invalid");
      errorFlag = true;
    }

    if (!emailRegex.test(email.val())) {
      $("#registerEmailInputError").removeClass("d-none");
      email.addClass("is-invalid");
      errorFlag = true;
    }

    if (!phoneRegex.test(number.val())) {
      $("#registerPhoneInputError").removeClass("d-none");
      number.addClass("is-invalid");
      errorFlag = true;
    }

    if (password.val().length < 8 || password.val().length > 25) {
      $("#registerPasswordInputError").removeClass("d-none");
      password.addClass("is-invalid");
      errorFlag = true;
    }

    if (password.val() !== conformPassword.val()) {
      $("#registerConfirmPasswordInputError").removeClass("d-none");
      conformPassword.addClass("is-invalid");
      errorFlag = true;
    }

    if (errorFlag) {
      return;
    }

    const formData = new FormData(document.getElementById("registerForm"));

    $.ajax({
      type: "POST",
      url: "../api/register.php",
      dataType: "json",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        console.log(response);
        console.log(response.status);
        if (!response.status) {
          if (response.errors && Object.entries(response.errors).length > 0) {
            const errors = response.errors;
            console.log("errors" + errors);
            Object.entries(errors).forEach(([key, value]) => {
              $(`#${key}Error`).text(value);
            });
            return;
          }
          Swal.fire("Error", response.message, "error");
          return;
        }
        Swal.fire("Success", "Successfully Registerd!!", "success").then(() => {
          $("#authDiv").load("./templates/login.html");
        });
      },
      error: function (error) {
        console.log(error);
      },
    });
  });

  $(document).on(
    "click",
    "#uploadImageIcon, #profileImagePreview",
    function () {
      $("#profileImage").click();
    },
  );

  $(document).on("change", "#profileImage", function () {
    const uploadedImg = $("#profileImage")[0].files[0];
    if (!uploadedImg) {
      return;
    }
    $("#profileImagePreview").attr("src", URL.createObjectURL(uploadedImg));
  });

  let emailValidationTimer;
  $(document).on("input", "#registerEmailInput", function () {
    clearTimeout(emailValidationTimer);
    emailValidationTimer = setTimeout(() => {
      const emailInput = $("#registerEmailInput").val().trim();
      if (!emailRegex.test(emailInput)) {
        $("#registerEmailExist").addClass("d-none").text("");
        return;
      }
      $.ajax({
        type: "POST",
        url: "../api/isUserExist.php",
        data: {
          emailInput,
        },
        dataType: "json",
        success: function (response) {
          if (response.status) {
            $("#registerEmailExist")
              .removeClass("d-none")
              .text("An User with this email already exists!!");
          } else {
            $("#registerEmailExist").addClass("d-none").text("");
          }
        },
      });
    }, 800);
  });

  let phoneValidationTimer;
  $(document).on("input", "#registerPhoneInput", function () {
    clearTimeout(phoneValidationTimer);
    phoneValidationTimer = setTimeout(() => {
      const phoneInput = $("#registerPhoneInput").val().trim();
      if (!phoneRegex.test(phoneInput)) {
        $("#registerPhoneExist").addClass("d-none").text("");
        return;
      }
      $.ajax({
        type: "POST",
        url: "../api/isUserExist.php",
        data: {
          phoneInput,
        },
        dataType: "json",
        success: function (response) {
          if (response.status) {
            $("#registerPhoneExist")
              .removeClass("d-none")
              .text("An User with this phone number already exists!!");
          } else {
            $("#registerPhoneExist").addClass("d-none").text("");
          }
        },
      });
    }, 800);
  });

  $(document).on("input", "#emailInput , #passwordInput", function () {
    clearLoginErrors();
  });

  $(document).on("input", "#registerForm", function () {
    clearRegisterErrors();
  });
});

function resetAnimations(element) {
  $(element).removeClass("top-center center-down left-center center-right");
}

function loginFormValidations(email, password) {
  return (
    emailRegex.test(email.val()) &&
    password.val().length >= 8 &&
    password.val().length <= 20
  );
}

function clearRegisterErrors() {
  $("#firstNameInputError").addClass("d-none");
  $("#lastNameInputError").addClass("d-none");
  $("#registerEmailInputError").addClass("d-none");
  $("#registerPhoneInputError").addClass("d-none");
  $("#registerPasswordInputError").addClass("d-none");
  $("#registerConfirmPasswordInputError").addClass("d-none");
  $("#firstNameInput").removeClass("is-invalid");
  $("#lastNameInput").removeClass("is-invalid");
  $("#registerEmailInput").removeClass("is-invalid");
  $("#registerPhoneInput").removeClass("is-invalid");
  $("#registerPasswordInput").removeClass("is-invalid");
  $("#registerConfirmPasswordInput").removeClass("is-invalid");
}

function clearLoginErrors() {
  $("#emailInputError, #passwordInputError").addClass("d-none");
  $("#emailInput, #passwordInput").removeClass("is-invalid");
}
