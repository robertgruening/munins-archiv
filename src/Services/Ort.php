<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../UserStories/Ort/LoadOrt.php");
require_once("../UserStories/Ort/LoadRootOrte.php");
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

	$ort = new Ort();
	
    if (isset($_GET["Id"]))
    {
		$parent = new Ort();
		$parent->setId(intval($_GET["Id"]));
        $ort->setParent($parent);    
    }

    if (isset($_POST["Bezeichnung"]))
    {
        $ort->setBezeichnung($_POST["Bezeichnung"]);
    }
    
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

    parse_str(file_get_contents("php://input"),$_PUT);

    $ort = new Ort();

    if (isset($_GET["Id"]))
    {
        $ort->setId(intval($_GET["Id"]));    
    }

    if (isset($_PUT["Bezeichnung"]))
    {
        $ort->setBezeichnung($_PUT["Bezeichnung"]);
    }
    
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
            echo json_encode("Ort (".$ort->getId().") ist gelöscht.");
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