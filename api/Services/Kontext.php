<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once("../Factory/KontextFactory.php");
require_once("../UserStories/LoadEntites.php");
require_once("../UserStories/Kontext/LoadKontext.php");
require_once("../UserStories/Kontext/SaveKontext.php");
require_once("../UserStories/Kontext/DeleteKontext.php");

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
    $logger->info("Kontext-erzeugen gestartet");

    $kontextObject = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() != JSON_ERROR_NONE)
    {
        $logger->error(json_last_error().json_last_error_msg().PHP_EOL.PHP_EOL);
        return;
    }

    $kontextFactory = new KontextFactory();
    $kontext = $kontextFactory->convertToInstance($kontextObject);

    $saveKontext = new SaveKontext();
    $saveKontext->setKontext($kontext);

    if ($saveKontext->run())
    {
        echo json_encode($saveKontext->getKontext());
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveKontext->getMessages());
    }

    $logger->info("Kontext-erzeugen beendet");
}

function Update()
{
    global $logger;
    $logger->info("Kontext-anhand-ID-aktualisieren gestartet");

    $kontextObject = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() != JSON_ERROR_NONE)
    {
        $logger->error(json_last_error().json_last_error_msg().PHP_EOL.PHP_EOL);
        return;
    }

    if (isset($_GET["Id"]))
    {
        $kontextObject["Id"] = $_GET["Id"];
    }

    $kontextFactory = new KontextFactory();
    $kontext = $kontextFactory->convertToInstance($kontextObject);

    $saveKontext = new SaveKontext();
    $saveKontext->setKontext($kontext);

    if ($saveKontext->run())
    {
        echo json_encode($saveKontext->getKontext());
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveKontext->getMessages());
    }

    $logger->info("Kontext-anhand-ID-aktualisieren beendet");
}

function Delete()
{
    global $logger;
    $logger->info("Kontext-anhand-ID-löschen gestartet");

    $loadKontext = new LoadKontext();

    if (isset($_GET["Id"]))
    {
        $loadKontext->setId(intval($_GET["Id"]));
    }

    if ($loadKontext->run())
    {
        $kontext = $loadKontext->getKontext();

        $deleteKontext = new DeleteKontext();
        $deleteKontext->setKontext($kontext);

        if ($deleteKontext->run())
        {
            echo json_encode($kontext);
        }
        else
        {
            http_response_code(500);
            echo json_encode($deleteKontext->getMessages());
        }
    }
    else
    {
        http_response_code(500);
        echo json_encode($loadKontext->getMessages());
    }

    $logger->info("Kontext-anhand-ID-löschen beendet");
}

function Get()
{
	global $logger;

	if (isset($_GET["Id"]))
	{
		$logger->info("Kontext-anhand-ID-laden gestartet");
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

		$logger->info("Kontext-anhand-ID-laden beendet");
	}
    else
    {
		$logger->info("Kontext-suchen gestartet");

		$loadEntites = new LoadEntites(new KontextFactory());

		if (isset($_GET["hasParent"]))
		{
			$loadEntites->addSearchCondition("HasParent", $_GET["hasParent"] === "true");
		}

		if (isset($_GET["hasChildren"]))
		{
			$loadEntites->addSearchCondition("HasChildren", $_GET["hasChildren"] === "true");
		}

		if (isset($_GET["hasFunde"]))
		{
			$loadEntites->addSearchCondition("HasFunde", $_GET["hasFunde"] === "true");
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
		
		if (isset($_GET["isChecked"]))
		{
			$loadEntites->addSearchCondition("IsChecked", $_GET["isChecked"] === "true");
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

        $logger->info("Kontext-suchen beendet");
    }
}
