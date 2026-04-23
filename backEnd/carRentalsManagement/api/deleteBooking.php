<?php
require_once __DIR__ . "/controllers/BookingContrllers.php";

$id = $_POST["id"];
$bookingContorller = new BookingContrllers();
echo $bookingContorller->deleteBooking($id);