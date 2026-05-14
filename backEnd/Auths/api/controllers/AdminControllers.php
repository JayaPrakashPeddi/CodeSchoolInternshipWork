<?php
require_once __DIR__ . "/../db/db.php";
require_once __DIR__ . "/../utils/functions.php";

class AdminControllers
{
    private $db = null;
    function __construct()
    {
        $this->db = new DB();
    }

    public function clearExpiredToken()
    {
        return $this->db->query("UPDATE user_tokens SET status=false WHERE expires_at < current_timestamp")->execute();
    }


    private function isAdmin($token)
    {
        $this->clearExpiredToken();
        $isAdmin = $this->db->query("SELECT 1 FROM user_tokens ut INNER JOIN users u ON ut.user_id=u.id WHERE token=:token AND u.role='admin' AND u.status=true AND ut.status=true")->get([":token" => $token]);
        return $isAdmin;
    }

    public function validateAdmin($token)
    {
        $isAdmin = $this->isAdmin($token);
        if (!$isAdmin) {
            return sendResponse(false, "Unauthorized user!!");
        }
        $data['adminName'] = 'admin';
        return sendResponse(true, "Is an Admin", $data);
    }
}
