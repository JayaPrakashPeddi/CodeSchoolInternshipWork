<?php

require __DIR__ . "/../db/db.php";
require __DIR__ . "/../utils/functions.php";

class AuthController{
    private $db = NULL;

    function __construct(){
        $this->db = new DB();
    }
    
    // -----login-----
    public function login($email,$password){
        $hashedPassword = md5($password);
        $checkUserQuery = "SELECT * FROM users WHERE email=:email AND password = :password";
        $userDetails = $this->db->query($checkUserQuery)->getObject([":email"=>$email,":password"=>$hashedPassword]);
        if(!$userDetails){
            return sendResponse(false,"Invalid Credintials!!");
        }
        $token = generateSecureToken();
        $expireAt = date('Y-m-d H:i:s', strtotime('+60 minutes'));
        $insertQuery = "INSERT INTO user_tokens (token,user_id,expire_at) VALUES (:token,:user_id,:expire_at)";
        $this->db->query($insertQuery)->execute([
            ":token"=>$token,
            ":user_id"=>$userDetails['id'],
            ":expire_at"=>$expireAt
        ]);
        unset($userDetails['password']);
        $userDetails["token"]=$token;
        return sendResponse(true,"User details Fetched!!",$userDetails);
    }

    // -----register-----
    public function register($email, $password, $first_name, $last_name, $pan_number, $dob, $phone_number){
        $checkEmailQuery = "SELECT * FROM users WHERE email = :email OR phone_number = :phone_number ";
        $userDetails = $this->db->query($checkEmailQuery)->getObject([":email"=>$email,":phone_number"=>$phone_number]);
        if($userDetails){
            return sendResponse(false, "Email or Phone already registered");
        }
        $hashedPassword = md5($password);
        $message = "Validation successful!!";
        $data = [
                    "first_name" => $first_name,
                    "last_name" => $last_name,
                    "email" => $email,
                    "phone_number" => $phone_number,
                    "pan_number" => $pan_number,
                    "dob" => $dob,
                ];
        $insertQuery = "INSERT INTO users (first_name,last_name,email,phone_number,pan_number,date_of_birth,password) VALUES (:first_name,:last_name,:email,:phone_number,:pan_number,:dob,:password);";
        $this->db->query($insertQuery)->execute([
                ":first_name" => $first_name,
                ":last_name" => $last_name,
                ":email" => $email,
                ":phone_number" => $phone_number,
                ":pan_number" => $pan_number,
                ":dob" => $dob,
                ":password" => $hashedPassword
            ]);
        return sendResponse(true,$message,$data);
    }

    public function logout($token){
        $query = "DELETE FROM user_tokens WHERE token=:token";
        $this->db->query($query)->execute([":token"=>$token]);
        return sendResponse(true,"logged out successfully!!");
    }

    public function validateToken($token){
        $checkToken = "SELECT * FROM user_tokens WHERE token=:token";
        //  AND expire_at > NOW()
        $tokenExist = $this->db->query($checkToken)->getObject([":token"=>$token]);
        if(!$tokenExist){
            return sendResponse(false,"Invalid or Expired Token!!");
        }
        $query = "SELECT first_name,last_name,email,phone_number,pan_number,date_of_birth FROM users u INNER JOIN user_tokens ut ON u.id=ut.user_id WHERE token=:token";
        $userDetails = $this->db->query($query)->getObject([":token"=>$token]);
        return sendResponse(true,"user details fetched successfully!!",$userDetails);
    }
}
?>