<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once("../Factory/OrtCategoryFactory.php");
require_once("../UserStories/Ort/Category/LoadOrtCategory.php");
require_once("../UserStories/Ort/Category/LoadOrtCategories.php");

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
    $logger->info("Ortskategorien können nicht erstellt werden, weil sie vom System vorgegeben werden!");
    http_response_code(500);
    echo json_encode("Ortskategorien können nicht erstellt werden, weil sie vom System vorgegeben werden!");
}

function Update()
{
    global $logger;
    $logger->info("Ortskategorien können nicht geändert werden, weil sie vom System vorgegeben werden!");
    http_response_code(500);
    echo json_encode("Ortskategorien können nicht geändert werden, weil sie vom System vorgegeben werden!");
}

function Delete()
{
    global $logger;
    $logger->info("Ortskategorien können nicht gelöscht werden, weil sie vom System vorgegeben werden!");
    http_response_code(500);
    echo json_encode("Ortskategorien können nicht gelöscht werden, weil sie vom System vorgegeben werden!");
}

function Get()
{
    global $logger;

    if (isset($_GET["Id"]))
    {
        $logger->info("Ortskategorie-anhand-ID-laden gestartet");
        $loadOrtCategory = new LoadOrtCategory();
        $loadOrtCategory->setId(intval($_GET["Id"]));

        if ($loadOrtCategory->run())
        {
            echo json_encode($loadOrtCategory->getOrtCategory());
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadOrtCategory->getMessages());
        }

        $logger->info("Ortskategorie-anhand-ID-laden beendet");
    }
    else
    {
        $logger->info("Ortskategorien-laden gestartet");
        $loadOrtCategories = new LoadOrtCategories();

        if ($loadOrtCategories->run())
        {
            echo json_encode($loadOrtCategories->getOrtCategories());
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadOrtCategories->getMessages());
        }

        $logger->info("Ortskategorien-laden beendet");
    }
}
