const userToken = localStorage.getItem("userToken");
if (!userToken) {
  localStorage.removeItem("userToken");
  window.location.replace("./index.html");
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

function validateToken() {
  $.ajax({
    type: "GET",
    headers: setHeader(),
    url: "../api/validateToken.php",
    dataType: "json",
    success: function (response) {
      if (!response.status) {
        Swal.fire("Error", response.message, "warning").then(() => {
          logout();
          return;
        });
      }
      $("#navbarUsername").text(response.data["first_name"]);
    },
    error: function (err) {
      console.error(err);
      logout();
    },
  });
}

function darkMode(isDarkMode = localStorage.getItem("isDarkMode") === "true") {
  if (!isDarkMode) {
    $(".bg-black").removeClass("bg-black").addClass("bg-white");
    $(".text-white").removeClass("text-white").addClass("text-dark");
    $(".darkmode-hover")
      .removeClass("darkmode-hover")
      .addClass("lightmode-hover");
  } else {
    $(".bg-white").removeClass("bg-white").addClass("bg-black");
    $(".text-dark").removeClass("text-dark").addClass("text-white");
    $(".lightmode-hover")
      .removeClass("lightmode-hover")
      .addClass("darkmode-hover");
  }
  $("#darkModeSwitch").prop("checked", isDarkMode);
}

function removeActiveLink() {
  $(".active-link").removeClass("active-link");
}

$(document).ready(function () {
  validateToken();
  darkMode();

  $("#mainContainer").load("./templates/dashboard.html", () => {
    darkMode();
  });

  $("#logoutBtn").on("click", () => logout());

  $(document).on("click", "#darkModeSwitch", () => {
    if ($("#darkModeSwitch").is(":checked")) {
      localStorage.setItem("isDarkMode", true);
    } else {
      localStorage.setItem("isDarkMode", false);
    }
    darkMode();
  });

  $("#settingsBtn").on("click", () => {
    $("#mainContainer").load("./templates/settings.html", () => {
      darkMode();
    });
  });

  $("#homeLink,#offcanvasHomeLink").on("click", function () {
    removeActiveLink();
    $(this).addClass("active-link");
    $("#mainContainer").load("./templates/dashboard.html", () => {
      darkMode();
    });
  });

  $("#categoriesLink,#offcanvasCategoriesLink").on("click", function () {
    removeActiveLink();
    $(this).addClass("active-link");
    $("#mainContainer").load("./templates/categories.html", () => {
      darkMode();
    });
  });
});
