<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../Factory/KontextTypFactory.php");

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
        $kontextTypFactory = new KontextTypFactory();
        $kontextTyp = $kontextTypFactory->loadById(intval($_GET["Id"]));
        echo json_encode($kontextTyp);
        $logger->info("Kontexttyp-anhand-ID-laden beendet");
    }
    else
    {
        $logger->info("Kontexttypen-laden gestartet");
        $kontextTypFactory = new KontextTypFactory();
        $kontextTypen = $kontextTypFactory->loadAll();
        echo json_encode($kontextTypen);
        $logger->info("Kontexttypen-laden beendet");
    }
}