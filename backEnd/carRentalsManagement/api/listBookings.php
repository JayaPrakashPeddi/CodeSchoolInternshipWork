<?php
require_once __DIR__ . "/controllers/BookingContrllers.php";

$bookingControllers = new BookingContrllers();
echo $bookingControllers->listBookings();
