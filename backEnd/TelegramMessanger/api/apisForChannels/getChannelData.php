<?php
require_once __DIR__ . "/controllers/channelControllers.php";

$group_id = $_POST['group_id'];

$channelControl = new channelControllers();
echo $channelControl->getGroupData($group_id);