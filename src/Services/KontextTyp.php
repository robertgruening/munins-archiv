<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../UserStories/Kontext/Type/LoadKontextType.php");
require_once("../UserStories/Kontext/Type/LoadKontextTypes.php");

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
    $logger->info("Kontexttypen können nicht erstellt werden, weil sie vom System vorgegeben werden!");
    http_response_code(500);
    echo json_encode("Kontexttypen können nicht erstellt werden, weil sie vom System vorgegeben werden!");
}

function Update()
{
    global $logger;
    $logger->info("Kontexttypen können nicht geändert werden, weil sie vom System vorgegeben werden!");
    http_response_code(500);
    echo json_encode("Kontexttypen können nicht geändert werden, weil sie vom System vorgegeben werden!");
}

function Delete()
{
    global $logger;
    $logger->info("Kontexttypen können nicht gelöscht werden, weil sie vom System vorgegeben werden!");
    http_response_code(500);
    echo json_encode("Kontexttypen können nicht gelöscht werden, weil sie vom System vorgegeben werden!");
}

function Get()
{
    global $logger;

    if (isset($_GET["Id"]))
    {
        $logger->info("Kontexttyp-anhand-ID-laden gestartet");
        $loadKontextType = new LoadKontextType();
        $loadKontextType->setId(intval($_GET["Id"]));
        
        if ($loadKontextType->run())
        {
            echo json_encode($loadKontextType->getKontextType());
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadKontextType->getMessages());
        }

        $logger->info("Kontexttyp-anhand-ID-laden beendet");
    }
    else
    {
        $logger->info("Kontexttypen-laden gestartet");
        $loadKontextTypes = new LoadKontextTypes();
        
        if ($loadKontextTypes->run())
        {
            echo json_encode($loadKontextTypes->getKontextTypes());
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadKontextTypes->getMessages());
        }

        $logger->info("Kontexttypen-laden beendet");
    }
}