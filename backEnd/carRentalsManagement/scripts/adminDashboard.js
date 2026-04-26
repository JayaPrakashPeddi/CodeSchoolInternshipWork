const userToken = localStorage.getItem("userToken");

const mailRegex = /^[a-zA-Z0-9+-.#$]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
const licenseRegex = /^[A-Z]{2}[0-9]{2}[-\s]?[0-9]{4}[0-9]{7}$/;
const panRegex = /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/;
const numberPlateRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;

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
      console.log(response);
      $("#Customer,#offcanvasCustomer").text(
        " " + response.data.first_name + " " + response.data.last_name,
      );
      $("#totalCustomers").text(response.data.userCount - 1);
      $("#totalBookings").text(response.data.bookingsCount);
      $("#totalRevenue").text(parseInt(response.data.total_revenue));
    },
    error: function (err) {
      console.error(err);
    },
  });
}

function deleteUser(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "This Driver record will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
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
  });
}

function viewVehicleDetails(id) {
  window.selectedVehicleId = id;
  $.ajax({
    type: "get",
    url: "../api/getVehicleById.php",
    data: { id: id },
    dataType: "json",
    success: function (response) {
      if (!response.status) {
        console.error(response.message);
        return;
      }
      const vehicle = response.data;
      console.log(vehicle);
      $("#mBrand").text(vehicle.brand);
      $("#mModel").text(vehicle.model);
      $("#mNumber").text(vehicle.number_plate.toUpperCase());
      $("#mPrice").text("₹." + vehicle.price_per_day);
      $("#bookVechicleBtn").addClass("disabled");
      $("#mImage").attr("src", "./uploads/" + vehicle.photo);
      const modal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById("vehicleDetailsModal"),
      );
      modal.show();
    },
    error: function (err) {
      console.error(err);
    },
  });
}

function deleteVehicleDetails(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "This Vehicle record will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "post",
        url: "../api/deleteVehicle.php",
        data: { id },
        dataType: "json",
        success: function (response) {
          if (response.status) {
            Swal.fire("Success", response.message, "success").then(() => {
              listVehicles();
            });
          }
        },
      });
    }
  });
}

function viewBookingDetails(id) {
  window.selectedBookingId = id;
  $.ajax({
    type: "get",
    url: "../api/viewBookingDetails.php",
    data: { id },
    dataType: "json",
    success: function (response) {
      if (!response.status) {
        console.error(response.message);
        return;
      }
      let booking = response.data;
      $("#bDriverName").text(booking.driver_name);
      $("#bLicenseNumber").text(booking.license_number);
      $("#bVehicleName").text(booking.vehicle_name);
      $("#bNumber").text(booking.number_plate.toUpperCase());
      $("#bPricePerDay").text("₹." + parseInt(booking.price_per_day));
      $("#bTotalPrice").text("₹." + parseInt(booking.total_amount));
      $("#bStartDate").text(booking.booked_date);
      $("#bEndDate").text(booking.return_date);
      $("#bImage").attr("src", "./uploads/" + booking.photo);
      const modal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById("bookingDetailsModal"),
      );
      modal.show();
    },
    error: function (err) {
      console.error(err);
    },
  });
}

function deleteBookingDetails(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "This booking record will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "post",
        url: "../api/deleteBooking.php",
        data: { id },
        dataType: "json",
        success: function (response) {
          if (response.status) {
            Swal.fire("Deleted!", response.message, "success").then(() => {
              listBookings();
            });
          } else {
            Swal.fire("Error", response.message, "error");
          }
        },
        error: function () {
          Swal.fire("Error", "Something went wrong", "error");
        },
      });
    }
  });
}

function removeActiveClass() {
  $("#sidebarDashboard,#offcanvasDashboard").removeClass("activeTab");
  $("#sidebarDrivers,#offcanvasDrivers").removeClass("activeTab");
  $("#sidebarVehicles,#offcanvasVehicles").removeClass("activeTab");
  $("#sidebarBookings,#offcanvasBookings").removeClass("activeTab");
}

