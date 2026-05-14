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

    private function clearPreviousEmailsAndOtps($token)
    {
        $this->db->query("UPDATE temp_tokens SET status=false WHERE token = :token AND expires_at <= CURRENT_TIMESTAMP")->execute([":token" => $token]);
        $session = $this->db->query("SELECT email FROM temp_tokens WHERE token = :token")->get([":token" => $token]);
        $email = $session['email'];
        $this->db->query("UPDATE otps SET status=false WHERE email=:email AND otp_expires_at <= CURRENT_TIMESTAMP")->execute([":email" => $email]);
    }

    public function clearExpiredToken()
    {
        return $this->db->query("UPDATE user_tokens SET status=false WHERE expires_at < current_timestamp")->execute();
    }

    public function login($email, $password, $rememberMe)
    {
        $hashedPassword = md5($password);
        $user = $this->db->query("SELECT id,role FROM users WHERE email=:email AND password=:password AND status=true")->get([":email" => $email, ":password" => $hashedPassword]);
        if (empty($user)) {
            return sendResponse(false, "Invalid Email or Password!!");
        }
        $token = generateUserToken();
        $this->db->query("INSERT INTO user_tokens (user_id,token) VALUES (:id,:token)")->execute([":id" => $user['id'], ":token" => $token]);

        if ($rememberMe){
            $this->db->query("UPDATE user_tokens SET expires_at = current_timestamp + interval '15 days' WHERE token=:token")->execute([":token"=>$token]);
        }

        $isAdmin = false;
        if (strtoupper($user['role']) === "ADMIN") {
            $isAdmin = true;
        }
        return sendResponse(true, "Login successful!!", ["token" => $token, "isAdmin" => $isAdmin]);
    }

    public function register($first_name, $last_name, $email, $phone, $photo, $password)
    {
        $userExist = $this->db->query("SELECT 1 FROM users WHERE email=:email or phone_number=:phone")->get([":email" => $email, ":phone" => $phone]);
        if ($userExist) {
            return sendResponse(false, "User with this phone or email already exists!!");
        }
        $hashedPassword = md5($password);
        $this->db->query("INSERT INTO users (first_name,last_name,email,phone_number,photo,password) VALUES (:first_name,:last_name,:email,:phone_number,:photo,:password)")
            ->execute([":first_name" => $first_name, ":last_name" => $last_name, ":email" => $email, ":phone_number" => $phone, ":photo" => $photo, ":password" => $hashedPassword]);

        return sendResponse(true, "Registration Successfull");
    }

    public function isUserExist($email, $phone)
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

    public function getOTP($email)
    {
        $emailExist = $this->db->query("SELECT 1 FROM users WHERE email=:email AND status = true")->get([":email" => $email]);
        if (!$emailExist) {
            return sendResponse(false, "No user exist!!");
        }
        $otp = rand(100000, 999999);
        $temp_token = generateUserToken();
        $this->db->query("INSERT INTO temp_tokens (email,token) VALUES (:email,:token)")->execute([":email" => $email, ":token" => $temp_token]);
        $this->db->query("INSERT INTO otps (email,otp) VALUES (:email,:otp)")->execute([":email" => $email, ":otp" => $otp]);
        $data['otp'] = $otp;
        $data['temp_token'] = $temp_token;
        return sendResponse(true, "otp generated", $data);
    }

    public function resendOTP($temp_token)
    {
        $this->db->query("UPDATE temp_tokens SET status=false WHERE expires_at < CURRENT_TIMESTAMP")->execute();

        $session = $this->db->query("SELECT email FROM temp_tokens WHERE token = :token AND expires_at > CURRENT_TIMESTAMP")
            ->get([
                ":token" => $temp_token
            ]);

        if (!$session) {
            return sendResponse(false, "Session Expired!!", $session);
        }

        $email = $session['email'];
        $otp = rand(100000, 999999);

        $this->db->query("UPDATE otps SET status=false WHERE email = :email")->execute([":email" => $email]);
        $this->db->query("INSERT INTO otps (email, otp) VALUES (:email, :otp)")->execute([":email" => $email, ":otp" => $otp]);
        return sendResponse(true, "OTP resent successfully", ["otp" => $otp]);
    }

    public function verifyOtp($token, $otp)
    {
        $this->clearPreviousEmailsAndOtps($token);
        $session = $this->db->query("SELECT email FROM temp_tokens WHERE token = :token AND expires_at > CURRENT_TIMESTAMP")
            ->get([
                ":token" => $token
            ]);
        $email = $session['email'];
        $validOtp = $this->db->query("SELECT 1 FROM otps WHERE email=:email AND otp=:otp AND otp_expires_at > CURRENT_TIMESTAMP")->get([":email" => $email, ":otp" => $otp]);
        if (!$validOtp) {
            return sendResponse(false, "Invalid OTP!!");
        }
        return sendResponse(true, "OTP verified!!");
    }

    public function resetPassword($token, $password)
    {
        $this->clearPreviousEmailsAndOtps($token);
        $session = $this->db->query("SELECT email FROM temp_tokens WHERE token = :token AND expires_at > CURRENT_TIMESTAMP")
            ->get([
                ":token" => $token
            ]);
        if (!$session) {
            return sendResponse(false, "Session expired!!");
        }
        $email = $session['email'];
        $hashedPassword = md5($password);
        $this->db->query("UPDATE users SET password=:hashedPassword WHERE email=:email AND status=true")->execute([":email" => $email, ":hashedPassword" => $hashedPassword]);
        return sendResponse(true, "Password reset successful!!");
    }

    public function validateToken($token)
    {
        $isValid = $this->db->query("SELECT 1 FROM user_tokens WHERE token=:token AND expires_at > current_timestamp")->get([":token" => $token]);
        if (!$isValid) {
            return sendResponse(false, "Expired Token!!");
        }
        return sendResponse(true, "Valid Token!!!");
    }

    public function logout($token) {
        $this->db->query("UPDATE user_tokens SET status=false WHERE token=:token")->execute([":token"=>$token]);
        return sendResponse(true, "Successfully logged out!!");
    }
}
