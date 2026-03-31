const token = localStorage.getItem("token");
if (token) {
  window.location.href = "../templates/home.html";
}

const username = document.getElementById("userName");
const password = document.getElementById("password");
const nameError = document.getElementById("userNameError");
const passError = document.getElementById("passwordError");
const invalidCreds = document.getElementById("invalidCreds");

const spinerIcon = document.getElementById("spinner");
const btnText = document.getElementById("btnText");
const loginBtn = document.getElementById("loginBtn");

function userAuth() {
  spinerIcon.classList.remove("d-none");
  btnText.classList.add("d-none");
  loginBtn.classList.add("disabled");

  function formValidations(username, password) {
    if (
      username.value.length >= 4 &&
      username.value.length <= 15 &&
      password.value.length >= 8 &&
      password.value.length <= 16
    ) {
      return true;
    }
    return false;
  }

  clearWarnings();
  if (formValidations(username, password)) {
    fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          warnings(1);
          return;
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data) {
          localStorage.setItem("token", data.accessToken);
          window.location.href = "../templates/home.html";
        }
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    spinerIcon.classList.add("d-none");
    btnText.classList.remove("d-none");
    loginBtn.classList.remove("disabled");
    warnings();
  }
}

function warnings(useCase = null) {
  spinerIcon.classList.add("d-none");
  btnText.classList.remove("d-none");
  loginBtn.classList.remove("disabled");
  if (useCase) {
    nameError.classList.remove("d-none");
    passError.classList.remove("d-none");
  } else {
    invalidCreds.classList.remove("d-none");
  }
  username.classList.add("is-invalid");
  password.classList.add("is-invalid");
}

function clearWarnings() {
  nameError.classList.add("d-none");
  passError.classList.add("d-none");
  invalidCreds.classList.add("d-none");
  username.classList.remove("is-invalid");
  password.classList.remove("is-invalid");
}
