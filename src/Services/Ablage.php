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
    $ablageObject = null;

    if ($_GET != null)
    {
        $ablageObject = json_decode($_GET["ablage"], true);
    }
    
    $ablageFactory = new AblageFactory();
    $ablage = $ablageFactory->convertToInstance($ablageObject);
    
    $saveAblage = new SaveAblage();
    $saveAblage->setAblage($ablage);
    
    if ($saveAblage->run())
    {
        echo json_encode($ablage);
    }
    else
    {
        http_response_code(500);
        echo json_encode($loadAblage->getMessages());
    }
}

function Get()
{
    if (isset($_GET["Id"]))
    {
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
    }
    else
    {
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
    }
}

function Delete()
{
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
}