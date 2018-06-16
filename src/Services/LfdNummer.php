<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../UserStories/LfdNummer/LoadLfdNummer.php");
require_once("../UserStories/LfdNummer/LoadLfdNummern.php");
require_once("../Factory/LfdNummerFactory.php");

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
    $lfdNummer = new LfdNummer();
    $lfdNummer->setBezeichnung($_POST["Bezeichnung"]);
    
    $lfdNummerFactory = new LfdNummerFactory();
    $lfdNummer = $lfdNummerFactory->create($lfdNummer);
    echo json_encode($lfdNummer);
}

function Delete()
{
    if (isset($_GET["Id"]))
    {
        $lfdNummerFactory = new LfdNummerFactory();
        $lfdNummer = $lfdNummerFactory->loadById(intval($_GET["Id"]));
        return $lfdNummerFactory->delete($lfdNummer);
    }
}

function Get()
{
    if (isset($_GET["Id"]))
    {
        $loadLfdNummer = new LoadLfdNummer();
        $loadLfdNummer->setId(intval($_GET["Id"]));

        if ($loadLfdNummer->run())
        {
            echo json_encode($loadLfdNummer->getLfdNummer());
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadLfdNummer->getMessages());
        }
    }
    else
    {
        $loadLfdNummern = new LoadLfdNummern();

        if ($loadLfdNummern->run())
        {
            echo json_encode($loadLfdNummern->getLfdNummern());
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadLfdNummern->getMessages());
        }
    }
}