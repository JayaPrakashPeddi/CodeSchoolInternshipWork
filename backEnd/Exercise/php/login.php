<?php
require_once("./validations/formValidations.php");
require_once __DIR__ . '/controllers/AuthController.php';

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    die(sendResponse(false, "POST method only"));
}

$email = $_POST["email"];
$password = $_POST["password"];

$status=loginFormValidations($email,$password);

if (!$status){
    $message = "Invalid Credintials!";
    die(sendResponse(false,$message));
}

$auth = new AuthController();
echo $auth->login($email,$password);
?> 