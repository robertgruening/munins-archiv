<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../UserStories/Ort/LoadOrt.php");
require_once("../UserStories/Ort/LoadRootOrte.php");

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
		$loadOrt = new LoadOrt();
		$loadOrt->setId(intval($_GET["Id"]));

		if ($loadOrt->run())
		{
			echo json_encode($loadOrt->getOrt());
		}
		else
		{
            http_response_code(500);
			echo json_encode($loadOrt->getMessages());
		}
	}
	else
	{
		$loadRootOrte = new LoadRootOrte();

		if ($loadRootOrte->run())
		{
			echo json_encode($loadRootOrte->getRootOrte());
		}
		else
		{
            http_response_code(500);
			echo json_encode($loadRootOrte->getMessages());
		}
	}
}