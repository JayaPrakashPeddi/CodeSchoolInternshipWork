const userToken = localStorage.getItem("userToken");
const emailRegex = /^[a-zA-Z0-9.$#]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
const firstNameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const lastNameRegex = /^[a-zA-Z]{3,}/;
const numberRegex = /^[6-9]\d{9}$/;

function validateToken() {
  const token = localStorage.getItem("userToken");
  $.ajax({
    type: "POST",
    url: "../api/validateToken.php",
    data: { userToken: token },
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (!response.status) {
        return;
      }
      if(response.data.role === "ADMIN"){
        window.location.replace("./adminpanal.html");
        return;
      }

      $("#navbarUsername").text(response.data.full_name);
    },

    error: function (err) {
      console.error(err);
    },
  });
}

function checkToken() {
  const token = localStorage.getItem("userToken");
  if (!token) {
    $("#userDtlsDropDown").addClass("d-none");
    $("#loginAndRegisterLinks").removeClass("d-none");
    return;
  }
  $("#userDtlsDropDown").removeClass("d-none");
  $("#loginAndRegisterLinks").addClass("d-none");
  validateToken();
}

checkToken();

function loginFormValidations(email, password) {
  const emailErrorEle = $("#emailInputError");
  const passwordErrorEle = $("#passwordInputError");
  let errorFlag = false;

  if (!emailRegex.test(email)) {
    emailErrorEle.removeClass("d-none");
    errorFlag = true;
  }

  if (password.length < 6 || password.length > 20) {
    passwordErrorEle.removeClass("d-none");
    errorFlag = true;
  }

  if (errorFlag) {
    return false;
  }
  return true;
}

function registerFormValidations(
  firstName,
  lastName,
  email,
  phone,
  password,
  confirmPassword,
) {
  const firstNameInputErrorEle = $("#firstNameInputError");
  const lastNameInputErrorEle = $("#lastNameInputError");
  const registerEmailErrorEle = $("#registerEmailError");
  const phoneInputErrorEle = $("#phoneInputError");
  const registerPasswordErrorEle = $("#registerPasswordError");
  const confirmPasswordErrorEle = $("#confirmPasswordError");

  let errorFlag = false;

  if (!firstNameRegex.test(firstName)) {
    firstNameInputErrorEle.removeClass("d-none");
    errorFlag = true;
  }
  if (!lastNameRegex.test(lastName)) {
    lastNameInputErrorEle.removeClass("d-none");
    errorFlag = true;
  }
  if (!emailRegex.test(email)) {
    registerEmailErrorEle.removeClass("d-none");
    errorFlag = true;
  }
  if (!numberRegex.test(phone)) {
    phoneInputErrorEle.removeClass("d-none");
    errorFlag = true;
  }
  if (password.length < 6 || password.length > 20) {
    registerPasswordErrorEle.removeClass("d-none");
    errorFlag = true;
  }
  if (password != confirmPassword) {
    confirmPasswordErrorEle.removeClass("d-none");
    errorFlag = true;
  }
  if (errorFlag) {
    return false;
  }
  return true;
}

function showValidationErrors(errors) {
  $(".text-danger").addClass("d-none").text("");
  for (let id in errors) {
    $("#" + id)
      .removeClass("d-none")
      .text(errors[id]);
  }
}

