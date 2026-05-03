<?php
require_once __DIR__ . "/controllers/channelControllers.php";

$channelName = $_POST['channelName'];
$token = $_POST['token'];
$file =  $_FILES['channelPhoto'];


$uploadTo = "../uploads/";
$fileName = time() . "_" . basename($file["name"]);
$target = $uploadTo . $fileName;

if (!move_uploaded_file($file["tmp_name"],$target)){
    die(sendResponse(false,"File not Uploaded!!"));
}

$channelController = new channelControllers();
echo $channelController->createChannel($channelName,$fileName,$token);