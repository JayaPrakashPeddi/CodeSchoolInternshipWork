<?php
require_once __DIR__ . "/controllers/channelControllers.php";

$file = $_FILES['image'];
$token = $_POST['userToken'];
$id = $_POST['group_id'];

if($file['error']){
    die(sendResponse(false,"file not uploaded"));
}
$filename = time() . "_" . $file['name'];
if(!move_uploaded_file($file['tmp_name'], "../uploads/" . $filename)){
    die(sendResponse(false,"failed to save the file"));
}

$is_media = true;
$channelControl = new channelControllers();
echo $channelControl->sendChannelMessage($token,$id,$filename,$is_media);
