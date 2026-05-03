<?php
require_once __DIR__ . "/../db/db.php";
require_once __DIR__ . "/../utils/functions.php";

class channelControllers
{
    private $db = null;
    function __construct()
    {
        $this->db = new DB();
    }

    private function validateToken($token)
    {
        return $this->db->query("SELECT 1 FROM user_tokens WHERE token=:token AND expires_at>CURRENT_TIMESTAMP AND status=TRUE")->get([":token" => $token]);
    }

    private function getUserIdByToken($token)
    {
        $userData = $this->db->query("SELECT user_id FROM user_tokens WHERE token=:token AND expires_at>CURRENT_TIMESTAMP AND status=TRUE")->get([":token" => $token]);
        $userId = $userData['user_id'];
        return $userId;
    }

    public function createChannel($name, $photo, $token)
    {
        $userId = $this->getUserIdByToken($token);
        $this->db->query("INSERT INTO groups (group_name,group_image,admin_id) VALUES (:name,:photo,:id)")->execute([":name" => $name, "photo" => $photo, ":id" => $userId]);
        $groupDtls = $this->db->query("SELECT id FROM groups WHERE admin_id=:id ORDER BY created_at DESC")->get([":id"=>$userId]);
        $group_id = $groupDtls['id'];
        $this->db->query("INSERT INTO group_members (group_id,member_id) VALUES (:group_id,:member_id)")->execute([":group_id"=>$group_id,":member_id"=>$userId]);
        return sendResponse(true, "channel created");
    }
    public function getChannels($token)
    {
        $userId = $this->getUserIdByToken($token);
        $groups = $this->db->query("SELECT DISTINCT g.id,g.group_name, g.group_image,members_count FROM groups g LEFT JOIN group_members gm ON g.id = gm.group_id WHERE g.admin_id = :id OR (gm.member_id = :id AND gm.status = TRUE)")->getAll([":id" => $userId]);
        return sendResponse(true, "Channels fetched successfully!!", $groups);
    }
    public function getGroupData($id){
        $groupData = $this->db->query("SELECT id,group_name,group_image,members_count FROM groups WHERE id=:id")->get([":id"=>$id]);
        return sendResponse(true,"Channel Info fetched!!",$groupData);
    }
    public function sendChannelMessage($token,$group_id,$textmsg,$is_media){
        $userId = $this->getUserIdByToken($token);
        $is_media = (bool) $is_media;
        $this->db->query("INSERT INTO group_messages (group_id,group_member_id,message,is_media) VALUES (:id,:user_id,:msg,:is_media)")->execute([":id"=>$group_id,":user_id"=>$userId,":msg"=>$textmsg,":is_media"=> $is_media ? 'true' : 'false']);
        return sendResponse(true,"Message sent!!");
    }
    public function fetchChannelMessages($token,$group_id){
        //
        return null;
    }

}
