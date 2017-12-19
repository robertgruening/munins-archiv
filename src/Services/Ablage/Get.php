<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../UserStories/Ablage/LoadAblage.php");
require_once("../../UserStories/Ablage/LoadRootAblagen.php");

if (isset($_GET["Id"]))
{
	$loadAblage = new LoadAblage();
	$loadAblage->setId(intval($_GET["Id"]));

	if ($loadAblage->run())
	{
		echo json_encode($loadAblage->getAblage());
	}
	else
	{
        echo json_encode($loadAblage->getMessages());
	}

	return;
}

$loadRootAblagen = new LoadRootAblagen();

if ($loadRootAblagen->run())
{
	echo json_encode($loadRootAblagen->getRootAblagen());
}
else
{
	echo json_encode($loadRootAblagen->getMessages());
}