<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../UserStories/Ort/LoadOrt.php");
require_once("../UserStories/Ort/LoadRootOrte.php");

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

	if (isset($_GET["Id"]))
	{
		$logger->info("Ort-anhand-ID-laden gestartet");	
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

		$logger->info("Ort-anhand-ID-laden beendet");
	}
	else
	{
        $logger->info("Root-Orte-laden gestartet");
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

        $logger->info("Root-Orte-laden beendet");
	}
}