<?php
require_once __DIR__ . "/controllers/vehicleControllers.php";

$id = $_POST["id"];

$vehicleController = new vehicleControllers();
echo $vehicleController->deleteVehicle($id);
