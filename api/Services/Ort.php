<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../Factory/OrtFactory.php");
require_once("../UserStories/LoadEntites.php");
require_once("../UserStories/Ort/LoadOrt.php");
require_once("../UserStories/Ort/SaveOrt.php");
require_once("../UserStories/Ort/DeleteOrt.php");

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
    $logger->info("Ort-erzeugen gestartet");

    $ortObject = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() != JSON_ERROR_NONE)
    {
        $logger->error(json_last_error().json_last_error_msg().PHP_EOL.PHP_EOL);
        return;
    }
    
    $ortFactory = new OrtFactory();
    $ort = $ortFactory->convertToInstance($ortObject);
    
    $saveOrt = new SaveOrt();
    $saveOrt->setOrt($ort);
    
    if ($saveOrt->run())
    {
        echo json_encode($saveOrt->getOrt());    
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveOrt->getMessages());
    }

    $logger->info("Ort-erzeugen beendet");
}

function Update()
{
    global $logger;
    $logger->info("Ort-anhand-ID-aktualisieren gestartet");

    $ortObject = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() != JSON_ERROR_NONE)
    {
        $logger->error(json_last_error().json_last_error_msg().PHP_EOL.PHP_EOL);
        return;
    }

    if (isset($_GET["Id"]))
    {
        $ortObject["Id"] = $_GET["Id"];
    }
    
    $ortFactory = new OrtFactory();
    $ort = $ortFactory->convertToInstance($ortObject);
    
    $saveOrt = new SaveOrt();
    $saveOrt->setOrt($ort);
    
    if ($saveOrt->run())
    {
        echo json_encode($saveOrt->getOrt());    
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveOrt->getMessages());
    }

    $logger->info("Ort-anhand-ID-aktualisieren beendet");
}

function Delete()
{
    global $logger;
    $logger->info("Ort-anhand-ID-löschen gestartet");

    $loadOrt = new LoadOrt();

    if (isset($_GET["Id"]))
    {
        $loadOrt->setId(intval($_GET["Id"]));
    }

    if ($loadOrt->run())
    {
        $ort = $loadOrt->getOrt();
        
        $deleteOrt = new DeleteOrt();
        $deleteOrt->setOrt($ort);

        if ($deleteOrt->run())
        {
            echo json_encode($ort);
        }
        else
        {
            http_response_code(500);
            echo json_encode($deleteOrt->getMessages());
        }
    }
    else
    {
        http_response_code(500);
        echo json_encode($loadOrt->getMessages());
    }

    $logger->info("Ort-anhand-ID-löschen beendet");
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
		$logger->info("Orte-suchen gestartet");

		$loadEntites = new LoadEntites(new OrtFactory());

		if (isset($_GET["hasParent"]))
		{
			$loadEntites->addSearchCondition("HasParent", $_GET["hasParent"] === "true");
		}

		if (isset($_GET["hasChildren"]))
		{
			$loadEntites->addSearchCondition("HasChildren", $_GET["hasChildren"] === "true");
		}

		if (isset($_GET["bezeichnung"]))
		{
			$loadEntites->addSearchCondition("Bezeichnung", $_GET["bezeichnung"]);
		}

		if (isset($_GET["containsBezeichnung"]))
		{
			$loadEntites->addSearchCondition("ContainsBezeichnung", $_GET["containsBezeichnung"]);
		}

		if (isset($_GET["containsPath"]))
		{
			$loadEntites->addSearchCondition("ContainsPath", $_GET["containsPath"]);
		}

        if ($loadEntites->run())
        {
            echo json_encode($loadEntites->getEntites());
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadEntites->getMessages());
        }

        $logger->info("Orte-suchen beendet");
    }
}