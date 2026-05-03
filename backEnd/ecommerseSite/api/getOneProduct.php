<?php
require_once __DIR__ . "/controllers/AdminControllers.php";

$id = $_GET['id'];

$adminControl = new AdminControllers();
echo $adminControl->getOneProduct($id);