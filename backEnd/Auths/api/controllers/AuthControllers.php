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

    function register($first_name, $last_name, $email, $phone, $photo, $password)
    {
        $userExist = $this->db->query("SELECT 1 FROM users WHERE email=:email or phone_number=:phone")->get([":email"=>$email,":phone"=>$phone]);
        if($userExist){
            return sendResponse(false,"User with this phone or email already exists!!");
        }
        $hashedPassword = md5($password);
        $this->db->query("INSERT INTO users (first_name,last_name,email,phone_number,photo,password) VALUES (:first_name,:last_name,:email,:phone_number,:photo,:password)")
            ->execute([":first_name" => $first_name, ":last_name" => $last_name, ":email" => $email, ":phone_number" => $phone, ":photo" => $photo, ":password" => $hashedPassword]);

        return sendResponse(true, "Registration Successfull");
    }

    function isUserExist($email, $phone)
    {
        if ($email) {
            $queryPart = "email=:param";
            $param = $email;
        } else if ($phone) {
            $queryPart = "phone_number=:param";
            $param = $phone;
        } else {
            return sendResponse(false, "Unable to get data with null params!!");
        }

        $userExist = $this->db->query("SELECT 1 FROM users WHERE " . $queryPart)->get([":param" => $param]);

        if (!$userExist) {
            return sendResponse(false, "No user exist");
        }
        return sendResponse(true, "user exists!!");
    }
}