function clearRegisterFormErrors() {
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

function clearVehicleFormErrors() {
  $("#brandNameError").addClass("d-none");
  $("#modelNameError").addClass("d-none");
  $("#numberPlateError").addClass("d-none").text("");
  $("#priceError").addClass("d-none");
  $("#photoError").addClass("d-none");
}

function listDrivers() {
  removeActiveClass();
  $("#sidebarDrivers,#offcanvasDrivers").addClass("activeTab");
  $("#mainDiv").load("./users.html", function () {
    const table = $("#driversTable");

    $.ajax({
      type: "get",
      url: "../api/listDrivers.php",
      dataType: "json",
      success: function (response) {
        if (response.data.length == 0) {
          return;
        }
        table.text("");
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

function listVehicles() {
  removeActiveClass();
  $("#sidebarVehicles,#offcanvasVehicles").addClass("activeTab");
  $("#mainDiv").load("./manageVehicles.html", function () {
    const table = $("#vehiclesTable");
    $.ajax({
      type: "get",
      url: "../api/listVehicles.php",
      dataType: "json",
      success: function (response) {
        if (response.data.length == 0) {
          return;
        }
        table.text("");
        for (let i = 0; i < response.data.length; i++) {
          let tr = $("<tr>").append(
            $("<td>").text(i + 1),
            $("<td>").text(response.data[i].brand),
            $("<td>").text(response.data[i].model),
            $("<td>").text(response.data[i].number_plate),
            $("<td>").text(response.data[i].price_per_day),
            $("<td>").text(response.data[i].is_available),
            $("<td>").append(
              $("<img>")
                .addClass("image-fluid")
                .attr({
                  src: "./uploads/" + response.data[i].photo,
                  height: 50,
                }),
            ),

            $("<td>").html(
              `<button class="btn btn-info me-1" onclick="viewVehicleDetails(${response.data[i].id})"><i class="bi bi-eye"></i></button><button class="btn btn-danger" onclick="deleteVehicleDetails(${response.data[i].id})"><i class="bi bi-trash3"></i></button>`,
            ),
          );
          table.append(tr);
        }
      },
    });
  });
}

function listBookings() {
  removeActiveClass();
  $("#sidebarBookings,#offcanvasBookings").addClass("activeTab");
  $("#mainDiv").load("./bookings.html", function () {
    const table = $("#bookingsTable");
    $.ajax({
      type: "get",
      url: "../api/listBookings.php",
      dataType: "json",
      success: function (response) {
        if (response.data.length == 0) {
          return;
        }
        table.text("");
        // $("#tableHead").append($("<th>").text("Action"));
        for (let i = 0; i < response.data.length; i++) {
          let tr = $("<tr>").append(
            $("<td>").text(i + 1),
            $("<td>").text(response.data[i].user_id),
            $("<td>").text(response.data[i].vehicle_id),
            $("<td>").text(response.data[i].booked_date),
            $("<td>").text(response.data[i].return_date),
            $("<td>").text(response.data[i].total_amount),
            $("<td>").html(
              `<button class="btn btn-info me-1" onclick="viewBookingDetails(${response.data[i].id})"><i class="bi bi-eye"></i></button><button class="btn btn-danger" onclick="deleteBookingDetails(${response.data[i].id})"><i class="bi bi-trash3"></i></button>`,
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
    listVehicles();
  });

  $(document).on("click", "#sidebarBookings,#offcanvasBookings", () => {
    listBookings();
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
    clearRegisterFormErrors();
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

  $(document).on("submit", "#vehicleForm", function (e) {
    clearVehicleFormErrors();
    let errorFlag = false;
    e.preventDefault();
    const form = document.getElementById("vehicleForm");
    const formData = new FormData(form);

    let brandName = formData.get("brand_name");
    let modelName = formData.get("model_name");
    let numberPlate = formData.get("number_plate");
    let price = formData.get("price");
    let photo = formData.get("photo");

    if (!brandName) {
      $("#brandNameError").removeClass("d-none");
      errorFlag = true;
    }
    if (!modelName) {
      $("#modelNameError").removeClass("d-none");
      errorFlag = true;
    }
    numberPlate = numberPlate.toUpperCase();
    if (!numberPlate || !numberPlateRegex.test(numberPlate)) {
      $("#numberPlateError").removeClass("d-none");
      errorFlag = true;
    }
    if (price <= 0) {
      $("#priceError").removeClass("d-none");
      errorFlag = true;
    }
    if (!photo) {
      $("#photoError").removeClass("d-none");
      errorFlag = true;
    }

    if (errorFlag) {
      return;
    }
    $.ajax({
      type: "post",
      url: "../api/addVehicle.php",
      data: formData,
      dataType: "json",
      processData: false,
      contentType: false,
      success: function (response) {
        console.log(response);
        if (response.status) {
          Swal.fire("Success", response.message, "success").then(() => {
            listVehicles();
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
      error: function (err) {
        console.log(err);
        Swal.fire({
          position: "top",
          icon: "warning",
          title: "error occures",
        });
      },
    });
  });
});