$(document).ready(function () {
  $("#mainContainer").load("./templates/home.html");

  $(document).on("click", "#homeLink", function () {
    $("#mainContainer").load("./templates/home.html");
  });

  $(document).on("click", "#categoriesLink", function () {
    $("#mainContainer").load("./templates/categories.html");
  });

  $(document).on("click", "#cartLink", function () {
    $("#mainContainer").load("./templates/cart.html");
  });

  $(document).on("click", "#ordersLink", function () {
    $("#mainContainer").load("./templates/orders.html");
  });

  $(document).on("click", "#loginBtn", function (e) {
    e.preventDefault();
    const email = $("#emailInput").val();
    const password = $("#passwordInput").val();
    if (loginFormValidations(email, password)) {
      $.ajax({
        type: "POST",
        url: "../api/login.php",
        data: { email, password },
        dataType: "json",
        success: function (response) {
          if (!response.status) {
            if (response.errors.length !== 0) {
              console.log("errors");
              showValidationErrors(response.errors);
            } else {
              Swal.fire(
                "Waring",
                "Please Check your credientials and try again",
                "warning",
              );
            }
          } else {
            localStorage.setItem("userToken", response.data.token);
            console.log(response.data.role);
            if(response.data.role=="ADMIN"){
              console.log("admin")
              window.location.replace("./admin.php");
            }
            checkToken();
            const loginEle = document.getElementById("loginModal");
            const loginModal = bootstrap.Modal.getInstance(loginEle);
            loginModal.hide();
            
          }
        },
      });
    }
  });

  $(document).on("click", "#registerBtn", function () {
    const firstName = $("#firstNameInput").val();
    const lastName = $("#lastNameInput").val();
    const email = $("#registerEmailInput").val();
    const phone = $("#phoneInput").val();
    const password = $("#registerPasswordInput").val();
    const confirmPassword = $("#confirmPasswordInput").val();

    if (
      registerFormValidations(
        firstName,
        lastName,
        email,
        phone,
        password,
        confirmPassword,
      )
    ) {
      $.ajax({
        type: "POST",
        url: "../api/userRegister.php",
        data: {
          firstName,
          lastName,
          email,
          phone,
          password,
          confirmPassword,
        },
        dataType: "json",
        success: function (response) {
          if (!response.status) {
            showValidationErrors(response.errors);
          } else {
            Swal.fire("Success", "Successfully Registered!!", "success").then(
              () => {
                const registerModal = bootstrap.Modal.getInstance(
                  document.getElementById("registerModal"),
                );
                registerModal.hide();
                const loginModal = new bootstrap.Modal(
                  document.getElementById("loginModal"),
                );
                loginModal.show();
              },
            );
          }
        },
        error: function (err) {
          console.error(err);
        },
      });
    }
  });

  $(document).on("click", "#logoutBtn", function () {
    $.ajax({
      type: "POST",
      url: "../api/logout.php",
      data: { userToken },
      dataType: "json",
      success: function (response) {
        localStorage.removeItem("userToken");
        $("#userDtlsDropDown").addClass("d-none");
        $("#loginAndRegisterLinks").removeClass("d-none");
      },
    });
    return;
  });

  let emailValidationTimer;
  $(document).on("input", "#registerEmailInput", function () {
    clearTimeout(emailValidationTimer);
    emailValidationTimer = setTimeout(function () {
      const email = $("#registerEmailInput").val().trim();
      $("#registerEmailError").addClass("d-none").text("");
      console.log(email);
      if (!emailRegex.test(email)) {
        console.log("failed");
        return;
      }
      $.ajax({
        type: "POST",
        url: "../api/isEmailExists.php",
        data: { email },
        dataType: "json",
        success: function (response) {
          if (response.status) {
            $("#registerEmailError")
              .text("An account with this email already exists")
              .removeClass("d-none");
          }
        },
        error: function (err) {
          console.error(err);
        },
      });
    }, 600);
  });

  let phoneTimer;
  $(document).on("input", "#phoneInput", function () {
    clearTimeout(phoneTimer);

    phoneTimer = setTimeout(function () {
      const phone = $("#phoneInput").val().trim();

      $("#phoneError").addClass("d-none").text("");

      if (!numberRegex.test(phone)) {
        return;
      }

      $.ajax({
        type: "POST",
        url: "../api/isPhoneExists.php",
        data: { phone },
        dataType: "json",
        success: function (response) {
          if (response.status) {
            $("#phoneInputError")
              .text("An account with this phone number already exists")
              .removeClass("d-none");
          }
        },
      });
    }, 600);
  });

  $(document).on("input", "#registerModal", function () {
    const firstNameInputErrorEle = $("#firstNameInputError");
    const lastNameInputErrorEle = $("#lastNameInputError");
    const registerEmailErrorEle = $("#registerEmailError");
    const registerPasswordErrorEle = $("#registerPasswordError");
    const confirmPasswordErrorEle = $("#confirmPasswordError");
    const phoneInputErrorEle = $("#phoneInputError");
    firstNameInputErrorEle.addClass("d-none");
    lastNameInputErrorEle.addClass("d-none");
    registerEmailErrorEle.addClass("d-none");
    registerPasswordErrorEle.addClass("d-none");
    confirmPasswordErrorEle.addClass("d-none");
    phoneInputErrorEle.addClass("d-none");
  });


});
