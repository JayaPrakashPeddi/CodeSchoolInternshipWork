<?php
require_once __DIR__ . "/controllers/channelControllers.php";

$token = $_POST['userToken'];
$id = $_POST['id'];
$txtMsg = $_POST['textmsg'];
$is_media = false;

$channelControl = new channelControllers();
echo $channelControl->sendChannelMessage($token,$id,$txtMsg,$is_media);
