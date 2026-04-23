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

const mailRegex = /^[a-zA-Z0-9+-.#$]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
const licenseRegex = /^[A-Z]{2}[0-9]{2}[-\s]?[0-9]{4}[0-9]{7}$/;
const panRegex = /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/;

$(document).ready(function () {
  $("#formBody").load("./login.html");
  $("#loginBtn").click(function () {
    $("#loginBtn").addClass("disabled");
    $("#btnText").addClass("d-none");
    $("#spinner").removeClass("d-none");

    let userName = $("#userName");
    let userPass = $("#password");

    const userEmail = userName.val();
    const userPassword = userPass.val();
    clearWarnings();
    if (formValidations(userName, userPass)) {
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
            // console.log(response.data.token);
            localStorage.setItem("userToken", response.data.token);
            Swal.fire({
              title: "Success!",
              text: "Login successful",
              icon: "success",
            }).then(() => {
              window.location.href = "../dashboard.html";
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

  $("#registerBtn").click(function (e) {
    clearErrors();
    let errorFlag = false;
    e.preventDefault();
    let firstName = $("#firstName");
    let lastName = $("#lastName");
    let email = $("#email");
    let number = $("#phone");
    let panNumber = $("#panNumber");
    let licenseNumber = $("#licenseNumber");
    let dob = $("#dob");
    let aadhar = $("#aadhar");
    let password = $("#password");
    let conformPassword = $("#conformPassword");

    if (firstName.val().length < 4 || firstName.val().length > 30) {
      $("#firstNameError").removeClass("d-none");
      errorFlag = true;
    }

    if (lastName.val().length < 4 || lastName.val().length > 30) {
      $("#lastNameError").removeClass("d-none");
      errorFlag = true;
    }

    if (!mailRegex.test(email.val())) {
      $("#emailError").removeClass("d-none");
      errorFlag = true;
    }

    if (number.val().length !== 10 || isNaN(number.val())) {
      $("#phoneError").removeClass("d-none");
      errorFlag = true;
    }

    if (!panRegex.test(panNumber.val())) {
      $("#panNumberError").removeClass("d-none");
      errorFlag = true;
    }

    if (!licenseRegex.test(licenseNumber.val())) {
      $("#licenseNumberError").removeClass("d-none");
      errorFlag = true;
    }

    function dobValidation() {
      if (!dob.val()) {
        $("#dobError")
          .text("Please select your date of birth")
          .removeClass("d-none");
        errorFlag = true;
        return;
      }

      let today = new Date();
      let birthDate = new Date(dob.val());

      if (birthDate > today) {
        $("#dobError")
          .text("DOB cannot be in the future")
          .removeClass("d-none");
        errorFlag = true;
        return;
      }

      let age = today.getFullYear() - birthDate.getFullYear();
      let monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        $("#dobError")
          .text("You must be at least 18 years old")
          .removeClass("d-none");
        errorFlag = true;
        return;
      }
    }
    dobValidation();

    if (aadhar.val().length !== 12 || isNaN(aadhar.val())) {
      $("#aadharError").removeClass("d-none");
      errorFlag = true;
    }

    if (password.val().length < 8 || password.val().length > 20) {
      $("#passwordError").removeClass("d-none");
      errorFlag = true;
    }

    if (password.val() !== conformPassword.val()) {
      $("#conformPasswordError").removeClass("d-none");
      errorFlag = true;
    }

    if (errorFlag) {
      return;
    }
    $.ajax({
      type: "POST",
      url: "../api/signup.php",
      dataType: "json",
      data: {
        first_name: firstName.val(),
        last_name: lastName.val(),
        email: email.val(),
        phone_number: number.val(),
        pan_number: panNumber.val(),
        license_number: licenseNumber.val(),
        dob: dob.val(),
        aadhar: aadhar.val(),
        password: password.val(),
        conformPassword: conformPassword.val(),
      },
      success: function (response) {
        console.log(response);
        if (response.status) {
          window.location.href = "/index.html?signedup=true";
        } else {
          Swal.fire({
            position: "top",
            icon: "warning",
            title: response.message,
            showConfirmButton: false,
          });
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  });
});
function formValidations(username, password) {
  return (
    mailRegex.test(username.val()) &&
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

function clearErrors() {
  $("#firstNameError").addClass("d-none");
  $("#lastNameError").addClass("d-none");
  $("#emailError").addClass("d-none");
  $("#phoneError").addClass("d-none");
  $("#panNumberError").addClass("d-none");
  $("#licenseNumberError").addClass("d-none");
  $("#dobError").addClass("d-none").text("");
  $("#aadharError").addClass("d-none");
  $("#passwordError").addClass("d-none");
  $("#conformPasswordError").addClass("d-none");
}

function clearWarnings() {
  $("#userNameError, #passwordError, #invalidCreds").addClass("d-none");
  $("#userName, #password").removeClass("is-invalid");
}

$("#userName, #password").on("input", clearWarnings);


$(document).on("click", "#signupLink", function () {
  $("#formBody").removeClass("loginBackgroundImg").addClass("registerBackgroundImg").load("./signup.html");
});

$(document).on("click", "#loginLink", function () {
  $("#formBody").removeClass("registerBackgroundImg").addClass("loginBackgroundImg").load("./login.html");
});