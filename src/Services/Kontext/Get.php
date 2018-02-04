<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../UserStories/Kontext/LoadKontext.php");
require_once("../../UserStories/Kontext/LoadRootKontexte.php");

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

$loadRootKontexte = new LoadRootKontexte();

if ($loadRootKontexte->run())
{
	echo json_encode($loadRootKontexte->getRootKontexte());
}
else
{
	echo json_encode($loadRootKontexte->getMessages());
}