<?php
require_once __DIR__ . "/controllers/AdminControllers.php";
require_once __DIR__ . "/utils/functions.php";

$adminControl = new AdminControllers();
echo $adminControl->getCategories();