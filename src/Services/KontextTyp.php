<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../Factory/KontextTypFactory.php");

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
    if (isset($_GET["Id"]))
    {
        http_response_code(500);
        echo json_encode("Kontexttypen können nicht geändert werden, weil sie vom System vorgegeben werden!");
    }
    else
    {
        http_response_code(500);
        echo json_encode("Kontexttypen können nicht erstellt werden, weil sie vom System vorgegeben werden!");
    }
}

function Delete()
{
    http_response_code(500);
    echo json_encode("Kontexttypen können nicht gelöscht werden, weil sie vom System vorgegeben werden!");
}

function Get()
{
    if (isset($_GET["Id"]))
    {
        $kontextTypFactory = new KontextTypFactory();
        $kontextTyp = $kontextTypFactory->loadById(intval($_GET["Id"]));
        echo json_encode($kontextTyp);
    }
    else
    {
        $kontextTypFactory = new KontextTypFactory();
        $kontextTypen = $kontextTypFactory->loadAll();
        echo json_encode($kontextTypen);
    }
}