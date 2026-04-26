<?php
require_once __DIR__ . "/../db/db.php";
require_once __DIR__ . "/../utils/functions.php";

class AuthControllers
{
    private $db = null;
    function __construct()
    {
        $this->db = new DB();
    }

    private function isAdmin($id)
    {
        $isAdmin = $this->db->query("SELECT 1 FROM users u INNER JOIN admins a ON u.id=a.admin_id WHERE u.id=:id")->get([":id" => $id]);
        return !empty($isAdmin);
    }

    public function register($firstName, $lastName, $email, $phone, $panNumber, $licenseNumber, $dob, $aadhar, $password)
    {
        $query = "SELECT * FROM users where email=:email or phone=:phone or pan_number=:panNumber or license_number=:licenseNumber or aadhar_number = :aadhar";
        $userExcist = $this->db->query($query)->get([
            ":email" => $email,
            ":phone" => $phone,
            ":panNumber" => $panNumber,
            ":licenseNumber" => $licenseNumber,
            ":aadhar" => $aadhar
        ]);
        if ($userExcist) {
            return sendResponse(false, "User Already Exists!!!");
        }
        $hashedPassword = md5($password);
        $insertUser = "INSERT INTO users (first_name,last_name,email,phone,pan_number,license_number,date_of_birth,aadhar_number,password) VALUES (:first_name,:last_name,:email,:phone,:panNumber,:licenseNumber,:date_of_birth,:aadhar,:password)";
        $this->db->query($insertUser)->execute([
            ":first_name" => $firstName,
            ":last_name" => $lastName,
            ":email" => $email,
            ":phone" => $phone,
            ":panNumber" => $panNumber,
            ":licenseNumber" => $licenseNumber,
            ":date_of_birth" => $dob,
            ":aadhar" => $aadhar,
            ":password" => $hashedPassword
        ]);
        return sendResponse(true, "Signed Up Successfully!!!");
    }

    public function login($email, $password)
    {
        $hashedPassword = md5($password);
        $query = "SELECT * FROM users where email=:email and password=:password";
        $userData = $this->db->query($query)->get([":email" => $email, ":password" => $hashedPassword]);
        if (!$userData) {
            return sendResponse(false, "Invalid Credentials!!");
        }
        $userId = $userData['id'];
        $userTokensQuery = "DELETE FROM user_tokens WHERE user_id=:id";
        $this->db->query($userTokensQuery)->execute([":id" => $userId]);

        $token = generateSecureToken(20);

        $insertQuery = "INSERT INTO user_tokens (user_id,token) VALUES (:user_id,:token)";
        $this->db->query($insertQuery)->execute([":user_id" => $userId, ":token" => $token]);

        $isAdmin = $this->isAdmin($userId);
        unset($userData['password']);
        $userData["token"] = $token;
        $userData["isAdmin"] = $isAdmin;
        return sendResponse(true, "Login Successful!!", [], $userData);
    }

    public function logout($token)
    {
        $query = "DELETE FROM user_tokens WHERE token=:token";
        $this->db->query($query)->execute([":token" => $token]);
        return sendResponse(false, "Logged Out!!");
    }

    public function validateToken($token)
    {
        $checkToken = "SELECT * FROM user_tokens WHERE token=:token AND expires_at > CURRENT_TIMESTAMP";
        $tokenExist = $this->db->query($checkToken)->get([":token" => $token]);
        if (!$tokenExist) {
            return $this->logout($token);
        }
        $query = "SELECT first_name,last_name,u.id FROM users u INNER JOIN user_tokens ut ON u.id=ut.user_id WHERE token=:token";
        $data = $this->db->query($query)->get([":token" => $token]);
        $userCount = $this->db->query("SELECT COUNT(*) AS total FROM users")->get();

        $userId = $data["id"];
        $isAdmin = $this->isAdmin($userId);

        if ($isAdmin) {
            $bookingDetails = $this->db->query("SELECT COUNT(*) AS total_count,SUM(total_amount) as revenue FROM bookings")->get();
        } else {
            $bookingDetails = $this->db->query("SELECT COUNT(*) AS total_count,SUM(total_amount) as revenue FROM bookings WHERE user_id=:id")->get([":id" => $userId]);
        }


        $data["userCount"] = $userCount["total"];
        $data["bookingsCount"] = $bookingDetails["total_count"];
        $data["total_revenue"] = $bookingDetails["revenue"];
        return sendResponse(true, "user details fetched successfully!!", [], $data);
    }

    public function listUsers()
    {
        $data = $this->db->query("SELECT u.id,first_name,last_name,email,phone,pan_number,license_number,aadhar_number FROM users u LEFT JOIN admins a ON u.id=a.admin_id WHERE a.admin_id IS NULL")->getAll();
        return sendResponse(true, "Users details fetched successfully!!", [], $data);
    }
    public function deleteUser($id)
    {
        $this->db->query("DELETE FROM users WHERE id=:id")->execute([":id" => $id]);
        return sendResponse(true, "Driver Deleted!!");
    }
}
