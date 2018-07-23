<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../UserStories/Ablage/Type/LoadAblageType.php");
require_once("../UserStories/Ablage/Type/SaveAblageType.php");
require_once("../UserStories/Ablage/Type/DeleteAblageType.php");

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
    $logger->info("Ablagetyp-anhand-ID-aktualisieren gestartet");

    $ablageTyp = new AblageTyp();

    if (isset($_GET["Id"]))
    {
        $ablageTyp->setId(inval($_GET["Id"]));    
    }

    if (isset($_POST["Bezeichnung"]))
    {
        $ablageTyp->setBezeichnung($_POST["Bezeichnung"]);
    }
    
    $saveAblageType = new SaveAblageType();
    $saveAblageType->setAblageType($ablageTyp);
    
    if ($saveAblageType->run())
    {
        echo json_encode($saveAblageType->getAblageType());    
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveAblageType->getMessages());
    }

    $logger->info("Ablagetyp-anhand-ID-aktualisieren beendet");
}

function Delete()
{
    global $logger;
    $logger->info("Ablagetyp-anhand-ID-löschen gestartet");

    $loadAblageType = new LoadAblageType();
    
    if (isset($_GET["Id"]))
    {
        $loadAblageType->setId(intval($_GET["Id"])); 
    }
    
    if ($loadAblageType->run())
    {
        $ablageType = $loadAblageType->getAblageType();
        
        $deleteAblageType = new DeleteAblageType();
        $deleteAblageType->setAblageType($ablageType);

        if ($deleteAblageType->run())
        {
            echo json_encode("Ablagetyp (".$ablageType->getId().") ist gelöscht.");
        }
        else
        {
            http_response_code(500);
            echo json_encode($deleteAblageType->getMessages());
        }
    }
    else
    {
        http_response_code(500);
        echo json_encode($loadAblageType->getMessages());
    }

    $logger->info("Ablagetyp-anhand-ID-löschen beendet");
}

function Get()
{
    global $logger;

    if (isset($_GET["Id"]))
    {
        $logger->info("Ablagetyp-anhand-ID-laden gestartet");
        $loadAblageType = new LoadAblageType();
        $loadAblageType->setId(intval($_GET["Id"]));
        
        if ($loadAblageType->run())
        {
            echo json_encode($loadAblageType->getAblageType());
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadAblageType->getMessages());
        }

        $logger->info("Ablagetyp-anhand-ID-laden beendet");
    }
    else
    {
        $logger->info("Ablagetypen-laden gestartet");
        $ablageTypFactory = new AblageTypFactory();
        $ablageTypen = $ablageTypFactory->loadAll();
        echo json_encode($ablageTypen);
        $logger->info("Ablagetypen-laden beendet");
    }
}
