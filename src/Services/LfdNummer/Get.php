<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../UserStories/LfdNummer/LoadLfdNummer.php");
require_once("../../UserStories/LfdNummer/LoadLfdNummern.php");

if (isset($_GET["Id"]))
{
	$loadLfdNummer = new LoadLfdNummer();
	$loadLfdNummer->setId(intval($_GET["Id"]));

	if ($loadLfdNummer->run())
	{
		echo json_encode($loadLfdNummer->getLfdNummer());
	}
	else
	{
        echo json_encode($loadLfdNummer->getMessages());
	}

	return;
}

$loadLfdNummern = new LoadLfdNummern();

if ($loadLfdNummern->run())
{
	echo json_encode($loadLfdNummern->getLfdNummern());
}
else
{
	echo json_encode($loadLfdNummern->getMessages());
}