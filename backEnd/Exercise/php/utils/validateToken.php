<?php
require_once __DIR__ . "/../controllers/AuthController.php";
echo $token;
header('Content-Type: application/json');

$token = $_POST['userToken'];
if(!$token){
    die(sendResponse(false,"Token Invalid!!"));
}

$auth = new AuthController();
echo $auth->validateToken($token);
?>