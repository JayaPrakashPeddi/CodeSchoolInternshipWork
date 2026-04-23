const userToken = localStorage.getItem("userToken");

const mailRegex = /^[a-zA-Z0-9+-.#$]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
const licenseRegex = /^[A-Z]{2}[0-9]{2}[-\s]?[0-9]{4}[0-9]{7}$/;
const panRegex = /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/;

if (!userToken) {
  window.location.href = "./index.html";
}

function logout(res = {}, isExpired = false) {
  const title = isExpired ? "Session Expired" : "Logged Out";
  const icon = isExpired ? "warning" : "success";
  const message = res.message;
  Swal.fire(title, message, icon).then(() => {
    localStorage.removeItem("userToken");
    window.location.href = "./index.html";
  });
}

function deleteUser(id) {
  $.ajax({
    type: "post",
    url: "../api/deleteDriver.php",
    data: { id },
    dataType: "json",
    success: function (response) {
      if (response.status) {
        Swal.fire("Success", response.message, "success").then(() => {
          listDrivers();
        });
      }
    },
  });
}

function ajaxCall() {
  $.ajax({
    type: "post",
    url: "../api/validateToken.php",
    data: { userToken: userToken },
    dataType: "json",
    success: function (response) {
      if (!response.status) {
        logout(response, true);
      }
      $("#Customer,#offcanvasCustomer").text(
        " " + response.data.first_name + " " + response.data.last_name,
      );
      $("#totalCustomers").text(response.data.userCount - 1);
      console.log(response);
    },
    error: function (err) {
      console.error(err);
    },
  });
}

function removeActiveClass() {
  $("#sidebarDashboard,#offcanvasDashboard").removeClass("activeTab");
  $("#sidebarDrivers,#offcanvasDrivers").removeClass("activeTab");
  $("#sidebarVehicles,#offcanvasVehicles").removeClass("activeTab");
  $("#sidebarBookings,#offcanvasBookings").removeClass("activeTab");
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
  $("#confirmPasswordError").addClass("d-none");
}

function listDrivers() {
  removeActiveClass();
  $("#sidebarDrivers,#offcanvasDrivers").addClass("activeTab");
  $("#mainDiv").load("./users.html", function () {
    const table = $("#driversTable");

    $.ajax({
      type: "get",
      url: "./api/driversList.php",
      dataType: "json",
      success: function (response) {
        console.log("hi");
        console.log(response.data.length);
        for (let i = 0; i < response.data.length; i++) {
          let tr = $("<tr>").append(
            $("<td>").text(i + 1),
            $("<td>").text(response.data[i].first_name),
            $("<td>").text(response.data[i].last_name),
            $("<td>").text(response.data[i].email),
            $("<td>").text(response.data[i].phone),
            $("<td>").text(response.data[i].pan_number),
            $("<td>").text(response.data[i].license_number),
            $("<td>").text(response.data[i].aadhar_number),
            $("<td>").html(
              `<button class="btn btn-danger"><i class="bi bi-trash3" onclick="deleteUser(${response.data[i].id})"></i></button>`,
            ),
          );
          table.append(tr);
        }
      },
    });
  });
}

$(document).ready(function () {
  ajaxCall();

  $(document).on("click", "#sidebarDashboard,#offcanvasDashboard", () => {
    removeActiveClass();
    $("#sidebarDashboard,#offcanvasDashboard").addClass("activeTab");
    window.location.reload();
    ajaxCall();
  });

  $(document).on("click", "#sidebarDrivers,#offcanvasDrivers", () => {
    listDrivers();
  });

  $(document).on("click", "#sidebarVehicles,#offcanvasVehicles", () => {
    listDrivers();
  });

  $(document).on("click", "#sidebarBookings,#offcanvasBookings", () => {
    listDrivers();
  });

  $(document).on("click", "#logoutButton,#logoutButtonOffcanavas", () => {
    $.ajax({
      type: "post",
      url: "../api/validateToken.php",
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


  $(document).on("submit", "#registerForm", function (e) {
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
    let confirmPassword = $("#confirmPassword");

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

    if (password.val() !== confirmPassword.val()) {
      $("#confirmPasswordError").removeClass("d-none");
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
        conformPassword: confirmPassword.val(),
      },
      success: function (response) {
        console.log(response);
        if (response.status) {
          Swal.fire("Success", response.message, "success").then(() => {
            listDrivers();
          });
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
