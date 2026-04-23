<?php
require_once __DIR__ . "/controllers/AuthControllers.php";
$auth = new AuthControllers();
echo $auth->listUsers();
?>