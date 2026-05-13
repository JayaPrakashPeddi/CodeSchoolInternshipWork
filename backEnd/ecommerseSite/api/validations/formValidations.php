<?php

define("EMAIL_REGEX", "/^[a-zA-Z0-9.$#]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/");

function loginFormValidations($email, $password)
{
    $errors = [];
    if (!preg_match(EMAIL_REGEX, $email)) {
        $errors['emailInputError'] = "Invalid email!!";
    }
    if (strlen($password) < 6 && strlen($password) > 20) {
        $errors['passwordInputError'] = "Invalid Password";
    }
    if (!empty($errors)) {
        return [
            "status" => false,
            "errors" => $errors
        ];
    }
    return [
        "status" => true
    ];
}
function registerFormValidations($firstName, $lastName, $email, $phone, $password, $confirmPassword)
{
    $nameRegex = "/^[A-Za-z]{4,30}$/";
    $phoneRegex = "/^[6-9]\d{9}$/";
    $errors = [];
    if (!preg_match($nameRegex, $firstName)) {
        $errors['firstNameInputError'] = "Invalid first name";
    }
    if (!preg_match($nameRegex, $lastName)) {
        $errors['lastNameInputError'] = "Invalid last name";
    }
    if (!preg_match(EMAIL_REGEX, $email)) {
        $errors['registerEmailError'] = "Invalid email";
    }
    if (!preg_match($phoneRegex, $phone)) {
        $errors['phoneInputError'] = "Phone number must be 10 digits";
    }
    if (strlen($password) < 6 || strlen($password) > 20) {
        $errors['registerPasswordError'] = "Password must be between 6 and 20 characters";
    }
    if ($password !== $confirmPassword) {
        $errors['confirmPasswordError'] = "Passwords do not match";
    }

    if (!empty($errors)) {
        return [
            "status" => false,
            "errors" => $errors
        ];
    }

    return [
        "status" => true
    ];
}
