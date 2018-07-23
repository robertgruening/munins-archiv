<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../UserStories/Fund/LoadFund.php");

if ($_SERVER["REQUEST_METHOD"] == "PUT")
{
    Create();
}
else if ($_SERVER["REQUEST_METHOD"] == "POST")
{
    Update();
}
else if ($_SERVER["REQUEST_METHOD"] == "DELETE")
{
    Delete();
}
else
{
    Get();
}

function Create()
{
    global $logger;
    $logger->error("PUT wird nicht unterstützt!");
    http_response_code(500);
    echo json_encode(array("PUT wird nicht unterstützt!"));
}

function Update()
{
    global $logger;
    $logger->error("POST wird nicht unterstützt!");
    http_response_code(500);
    echo json_encode(array("POST wird nicht unterstützt!"));
}

function Delete()
{
    global $logger;
    $logger->error("DELETE wird nicht unterstützt!");
    http_response_code(500);
    echo json_encode(array("DELETE wird nicht unterstützt!"));
}

function Get()
{
	global $logger;
	$logger->info("Fund-laden gestartet");
	
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
	
	$logger->info("Fund-laden beendet");
}
