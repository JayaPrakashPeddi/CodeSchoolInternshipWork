<?php
require_once __DIR__ . "/controllers/BookingContrllers.php";

$vehicle_id = $_POST["vehicle_id"];
$booking_date = $_POST["booking_date"];
$return_date = $_POST["return_date"];
$userToken = $_POST["token"];

$bookingController = new BookingContrllers();
echo $bookingController->bookingVehicle($vehicle_id,$booking_date,$return_date,$userToken);