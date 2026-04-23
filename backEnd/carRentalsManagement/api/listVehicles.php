<?php
require_once __DIR__ . "/controllers/vehicleControllers.php";
$auth = new vehicleControllers();
echo $auth->listVehicles();
