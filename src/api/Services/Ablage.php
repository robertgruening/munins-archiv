<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once("../UserStories/Ablage/LoadAblage.php");
require_once("../UserStories/Ablage/LoadAblagen.php");
require_once("../UserStories/Ablage/LoadRootAblagen.php");
require_once("../UserStories/Ablage/SaveAblage.php");
require_once("../UserStories/Ablage/DeleteAblage.php");

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
    $logger->info("Ablage-erzeugen gestartet");

    $ablageObject = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() != JSON_ERROR_NONE)
    {
        $logger->error(json_last_error().json_last_error_msg().PHP_EOL.PHP_EOL);
        return;
    }

    $ablageFactory = new AblageFactory();
    $ablage = $ablageFactory->convertToInstance($ablageObject);

    $saveAblage = new SaveAblage();
    $saveAblage->setAblage($ablage);

    if ($saveAblage->run())
    {
        echo json_encode($saveAblage->getAblage());
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveAblage->getMessages());
    }

    $logger->info("Ablage-erzeugen beendet");
}

function Update()
{
    global $logger;
    $logger->info("Ablage-anhand-ID-aktualisieren gestartet");

    $ablageObject = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() != JSON_ERROR_NONE)
    {
        $logger->error(json_last_error().json_last_error_msg().PHP_EOL.PHP_EOL);
        return;
    }

    if (isset($_GET["Id"]))
    {
        $ablageObject["Id"] = $_GET["Id"];
    }

    $ablageFactory = new AblageFactory();
    $ablage = $ablageFactory->convertToInstance($ablageObject);

    $saveAblage = new SaveAblage();
    $saveAblage->setAblage($ablage);

    if ($saveAblage->run())
    {
        echo json_encode($saveAblage->getAblage());
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveAblage->getMessages());
    }

    $logger->info("Ablage-anhand-ID-aktualisieren beendet");
}

function Delete()
{
    global $logger;
    $logger->info("Ablage-anhand-ID-löschen gestartet");

    $loadAblage = new LoadAblage();

    if (isset($_GET["Id"]))
    {
        $loadAblage->setId(intval($_GET["Id"]));
    }

    if ($loadAblage->run())
    {
        $ablage = $loadAblage->getAblage();

        $deleteAblage = new DeleteAblage();
        $deleteAblage->setAblage($ablage);

        if ($deleteAblage->run())
        {
            echo json_encode($ablage);
        }
        else
        {
            http_response_code(500);
            echo json_encode($deleteAblage->getMessages());
        }
    }
    else
    {
        http_response_code(500);
        echo json_encode($loadAblage->getMessages());
    }

    $logger->info("Ablage-anhand-ID-löschen beendet");
}

function Get()
{
    global $logger;

    if (isset($_GET["Id"]))
    {
        $logger->info("Ablage-anhand-ID-laden gestartet");
        $loadAblage = new LoadAblage();
        $loadAblage->setId(intval($_GET["Id"]));

        if ($loadAblage->run())
        {
            echo json_encode($loadAblage->getAblage());
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadAblage->getMessages());
        }

        $logger->info("Ablage-anhand-ID-laden beendet");
    }
	else if (isset($_GET["Guid"]))
	{
        $logger->info("Ablage-anhand-GUID-laden gestartet");
        $loadAblage = new LoadAblage();
        $loadAblage->setGuid($_GET["Guid"]);

        if ($loadAblage->run())
        {
            echo json_encode($loadAblage->getAblage());
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadAblage->getMessages());
        }

        $logger->info("Ablage-anhand-GUID-laden beendet");
	}
    else
    {
	$logger->info("Ablagen-suchen gestartet");

	$loadAblagen = new LoadAblagen();

	if (isset($_GET["hasParent"]))
	{
		$loadAblagen->addSearchCondition("HasParent", $_GET["hasParent"] === "true");
	}

	if (isset($_GET["hasChildren"]))
	{
		$loadAblagen->addSearchCondition("HasChildren", $_GET["hasChildren"] === "true");
	}

	if (isset($_GET["hasFunde"]))
	{
		$loadAblagen->addSearchCondition("HasFunde", $_GET["hasFunde"] === "true");
	}

	if (isset($_GET["bezeichnung"]))
	{
		$loadAblagen->addSearchCondition("Bezeichnung", $_GET["bezeichnung"]);
	}

        if ($loadAblagen->run())
        {
            echo json_encode($loadAblagen->getAblagen());
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadAblagen->getMessages());
        }

        $logger->info("Ablagen-suchen beendet");
    }
}
