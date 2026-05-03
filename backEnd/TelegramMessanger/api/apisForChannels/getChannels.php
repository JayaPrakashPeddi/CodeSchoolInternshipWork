<?php
require_once __DIR__ . "/controllers/channelControllers.php";

$token = $_POST['userToken'];

$channelControl = new channelControllers();
echo $channelControl->getChannels($token);
