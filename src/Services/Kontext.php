<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../UserStories/Kontext/LoadKontext.php");
require_once("../UserStories/Kontext/LoadRootKontexte.php");

if ($_SERVER["REQUEST_METHOD"] == "PUT" ||
    $_SERVER["REQUEST_METHOD"] == "POST")
{
    //Save();
}
else if ($_SERVER["REQUEST_METHOD"] == "DELETE")
{
    //Delete();
}
else
{
    Get();
}

function Get()
{
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
            http_response_code(500);
			echo json_encode($loadKontext->getMessages());
		}
	}
	else
	{
		$loadRootKontexte = new LoadRootKontexte();

		if ($loadRootKontexte->run())
		{
			echo json_encode($loadRootKontexte->getRootKontexte());
		}
		else
		{
            http_response_code(500);
			echo json_encode($loadRootKontexte->getMessages());
		}
	}
}