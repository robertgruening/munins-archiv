<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../Factory/OrtTypFactory.php");
require_once("../UserStories/Ort/Type/LoadOrtType.php");
require_once("../UserStories/Ort/Type/LoadOrtTypes.php");
require_once("../UserStories/Ort/Type/SaveOrtType.php");
require_once("../UserStories/Ort/Type/DeleteOrtType.php");

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
    $logger->info("Ortstyp-anlegen gestartet");

    $ortTyp = new OrtTyp();

    if (isset($_POST["Bezeichnung"]))
    {
        $ortTyp->setBezeichnung($_POST["Bezeichnung"]);
    }
    
    $saveOrtType = new SaveOrtType();
    $saveOrtType->setOrtType($ortTyp);
    
    if ($saveOrtType->run())
    {
        echo json_encode($saveOrtType->getOrtType());    
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveOrtType->getMessages());
    }

    $logger->info("Ortstyp-anlegen beendet");
}

function Update()
{
    global $logger;
    $logger->info("Ortstyp-anhand-ID-aktualisieren gestartet");

    parse_str(file_get_contents("php://input"),$_PUT);

    $ortTyp = new OrtTyp();

    if (isset($_GET["Id"]))
    {
        $ortTyp->setId(intval($_GET["Id"]));    
    }

    if (isset($_PUT["Bezeichnung"]))
    {
        $ortTyp->setBezeichnung($_PUT["Bezeichnung"]);
    }
    
    $saveOrtType = new SaveOrtType();
    $saveOrtType->setOrtType($ortTyp);
    
    if ($saveOrtType->run())
    {
        echo json_encode($saveOrtType->getOrtType());    
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveOrtType->getMessages());
    }

    $logger->info("Ortstyp-anhand-ID-aktualisieren beendet");
}

function Delete()
{
    global $logger;
    $logger->info("Ortstyp-anhand-ID-löschen gestartet");

    $loadOrtType = new LoadOrtType();
    
    if (isset($_GET["Id"]))
    {
        $loadOrtType->setId(intval($_GET["Id"])); 
    }
    
    if ($loadOrtType->run())
    {
        $ortType = $loadOrtType->getOrtType();
        
        $deleteOrtType = new DeleteOrtType();
        $deleteOrtType->setOrtType($ortType);

        if ($deleteOrtType->run())
        {
            echo json_encode("Ortstyp (".$ortType->getId().") ist gelöscht.");
        }
        else
        {
            http_response_code(500);
            echo json_encode($deleteOrtType->getMessages());
        }
    }
    else
    {
        http_response_code(500);
        echo json_encode($loadOrtType->getMessages());
    }

    $logger->info("Ortstyp-anhand-ID-löschen beendet");
}

function Get()
{
    global $logger;

    if (isset($_GET["Id"]))
    {
        $logger->info("Ortstyp-anhand-ID-laden gestartet");
        $loadOrtType = new LoadOrtType();
        $loadOrtType->setId(intval($_GET["Id"]));
        
        if ($loadOrtType->run())
        {
            echo json_encode($loadOrtType->getOrtType());
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadOrtType->getMessages());
        }

        $logger->info("Ortstyp-anhand-ID-laden beendet");
    }
    else
    {
        $logger->info("Orttypen-laden gestartet");
        $loadOrtTypes = new LoadOrtTypes();
        
        if ($loadOrtTypes->run())
        {
            echo json_encode($loadOrtTypes->getOrtTypes());
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadOrtTypes->getMessages());
        }

        $logger->info("Orttypen-laden beendet");
    }
}