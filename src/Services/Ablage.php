<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../UserStories/Ablage/LoadAblage.php");
require_once("../UserStories/Ablage/LoadRootAblagen.php");
require_once("../UserStories/Ablage/SaveAblage.php");
require_once("../UserStories/Ablage/DeleteAblage.php");

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
    $logger->info("Service Ablage Speichern gestartet");

    $ablageObject = null;

    if ($_POST != null)
    {
        $ablageObject = json_decode($_POST["Ablage"], true);
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

    $logger->info("Service Ablage Speichern beendet");
}

function Get()
{
    global $logger;

    if (isset($_GET["Id"]))
    {
        $logger->info("Service Ablage Lade anhand Id (".$_GET["Id"].") gestartet");
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
        $logger->info("Service Ablage Lade anhand Id (".$_GET["Id"].") beendet");
    }
    else
    {
        $logger->info("Service Ablage Lade Root-Ablagen gestartet");
        $loadRootAblagen = new LoadRootAblagen();

        if ($loadRootAblagen->run())
        {
            echo json_encode($loadRootAblagen->getRootAblagen());
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadRootAblagen->getMessages());
        }
        $logger->info("Service Ablage Lade Root-Ablagen beendet");
    }
}

function Delete()
{
    global $logger;
    $logger->info("Service Ablage Lösche anhand Id (".$_GET["Id"].") gestartet");

    if (isset($_GET["Id"]))
    {
        $loadAblage = new LoadAblage();
        $loadAblage->setId(intval($_GET["Id"]));

        if ($loadAblage->run())
        {
            $ablage = $loadAblage->getAblage();
            
            $deleteAblage = new DeleteAblage();
            $deleteAblage->setAblage($ablage);

            if ($deleteAblage->run())
            {
                echo json_encode("Ablage (".$ablage->getId().") ist gelöscht.");
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
    }
    else
    {
        http_response_code(500);
        echo "Es wurde keine ID übergeben!";         
    }

    $logger->info("Service Ablage Lösche anhand Id (".$_GET["Id"].") beendet");
}