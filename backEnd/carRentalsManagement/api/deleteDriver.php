<?php
require_once __DIR__ . "/controllers/AuthControllers.php";

$id = $_POST["id"];
$auth = new AuthControllers();
echo $auth->deleteUser($id);
