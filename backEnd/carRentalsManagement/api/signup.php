<?php
require_once __DIR__ . "/controllers/AuthControllers.php";
require_once __DIR__ . "/validations/formValidations.php";

$first_name=$_POST['first_name'];
$last_name=$_POST['last_name'];
$email=$_POST['email'];
$phone=$_POST['phone_number'];
$panNumber=$_POST['pan_number'];
$licenseNumber=$_POST['license_number'];
$dob=$_POST['dob'];
$aadhar=$_POST['aadhar'];
$password=$_POST['password'];
$conformPassword=$_POST['conformPassword'];

if (!registerFormValidation($first_name, $last_name, $email, $phone, $panNumber, $licenseNumber, $dob, $aadhar, $password, $conformPassword)){
    die(sendResponse(false,"Form Validations failed!"));
}

$auth = new AuthControllers();
echo $auth->register($first_name, $last_name, $email, $phone, $panNumber, $licenseNumber, $dob, $aadhar, $password);
?>