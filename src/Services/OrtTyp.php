<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../Factory/OrtTypFactory.php");
require_once("../UserStories/Ort/Type/LoadOrtType.php");
require_once("../UserStories/Ort/Type/SaveOrtType.php");
require_once("../UserStories/Ort/Type/DeleteOrtType.php");

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

    /*
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
    */
}

function Update()
{
    global $logger;
    $logger->info("Ortstyp-anhand-ID-aktualisieren gestartet");

    $ortTyp = new OrtTyp();

    if (isset($_GET["Id"]))
    {
        $ortTyp->setId(inval($_GET["Id"]));    
    }

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
        $logger->info("Ablagetypen-laden gestartet");
        $ortTypFactory = new OrtTypFactory();
        $ortTypen = $ortTypFactory->loadAll();
        echo json_encode($ortTypen);
        $logger->info("Ablagetypen-laden beendet");
    }
}