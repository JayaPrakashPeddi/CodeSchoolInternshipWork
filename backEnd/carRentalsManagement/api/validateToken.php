<?php
require_once __DIR__ . "/controllers/AuthControllers.php";
header('Content-Type: application/json');

$token = $_POST['userToken'] ?? null;
$logout = $_POST['isLogout'] ?? 0;

if (!$token) {
    die(sendResponse(false, "Token Invalid!!"));
}

$auth = new AuthControllers();
if ($logout) {
    echo $auth->logout($token);
    exit();
}

echo $auth->validateToken($token);
?>