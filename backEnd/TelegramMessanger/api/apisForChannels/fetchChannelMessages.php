<?php
require_once __DIR__ . "/controllers/channelControllers.php";

$group_id = $_POST['id'];
$token = $_POST['userToken'];

$channelControl = new channelControllers();
echo $channelControl->fetchChannelMessages($token,$group_id);