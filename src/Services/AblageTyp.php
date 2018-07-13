<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../UserStories/Ablage/Type/LoadAblageType.php");
require_once("../UserStories/Ablage/Type/SaveAblageType.php");
require_once("../UserStories/Ablage/Type/DeleteAblageType.php");

if ($_SERVER["REQUEST_METHOD"] == "PUT" ||
    $_SERVER["REQUEST_METHOD"] == "POST")
{
    Save();
}
else if ($_SERVER["REQUEST_METHOD"] == "DELETE")
{
    Delete();
}
else
{
    Get();
}

function Save()
{
    global $logger;
    $logger->info("Service Ablagetyp-speichern gestartet");
    $ablageTyp = new AblageTyp();

    if (isset($_GET["Id"]))
    {
        $ablageTyp->setId($_GET["Id"]);
    }
    
    $ablageTyp->setBezeichnung($_POST["Bezeichnung"]);
    
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

    $logger->info("Service Ablagetyp-speichern beendet");
}

function Delete()
{
    global $logger;
    $logger->info("Service Ablagetyp-anhand-ID-löschen (".$_GET["Id"].") gestartet");

    if (isset($_GET["Id"]))
    {
        $loadAblageType = new LoadAblageType();
        $loadAblageType->setId(intval($_GET["Id"]));
        
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
            $logger->warn("Es wurde keine ID übergeben!"); 
        }
    }

    $logger->info("Servicee Ablagetyp-anhand-ID-löschen (".$_GET["Id"].") beendet");
}

function Get()
{
    global $logger;

    if (isset($_GET["Id"]))
    {
        $logger->info("Service Ablagetyp-anhand-ID-laden (".$_GET["Id"].") gestartet");
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

        $logger->info("Service Ablagetyp-anhand-ID-laden (".$_GET["Id"].") beendet");
    }
    else
    {
        $logger->info("Service Ablagetypen-laden gestartet");
        $ablageTypFactory = new AblageTypFactory();
        $ablageTypen = $ablageTypFactory->loadAll();
        echo json_encode($ablageTypen);

        $logger->info("Service Ablagetypen-laden beendet");
    }
}
