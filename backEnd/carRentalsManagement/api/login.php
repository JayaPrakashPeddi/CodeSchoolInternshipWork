<?php

require_once __DIR__ . "/controllers/AuthControllers.php";
require_once __DIR__ . "/utils/functions.php";
require_once __DIR__ . "/validations/formValidations.php";

$email = $_POST['email'];
$password = $_POST['password'];

if (!loginFormValidations($email,$password)){
    die(sendResponse(false,"Invalid Credentials!!"));
}

$auth = new AuthControllers();
echo $auth->login($email,$password);
?>