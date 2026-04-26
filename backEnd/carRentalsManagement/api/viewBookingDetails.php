<?php
require_once __DIR__ . "/controllers/BookingContrllers.php";
$id = $_GET["id"];

$bookingController = new BookingContrllers();
echo $bookingController->getBookingDetails($id);