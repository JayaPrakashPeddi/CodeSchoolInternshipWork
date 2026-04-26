<?php
require_once __DIR__ . "/../db/db.php";
require_once __DIR__ . "/../utils/functions.php";

class BookingContrllers
{
    private $db = null;
    function __construct()
    {
        $this->db = new DB();
    }
    public function listBookings()
    {
        $data = $this->db->query("SELECT * FROM bookings")->getAll();
        return sendResponse(true, "booking details fetched!!", [], $data);
    }

    public function deleteBooking($id)
    {
        $this->db->query("DELETE FROM bookings WHERE id=:id")->execute([":id" => $id]);
        return sendResponse(true, "vehicle deleted!!");
    }

    public function bookingVehicle($vehicleId, $booking_date, $return_date, $userToken)
    {
        $days = (strtotime($return_date) - strtotime($booking_date)) / (60 * 60 * 24);

        $userData = $this->db->query("SELECT user_id FROM user_tokens WHERE token=:token")->get([":token" => $userToken]);
        $vehiclePrice = $this->db->query("SELECT price_per_day FROM vehicles WHERE id=:id")->get([":id" => $vehicleId]);

        $userId = $userData["user_id"];
        $price = $vehiclePrice['price_per_day'];
        $total_amount = $price * $days;

        $this->db->query("INSERT INTO bookings (user_id,vehicle_id,booked_date,return_date,total_amount) VALUES (:user_id,:vehicle_id,:booked_date,:return_date,:total_amount)")->execute([
            ":user_id" => $userId,
            ":vehicle_id" => $vehicleId,
            ":booked_date" => $booking_date,
            ":return_date" => $return_date,
            ":total_amount" => $total_amount
        ]);
        $this->db->query("UPDATE vehicles SET is_available=false WHERE id=:id")->execute([":id" => $vehicleId]);
        return sendResponse(true, "Booking successful!!");
    }

    public function getBookingDetails($id)
    {
        $bookingDetails = $this->db->query("SELECT concat(first_name,' ',last_name) as driver_name,license_number,concat(v.brand,' ',v.model) as vehicle_name,number_plate,booked_date,return_date,price_per_day,total_amount,photo FROM bookings b INNER JOIN vehicles v ON b.vehicle_id=v.id INNER JOIN users u ON b.user_id=u.id WHERE b.id=:id")->get([":id" => $id]);
        if (!$bookingDetails){
            return sendResponse(false,"No booking found!!");
        }
        return sendResponse(true,"booking details fetched!!",[],$bookingDetails);
    }
}
