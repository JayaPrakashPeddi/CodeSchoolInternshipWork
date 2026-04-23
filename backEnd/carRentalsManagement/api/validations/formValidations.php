<?php
function loginFormValidations($email, $password) {
    return (
        strlen($email) >= 4 &&
        strlen($email) <= 50 &&
        strlen($password) >= 8 &&
        strlen($password) <= 16
    );
}

function registerFormValidation($first_name, $last_name, $email, $phone, $panNumber, $licenseNumber, $dob, $aadhar, $password, $conformPassword)
{
    $mailRegex = "/^[a-zA-Z0-9+-.#$]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/";
    $licenseRegex = "/^[A-Z]{2}[0-9]{2}[-\s]?[0-9]{4}[0-9]{7}$/";
    $panRegex = "/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/";

    if (strlen($first_name) < 4 || strlen($first_name) > 30) {
        echo "Invalid First Name";
        return false;
    }
    if (strlen($last_name) < 4 || strlen($last_name) > 30) {
        echo "Invalid Last Name";
        return false;
    }
    if (!preg_match($mailRegex, $email)) {
        echo "Invalid Email";
        return false;
    }
    if (strlen($phone) != 10 || !is_numeric($phone)) {
        echo "Invalid Phone Number";
        return false;
    }
    if (strlen($aadhar) != 12 || !is_numeric($aadhar)) {
        echo "Invalid aadhar Number";
        return false;
    }
    if (!preg_match($panRegex, $panNumber)) {
        echo "Invalid PAN Number";
        return false;
    }
    if (!preg_match($licenseRegex, $licenseNumber)) {
        echo "Invalid license Number";
        return false;
    }

    if (!$dob) {
        echo "Please select your date of birth";
        return false;
    }

    $today = new DateTime();
    $birthDate = new DateTime($dob);

    if ($birthDate > $today) {
        echo "DOB cannot be in the future";
        return false;
    }

    $age = $today->diff($birthDate)->y;

    if ($age < 18) {
        echo "You must be at least 18 years old";
        return false;
    }
    if (strlen($password) < 6 || strlen($password) > 20) {
        echo "Invalid Password";
        return false;
    }
    if ($password !== $conformPassword) {
        echo "Password Mismatched!!";
        return false;
    }
    return true;
}

?>