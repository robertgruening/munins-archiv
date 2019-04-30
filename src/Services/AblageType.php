<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../Factory/AblageTypeFactory.php");
require_once("../UserStories/Ablage/Type/LoadAblageType.php");
require_once("../UserStories/Ablage/Type/LoadAblageTypes.php");
require_once("../UserStories/Ablage/Type/SaveAblageType.php");
require_once("../UserStories/Ablage/Type/DeleteAblageType.php");

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
    $logger->info("Ablagetyp-anlegen gestartet");

    parse_str(file_get_contents("php://input"), $ablageTypeObject);

    $ablageTypeFactory = new AblageTypeFactory();
    $ablageType = $ablageTypeFactory->convertToInstance($ablageTypeObject);
    
    $saveAblageType = new SaveAblageType();
    $saveAblageType->setAblageType($ablageType);
    
    if ($saveAblageType->run())
    {
        echo json_encode($saveAblageType->getAblageType());    
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveAblageType->getMessages());
    }

    $logger->info("Ablagetyp-anlegen beendet");
}

function Update()
{
    global $logger;
    $logger->info("Ablagetyp-anhand-ID-aktualisieren gestartet");

    parse_str(file_get_contents("php://input"), $ablageTypeObject);

    if (isset($_GET["Id"]))
    {
        $ablageTypeObject["Id"] = $_GET["Id"];
    }

    $ablageTypeFactory = new AblageTypeFactory();
    $ablageType = $ablageTypeFactory->convertToInstance($ablageTypeObject);
    
    $saveAblageType = new SaveAblageType();
    $saveAblageType->setAblageType($ablageType);
    
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
            echo json_encode($ablageType);
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
        $loadAblageTypes = new LoadAblageTypes();
        
        if ($loadAblageTypes->run())
        {
            echo json_encode($loadAblageTypes->getAblageTypes());
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadAblageTypes->getMessages());
        }
        
        $logger->info("Ablagetypen-laden beendet");
    }
}
