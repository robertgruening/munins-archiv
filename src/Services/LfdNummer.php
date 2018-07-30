<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../UserStories/LfdNummer/LoadLfdNummer.php");
require_once("../UserStories/LfdNummer/LoadLfdNummern.php");
require_once("../UserStories/LfdNummer/DeleteLfdNummer.php");
require_once("../Factory/LfdNummerFactory.php");

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
    $logger->info("LfdNummer-anhand-ID-anlegen gestartet");
    $lfdNummer = new LfdNummer();
    $lfdNummer->setBezeichnung($_POST["Bezeichnung"]);
    
    $lfdNummerFactory = new LfdNummerFactory();
    $lfdNummer = $lfdNummerFactory->create($lfdNummer);
    echo json_encode($lfdNummer);
    $logger->info("LfdNummer-anhand-ID-anlegen beendet");
}

function Update()
{
    global $logger;
    $logger->error("POST wird nicht unterstützt!");
    http_response_code(500);
    echo json_encode(array("POST wird nicht unterstützt!"));
}

function Delete()
{
    global $logger;
    $logger->info("LfdNummer-anhand-ID-löschen gestartet");

    $loadLfdNummer = new LoadLfdNummer();
    
    if (isset($_GET["Id"]))
    {
        $loadLfdNummer->setId(intval($_GET["Id"])); 
    }
    
    if ($loadLfdNummer->run())
    {
        $lfdNummer = $loadLfdNummer->getLfdNummer();
        
        $deleteLfdNummer = new DeleteLfdNummer();
        $deleteLfdNummer->setLfdNummer($lfdNummer);

        if ($deleteLfdNummer->run())
        {
            echo json_encode("LfD-Nummer (".$lfdNummer->getId().") ist gelöscht.");
        }
        else
        {
            http_response_code(500);
            echo json_encode($deleteLfdNummer->getMessages());
        }
    }
    else
    {
        http_response_code(500);
        echo json_encode($loadLfdNummer->getMessages());
    }

    $logger->info("LfdNummer-anhand-ID-löschen beendet");
}

function Get()
{
    global $logger;

    if (isset($_GET["Id"]))
    {
        $logger->info("LfdNummer-anhand-ID-laden gestartet");
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
        $logger->info("LfdNummer-anhand-ID-laden beendet");
    }
    else
    {
        $logger->info("LfdNummern-laden gestartet");
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

        $logger->info("LfdNummern-laden beendet");
    }
}