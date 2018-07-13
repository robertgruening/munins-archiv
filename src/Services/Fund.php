<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../UserStories/Fund/LoadFund.php");

if ($_SERVER["REQUEST_METHOD"] == "PUT")
{
    //Create();
}
else if ($_SERVER["REQUEST_METHOD"] == "POST")
{
    //Update();
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
	global $logger;
	$logger->info("Service Fund-laden gestartet");
	
	if (isset($_GET["Id"]))
	{		
		$loadFund = new LoadFund();
		$loadFund->setId(intval($_GET["Id"]));

		if ($loadFund->run())
		{
			echo json_encode($loadFund->getFund());
		}
		else
		{
			http_response_code(500);
			echo json_encode($loadFund->getMessages());
		}		
	}
	else
	{
		http_response_code(500);
		echo json_encode(array("Es wurde keine ID übergeben!"));
		$logger->warn("Es wurde keine ID übergeben!");
	}
	
	$logger->info("Service Fund-laden beendet");
}
