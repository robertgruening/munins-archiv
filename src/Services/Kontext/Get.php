<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../UserStories/Kontext/LoadKontext.php");

if (isset($_GET["Id"]))
{
	$loadKontext = new LoadKontext();
	$loadKontext->setId(intval($_GET["Id"]));

	if ($loadKontext->run())
	{
		echo json_encode($loadKontext->getKontext());
	}
	else
	{
        echo json_encode($loadKontext->getMessages());
	}

	return;
}