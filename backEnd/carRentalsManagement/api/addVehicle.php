<?php
require_once __DIR__ . "/controllers/vehicleControllers.php";
require_once __DIR__ . "/utils/functions.php";
require_once __DIR__ . "/validations/formValidations.php";

$brand = $_POST['brand_name'] ?? null;
$model = $_POST['model_name'] ?? null;
$numberPlate = $_POST['number_plate'] ?? null;
$price = $_POST['price'] ?? null;
$file = $_FILES['photo'] ?? null;

if (!$file || !validateVehicle($brand,$model,$numberPlate,$price)) {
    die(sendResponse(false,"Validation Error!!"));
}

$uploadTo = "../uploads/";
$fileName = time() . "_" . basename($file["name"]);
$target = $uploadTo . $fileName;

if (!move_uploaded_file($file["tmp_name"],$target)){
    die(sendResponse(false,"File not Uploaded!!"));
}

$vehicleController = new vehicleControllers();
echo $vehicleController->addVehicle($brand,$model,$numberPlate,$price,$fileName);

