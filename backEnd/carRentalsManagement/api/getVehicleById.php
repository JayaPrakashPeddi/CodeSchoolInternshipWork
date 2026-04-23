<?php
require_once __DIR__ . "/controllers/vehicleControllers.php";
$id = $_GET["id"];
$vehicleController = new vehicleControllers();
echo $vehicleController->getVehicleDetails($id);