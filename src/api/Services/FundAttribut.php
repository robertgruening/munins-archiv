<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../Factory/FundAttributFactory.php");
require_once("../UserStories/LoadEntites.php");
require_once("../UserStories/FundAttribut/LoadFundAttribut.php");
require_once("../UserStories/FundAttribut/SaveFundAttribut.php");
require_once("../UserStories/FundAttribut/DeleteFundAttribut.php");

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
    $logger->info("Fundattribut-erzeugen gestartet");

    $fundAttributObject = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() != JSON_ERROR_NONE)
    {
        $logger->error(json_last_error().json_last_error_msg().PHP_EOL.PHP_EOL);
        return;
    }
    
    $fundAttributFactory = new FundAttributFactory();
    $fundAttribut = $fundAttributFactory->convertToInstance($fundAttributObject);
    
    $saveFundAttribut = new SaveFundAttribut();
    $saveFundAttribut->setFundAttribut($fundAttribut);
    
    if ($saveFundAttribut->run())
    {
        echo json_encode($saveFundAttribut->getFundAttribut());    
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveFundAttribut->getMessages());
    }

    $logger->info("Fundattribut-erzeugen beendet");
}

function Update()
{
    global $logger;
    $logger->info("Fundattribut-anhand-ID-aktualisieren gestartet");

    $fundAttributObject = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() != JSON_ERROR_NONE)
    {
        $logger->error(json_last_error().json_last_error_msg().PHP_EOL.PHP_EOL);
        return;
    }

    if (isset($_GET["Id"]))
    {
        $fundAttributObject["Id"] = $_GET["Id"];
    }
    
    $fundAttributFactory = new FundAttributFactory();
    $fundAttribut = $fundAttributFactory->convertToInstance($fundAttributObject);
    
    $saveFundAttribut = new SaveFundAttribut();
    $saveFundAttribut->setFundAttribut($fundAttribut);
    
    if ($saveFundAttribut->run())
    {
        echo json_encode($saveFundAttribut->getFundAttribut());
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveFundAttribut->getMessages());
    }

    $logger->info("Fundattribut-anhand-ID-aktualisieren beendet");
}

function Delete()
{
    global $logger;
    $logger->info("Fundattribut-anhand-ID-löschen gestartet");

    $loadFundAttribut = new LoadFundAttribut();

    if (isset($_GET["Id"]))
    {
        $loadFundAttribut->setId(intval($_GET["Id"]));
    }

    if ($loadFundAttribut->run())
    {
        $fundAttribut = $loadFundAttribut->getFundAttribut();
        
        $deleteFundAttribut = new DeleteFundAttribut();
        $deleteFundAttribut->setFundAttribut($fundAttribut);

        if ($deleteFundAttribut->run())
        {
            echo json_encode($fundAttribut);
        }
        else
        {
            http_response_code(500);
            echo json_encode($deleteFundAttribut->getMessages());
        }
    }
    else
    {
        http_response_code(500);
        echo json_encode($loadFundAttribut->getMessages());
    }

    $logger->info("Fundattribut-anhand-ID-löschen beendet");
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
		$logger->info("Fundattribute-suchen gestartet");

		$loadEntites = new LoadEntites(new FundAttributFactory());

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

        $logger->info("Fundattribute-suchen beendet");
    }
}