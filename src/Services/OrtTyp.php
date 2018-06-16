<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../Factory/OrtTypFactory.php");
require_once("../UserStories/Ort/Type/LoadOrtType.php");
require_once("../UserStories/Ort/Type/SaveOrtType.php");
require_once("../UserStories/Ort/Type/DeleteOrtType.php");

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
    $ortTyp = new OrtTyp();

    if (isset($_GET["Id"]))
    {
        $ortTyp->setId($_GET["Id"]);
    }
    
    $ortTyp->setBezeichnung($_POST["Bezeichnung"]);
    
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
}

function Delete()
{
    if (isset($_GET["Id"]))
    {
        $loadOrtType = new LoadOrtType();
        $loadOrtType->setId(intval($_GET["Id"]));
        
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
    }
}

function Get()
{
    if (isset($_GET["Id"]))
    {
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
    }
    else
    {
        $ortTypFactory = new OrtTypFactory();
        $ortTypen = $ortTypFactory->loadAll();
        echo json_encode($ortTypen);
    }
}