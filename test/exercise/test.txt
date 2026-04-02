let data = {}
let formFields = [
    {
        id: "first-name",
        label: "First Name",
        rules: ["required"],
        key: "firstName"
    },
    {
        id: "last-name",
        label: "Last Name",
        rules: ["required"],
        key: "lastName"
    },
    {
        id: "email",
        label: "Email",
        rules: ["required", "regex:^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"],
        key: "email"
    },
    {
        id: "phone-number",
        label: "Phone Number",
        rules: ["required", "min:10", "max:10"],
        key: "phone"
    },
    {
        id: "registered-state",
        label: "Registered state",
        rules: ["required"],
        key: "state"
    },
    {
        id: "gender",
        label: "Gender",
        rules: ["required"],
        key: "gender"
    },
    {
        id: "state",
        label: "State",
        rules: ["required"],
        key: "stateCode"
    },
    {
        id: "company-name",
        label: "Company Name",
        rules: ["required"],
        key: "company"
    },
    {
        id: "address",
        label: "Address",
        rules: ["required"],
        key: "address"
    },
    {
        id: "zip",
        label: "Zip",
        rules: ["required"],
        key: "postalCode"
    },
    {
        id: "password",
        label: "Password",
        rules: ["required"],
        key: "password"
    },
    {
        id: "confirm-password",
        label: "Confirm Password",
        rules: ["required"]
    },

]

function validateFormField(field) {
    let element = $(`#${field.id}`)
    let errorElement = $(`#${field.id} + p`)
    let value = $(`#${field.id}`).val()
    data[field.key] = value

    for (let rule of field.rules) {
        if (rule == "required") {
            if (!value.trim() || value.length == 0) {
                errorElement.text(`${field.label} is required`)
                element.addClass("is-invalid")
                errorElement.addClass("invalid-feedback")

                return false
            }
        }
        if (rule.includes("regex")) {
            let pattern = new RegExp(rule.split(":")[1])
            if (!pattern.test(value)) {
                errorElement.text(`Enter valid ${field.label}`)
                element.addClass("is-invalid")
                errorElement.addClass("invalid-feedback")
                return false
            }
        }
        if (rule.includes("min")) {
            let minLength = rule.split(":")[1]
            if (value.length < minLength) {
                errorElement.text(`Enter at least ${minLength} characters`)
                element.addClass("is-invalid")
                errorElement.addClass("invalid-feedback")
                return false
            }
        }
        if (rule.includes("max")) {
            let maxLength = rule.split(":")[1]
            if (value.length > maxLength) {
                errorElement.text(`Length should not exceed ${maxLength} characters`)
                element.addClass("is-invalid")
                errorElement.addClass("invalid-feedback")
                return false
            }
        }

    }
    errorElement.text("")
    element.removeClass("is-invalid")
    element.addClass("is-valid")
    errorElement.removeClass("invalid-feedback")
    return true
}

function validateForm() {
    let status = true
    for (field of formFields) {
        status = validateFormField(field) && status
    }
    return status
}

$(document).ready(function () {
    $.ajax({
        url: 'https://dummyjson.com/quotes/random',
        type: "GET",
        dataType: "json",
        success: function (response) {
            let quote = response.quote
            $("#random-quote").text(quote)
        },
        error: function (error) {
            $("#random-quote").text(error.responseJSON.message)
        }
    })
    let strength = 0
    $("#password").on("input", function () {
        strength = 0
        $(".strength-meter").removeClass("border-success")
        let value = $(this).val()
        if (value.length >= 6) {
            strength += 2
            $("#validate-length > span").html(`<i class="fa-solid fa-circle-check text-success"></i>`)
        }
        else {
            $("#validate-length > span").html(`<i class="fa-solid fa-circle-xmark text-danger"></i>`)
        }
        if (/\d/.test(value)) {
            strength += 2
            $("#validate-number > span").html(`<i class="fa-solid fa-circle-check text-success"></i>`)
        }
        else {
            $("#validate-number > span").html(`<i class="fa-solid fa-circle-xmark text-danger"></i>`)
        }
        if (/[A-Z]/.test(value)) {
            strength += 2
            $("#validate-uppercase > span").html(`<i class="fa-solid fa-circle-check text-success"></i>`)
        }
        else {
            $("#validate-uppercase > span").html(`<i class="fa-solid fa-circle-xmark text-danger"></i>`)
        }
        let strengthFields = $(".strength-meter").slice(0, strength)
        strengthFields.addClass("border-success")
    })
    $("#register").click(function (e) {
        e.preventDefault()


        if (validateForm()) {
            if (strength < 6) {
                $("#password + p").text("Enter Valid Password")
                $("#password + p").addClass("invalid-feedback")
                $("#password").addClass("is-invalid")
                return
            }
            else {
                $("#password + p").text("")
                $("#password + p").removeClass("invalid-feedback")
                $("#password").removeClass("is-invalid")
                $("#password").addClass("is-valid")
            }
            if ($("#password").val() !== $("#confirm-password").val()) {
                $("#confirm-password + p").text("Passwords doesn't match")
                $("#confirm-password").addClass("is-invalid")
                $("#confirm-password + p").addClass("invalid-feedback")
                return
            }
            else {
                $("#confirm-password + p").text("")
                $("#confirm-password").removeClass("is-invalid")
                $("#confirm-password").addClass("is-valid")
                $("#confirm-password + p").removeClass("invalid-feedback")
            }
            if (!($("#terms-and-conditions").is(":checked"))) {
               Swal.fire({
                title:"Warning",
                icon:"warning",
                text:"Please Agree to terms and conditions to continue"
               })
                return
            }
            else {
                $.ajax({
                    url: 'https://dummyjson.com/users/add',
                    type: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(data),
                    success: function (response) {
                        Swal.fire({
                            title: "Success",
                            icon: "success",
                            text: "Registered Successfully"
                        })
                    },
                    error: function (error) {
                        Swal.fire({
                            title: "Error",
                            icon: "error",
                            text: error.responseJSON.message
                        })
                    }
                })
             
            }

        }
    })
})