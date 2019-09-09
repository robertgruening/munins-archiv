<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../Factory/LfdNummerFactory.php");
require_once("../UserStories/LfdNummer/LoadLfdNummer.php");
require_once("../UserStories/LfdNummer/LoadLfdNummern.php");
require_once("../UserStories/LfdNummer/DeleteLfdNummer.php");

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
    $logger->info("LfdNummer-anlegen gestartet");
    $lfdNummer = new LfdNummer();

    if (isset($_PUT["Bezeichnung"]))
    {
        $lfdNummer->setBezeichnung($_POST["Bezeichnung"]);
    }
    
    $lfdNummerFactory = new LfdNummerFactory();
    $lfdNummer = $lfdNummerFactory->create($lfdNummer);
    echo json_encode($lfdNummer);
    $logger->info("LfdNummer-anlegen beendet");
}

function Update()
{
    global $logger;
    $logger->info("LfdNummer-anhand-ID-aktualisieren gestartet");

    parse_str(file_get_contents("php://input"),$_PUT);

    $lfdNummer = new LfdNummer();

    if (isset($_GET["Id"]))
    {
        $lfdNummer->setId(intval($_GET["Id"]));    
    }

    if (isset($_PUT["Bezeichnung"]))
    {
        $lfdNummer->setBezeichnung($_PUT["Bezeichnung"]);
    }
        
    $lfdNummerFactory = new LfdNummerFactory();
    $lfdNummer = $lfdNummerFactory->create($lfdNummer);
    echo json_encode($lfdNummer);
    $logger->info("LfdNummer-anhand-ID-aktualisieren beendet");
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