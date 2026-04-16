<?php
require("./db/pdo.php");

function getResponse($status,$message,$data=Null){
$res = json_encode(
            [
                "status" => $status,
                "message" => $message,
                "data" => $data
            ]
        );
        return $res;      
}

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    getResponse(false, "POST method only");
}

$first_name = $_POST["first_name"];
$last_name = $_POST["last_name"];
$email = $_POST["email"];
$phone_number = $_POST["phone_number"];
$pan_number = $_POST["pan_number"];
$dob = $_POST["dob"];
$password = $_POST["password"];
$conformPassword=$_POST["conformPassword"];

$mailRegex = "/^[a-zA-Z0-9+-.#$]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/";
$panRegex = "/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/";

function validation($email, $password, $conformPassword, $first_name, $last_name, $pan_number, $dob, $phone_number, $mailRegex, $panRegex)
{
    if (strlen($first_name) < 4 || strlen($first_name) > 30) {
        echo "Invalid First Name";
        return false;
    }
    if (strlen($last_name) < 4 || strlen($last_name) > 30) {
        echo "Invalid Last Name";
        return false;
    }
    if (!preg_match($mailRegex, $email)) {
        echo "Invalid Email";
        return false;
    }
    if (strlen($phone_number) != 10 || !is_numeric($phone_number)) {
        echo "Invalid Phone Number";
        return false;
    }
    if (!preg_match($panRegex, $pan_number)) {
        echo "Invalid PAN Number";
        return false;
    }

    if (!$dob) {
        echo "Please select your date of birth";
        return false;
    }

    $today = new DateTime();
    $birthDate = new DateTime($dob);

    if ($birthDate > $today) {
        echo "DOB cannot be in the future";
        return false;
    }

    $age = $today->diff($birthDate)->y;

    if ($age < 18) {
        echo "You must be at least 18 years old";
        return false;
    }
    if (strlen($password) < 6 || strlen($password) > 20) {
        echo "Invalid Password";
        return false;
    }
    if ($password !== $conformPassword) {
        echo "Password Mismatched!!";
        return false;
    }
    return true;
}

//-----------------------------

$status = validation($email, $password, $conformPassword, $first_name, $last_name, $pan_number, $dob, $phone_number, $mailRegex, $panRegex);

if (!$status){
    $message = "Validation failed!!";
    die(getResponse($status,$message));
}

$pdo = getPDO();
$checkEmailQuery = "SELECT * FROM users WHERE email = :email OR phone_number = :phone_number ";
$statement = $pdo->prepare($checkEmailQuery);
$statement->bindParam(":email", $email);
$statement->bindParam(":phone_number", $phone_number);
$statement->execute();
$foundEmail = $statement->fetchObject();
if(!$foundEmail) {
    $hashedPassword = md5($password);
    $message = "Validation successful!!";
    $data = [
                "first_name" => $first_name,
                "last_name" => $last_name,
                "email" => $email,
                "phone_number" => $phone_number,
                "pan_number" => $pan_number,
                "dob" => $dob,
                "password" => $hashedPassword
            ];
    $insertQuery = "INSERT INTO users (first_name,last_name,email,phone_number,pan_number,date_of_birth,password) VALUES (:first_name,:last_name,:email,:phone_number,:pan_number,:dob,:password);";
    $statement = $pdo->prepare($insertQuery);
    $statement->execute([
    ":first_name" => $first_name,
    ":last_name" => $last_name,
    ":email" => $email,
    ":phone_number" => $phone_number,
    ":pan_number" => $pan_number,
    ":dob" => $dob,
    ":password" => $hashedPassword
]); 
    die(getResponse($status,$message,$data));
}
die(getResponse(false, "User Exists", $foundEmail));
?>