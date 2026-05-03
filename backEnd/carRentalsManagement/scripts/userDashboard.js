const userToken = localStorage.getItem("userToken");
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

function removeActiveClass() {
  $("#sidebarDashboard,#offcanvasDashboard").removeClass("activeTab");
  $("#sidebarDrivers,#offcanvasDrivers").removeClass("activeTab");
  $("#sidebarVehicles,#offcanvasVehicles").removeClass("activeTab");
  $("#sidebarBookings,#offcanvasBookings").removeClass("activeTab");
}

function clearVehicleFormErrors() {
  $("#brandNameError").addClass("d-none");
  $("#modelNameError").addClass("d-none");
  $("#numberPlateError").addClass("d-none").text("");
  $("#priceError").addClass("d-none");
  $("#photoError").addClass("d-none");
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
      if (vehicle.is_available) {
        $("#mAvailable").text("Yes").addClass("text-success");
        $("#bookVechicleBtn").removeClass("disabled");
      } else {
        $("#mAvailable").text("No").addClass("text-danger");
        $("#bookVechicleBtn").addClass("disabled");
      }
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

function listVehicles() {
  removeActiveClass();
  $("#sidebarVehicles,#offcanvasVehicles").addClass("activeTab");

  $("#mainDiv").load("./listVehicles.html", function () {
    const container = $("#vehiclesContainer");
    container.empty();
    container.addClass("d-flex flex-wrap gap-3");
    $.ajax({
      type: "get",
      url: "../api/listVehicles.php",
      dataType: "json",
      success: function (response) {
        if (!response.data || response.data.length === 0) {
          container.append(`<p class="text-muted">No vehicles found</p>`);
          return;
        }
        for (let i = 0; i < response.data.length; i++) {
          let vehicle = response.data[i];
          let card = $("<div>")
            .addClass("card")
            .css({ width: "18rem" })
            .attr({ onclick: `viewVehicleDetails(${vehicle.id})` });
          let textMsg = "Available";
          let textClass = "text-success";
          if (!vehicle.is_available) {
            textMsg = "Not Available";
            textClass = "text-danger";
          }
          card.append(
            $("<img>")
              .addClass("card-img-top")
              .attr({ src: "./uploads/" + vehicle.photo, alt: "car_img" }),
            $("<div>")
              .addClass("card-body")
              .append(
                $("<h5>")
                  .addClass("card-title")
                  .text(vehicle.brand + " " + vehicle.model),
                $("<p>")
                  .addClass("card-text d-flex justify-content-between")
                  .html(
                    `<span>${vehicle.price_per_day} / day</span><span class="${textClass}">${textMsg}</span>`,
                  ),

                //   vehicle.is_available
                //   ? `<span class="text-success">Available</span>`
                //   : `<span class="text-danger">Not Available</span>`,
              ),
          );
          container.append(card);
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
        for (let i = 0; i < response.data.length; i++) {
          let tr = $("<tr>").append(
            $("<td>").text(i + 1),
            $("<td>").text(response.data[i].user_id),
            $("<td>").text(response.data[i].vehicle_id),
            $("<td>").text(response.data[i].booked_date),
            $("<td>").text(response.data[i].return_date),
            $("<td>").text(response.data[i].total_amount),
            $("<td>").html(
              `<button class="btn btn-info" onclick="viewBookingDetails(${response.data[i].id})"><i class="bi bi-eye"></i></button>`,
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

  $(document).on("click", "#bookVechicleBtn", function () {
    $("#bookingVehicleId").val(window.selectedVehicleId);
    const bookingModal = new bootstrap.Modal(
      document.getElementById("bookingModal"),
    );
    bookingModal.show();
  });

  $(document).on("click", "#confirmBookingBtn", function () {
    const vehicleId = $("#bookingVehicleId").val();
    const bookingDate = $("#bookingDate").val();
    const returnDate = $("#returnDate").val();

    $("#bookingError").addClass("d-none");

    if (!bookingDate || !returnDate) {
      $("#bookingError").text("Please select both dates").removeClass("d-none");
      return;
    }

    if (new Date(returnDate) <= new Date(bookingDate)) {
      $("#bookingError")
        .text("Return date must be after booking date")
        .removeClass("d-none");
      return;
    }

    $.ajax({
      type: "post",
      url: "../api/bookingCar.php",
      data: {
        vehicle_id: vehicleId,
        booking_date: bookingDate,
        return_date: returnDate,
        token: userToken,
      },
      dataType: "json",
      success: function (response) {
        if (response.status) {
          Swal.fire("Success", response.message, "success").then(() => {
            listBookings();
          });
        }
      },
      error: function () {
        Swal.fire("Error", "please try again later...", "error");
      },
    });
  });
});
