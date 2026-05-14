<?php
require_once __DIR__ . "/controllers/AdminControllers.php";
require_once __DIR__ . "/utils/functions.php";

$token = getTokenFromHeader();

if (!$token) {
    return sendResponse(false, "Invalid token!!");
}

$adminControl = new AdminControllers();
echo $adminControl->validateAdmin($token);
