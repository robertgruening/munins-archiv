<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../UserStories/FundAttribut/LoadFundAttribut.php");
require_once("../UserStories/FundAttribut/LoadRootFundAttribute.php");

if ($_SERVER["REQUEST_METHOD"] == "POST")
{
    Create();
}
else if ($_SERVER["REQUEST_METHOD"] == "PUT")
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
        $logger->info("Fundattribut-anhand-ID-laden gestartet");
		$loadFundAttribut = new LoadFundAttribut();
		$loadFundAttribut->setId(intval($_GET["Id"]));

		if ($loadFundAttribut->run())
		{
			echo json_encode($loadFundAttribut->getFundAttribut());
		}
		else
		{
            http_response_code(500);
			echo json_encode($loadFundAttribut->getMessages());
		}

        $logger->info("Fundattribut-anhand-ID-laden beendet");
	}
	else
	{
        $logger->info("Root-Fundattribute-laden gestartet");
		$loadRootFundAttribute = new LoadRootFundAttribute();

		if ($loadRootFundAttribute->run())
		{
			echo json_encode($loadRootFundAttribute->getRootFundAttribute());
		}
		else
		{
			http_response_code(500);
			echo json_encode($loadRootFundAttribute->getMessages());
		}

        $logger->info("Root-Fundattribute-laden beendet");
	}
}