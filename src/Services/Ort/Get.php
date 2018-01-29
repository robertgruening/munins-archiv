<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../UserStories/Ort/LoadOrt.php");

if (isset($_GET["Id"]))
{
	$loadOrt = new LoadOrt();
	$loadOrt->setId(intval($_GET["Id"]));

	if ($loadOrt->run())
	{
		echo json_encode($loadOrt->getOrt());
	}
	else
	{
        echo json_encode($loadOrt->getMessages());
	}

	return;
}