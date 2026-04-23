// const token = localStorage.getItem("userToken");
// if (token) {
//   window.location.href = "../dashboard.html";
// }

// const mailRegex = /^[a-zA-Z0-9+-.#$]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
// const licenseRegex = /^[A-Z]{2}[0-9]{2}[-\s]?[0-9]{4}[0-9]{7}$/;
// const panRegex = /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/;

// $(document).ready(function () {


//   $("#registerBtn").click(function (e) {
//     clearErrors();
//     errorFlag = false;
//     e.preventDefault();
//     let firstName = $("#firstName");
//     let lastName = $("#lastName");
//     let email = $("#email");
//     let number = $("#phone");
//     let panNumber = $("#panNumber");
//     let licenseNumber = $("#licenseNumber");
//     let dob = $("#dob");
//     let aadhar = $("#aadhar");
//     let password = $("#password");
//     let conformPassword = $("#conformPassword");

//     if (firstName.val().length < 4 || firstName.val().length > 30) {
//       $("#firstNameError").removeClass("d-none");
//       errorFlag = true;
//     }

//     if (lastName.val().length < 4 || lastName.val().length > 30) {
//       $("#lastNameError").removeClass("d-none");
//       errorFlag = true;
//     }

//     if (!mailRegex.test(email.val())) {
//       $("#emailError").removeClass("d-none");
//       errorFlag = true;
//     }

//     if (number.val().length !== 10 || isNaN(number.val())) {
//       $("#phoneError").removeClass("d-none");
//       errorFlag = true;
//     }

//     if (!panRegex.test(panNumber.val())) {
//       $("#panNumberError").removeClass("d-none");
//       errorFlag = true;
//     }

//     if (!licenseRegex.test(licenseNumber.val())) {
//       $("#licenseNumberError").removeClass("d-none");
//       errorFlag=true;
//     }

//     function dobValidation(){
//     if (!dob.val()) {
//       $("#dobError")
//         .text("Please select your date of birth")
//         .removeClass("d-none");
//       errorFlag = true;
//       return;
//     }

//     let today = new Date();
//     let birthDate = new Date(dob.val());

//     if (birthDate > today) {
//       $("#dobError").text("DOB cannot be in the future").removeClass("d-none");
//       errorFlag = true;
//       return
//     }

//     let age = today.getFullYear() - birthDate.getFullYear();
//     let monthDiff = today.getMonth() - birthDate.getMonth();

//     if (
//       monthDiff < 0 ||
//       (monthDiff === 0 && today.getDate() < birthDate.getDate())
//     ) {
//       age--;
//     }

//     if (age < 18) {
//       $("#dobError")
//         .text("You must be at least 18 years old")
//         .removeClass("d-none");
//         errorFlag = true;
//         return;
//     }
//     }
//     dobValidation();

//     if (aadhar.val().length !== 12 || isNaN(number.val())) {
//       $("#aadharError").removeClass("d-none");
//       errorFlag = true;
//     }

//     if (password.val().length < 6 || password.val().length > 20) {
//       $("#passwordError").removeClass("d-none");
//       errorFlag = true;
//     }

//     if (password.val() !== conformPassword.val()) {
//       $("#conformPasswordError").removeClass("d-none");
//       errorFlag = true;
//     }

//     if (errorFlag){
//       return;
//     }
//     $.ajax({
//       type: "POST",
//       url: "../api/signup.php",
//       dataType: "json",
//       data: {
//         first_name: firstName.val(),
//         last_name: lastName.val(),
//         email: email.val(),
//         phone_number: number.val(),
//         pan_number: panNumber.val(),
//         license_number: licenseNumber.val(),
//         dob: dob.val(),
//         aadhar: aadhar.val(),
//         password: password.val(),
//         conformPassword: conformPassword.val(),
//       },
//       success: function (response) {
//         console.log(response);
//         if (response.status) {
//           window.location.href = "/index.html?signedup=true";
//         } else {
//           Swal.fire({
//             position: "top",
//             icon: "warning",
//             title: response.message,
//             showConfirmButton: false,
//           });
//         }
//       },
//       error: function (error) {
//         console.log(error);
//       },
//     });
//   });


// });

// function clearErrors() {
//   $("#firstNameError").addClass("d-none");
//   $("#lastNameError").addClass("d-none");
//   $("#emailError").addClass("d-none");
//   $("#phoneError").addClass("d-none");
//   $("#panNumberError").addClass("d-none");
//   $("#licenseNumberError").addClass("d-none");
//   $("#dobError").addClass("d-none").text("");
//   $("#aadharError").addClass("d-none");
//   $("#passwordError").addClass("d-none");
//   $("#conformPasswordError").addClass("d-none");
// }
