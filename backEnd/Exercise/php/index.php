<?php
require_once("./validations/formValidations.php");
require_once __DIR__ . '/controllers/AuthController.php';

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    die(sendResponse(false, "POST method only"));
}

$first_name = $_POST["first_name"];
$last_name = $_POST["last_name"];
$email = $_POST["email"];
$phone_number = $_POST["phone_number"];
$pan_number = $_POST["pan_number"];
$dob = $_POST["dob"];
$password = $_POST["password"];
$conformPassword=$_POST["conformPassword"];

$status = registerFormValidation($email, $password, $conformPassword, $first_name, $last_name, $pan_number, $dob, $phone_number);

if (!$status){
    $message = "Validation failed!!";
    die(sendResponse(false,$message));
}

$auth = new AuthController();
echo $auth->register($email, $password, $first_name, $last_name, $pan_number, $dob, $phone_number);
?>