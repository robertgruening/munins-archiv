<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once("../UserStories/LfdNummer/LoadLfdNummer.php");
require_once("../UserStories/LfdNummer/LoadLfdNummern.php");
require_once("../UserStories/LfdNummer/SaveLfdNummer.php");
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

    $lfdNummerObject = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() != JSON_ERROR_NONE)
    {
        $logger->error(json_last_error().json_last_error_msg().PHP_EOL.PHP_EOL);
        return;
    }

    $lfdNummer = new LfdNummer();
    $messages = array();

    if (isset($lfdNummerObject["Bezeichnung"]))
    {
        $lfdNummer->setBezeichnung($lfdNummerObject["Bezeichnung"]);
    }
    else
    {
        $logger->error("Bezeichnung ist nicht gesetzt!");
        array_push($messages, "Bezeichnung ist nicht gesetzt!");
    }

    if (count($messages) >= 1)
    {
        http_response_code(500);
        echo json_encode($messages);
        $logger->info("LfdNummer-anlegen beendet");
        return;
    }

    $saveLfdNummer = new SaveLfdNummer();
    $saveLfdNummer->setLfdNummer($lfdNummer);

    if ($saveLfdNummer->run())
    {
        echo json_encode($saveLfdNummer->getLfdNummer());
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveLfdNummer->getMessages());
    }

    $logger->info("LfdNummer-anlegen beendet");
}

function Update()
{
    global $logger;
    $logger->info("LfdNummer-anhand-ID-aktualisieren gestartet");

    $lfdNummerObject = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() != JSON_ERROR_NONE)
    {
        $logger->error(json_last_error().json_last_error_msg().PHP_EOL.PHP_EOL);
        return;
    }

    $lfdNummer = new LfdNummer();
    $messages = array();

    if (isset($_GET["Id"]))
    {
        $lfdNummer->setId(intval($_GET["Id"]));
    }
    else
    {
        $logger->error("ID ist nicht gesetzt!");
        array_push($messages, "ID ist nicht gesetzt!");
    }

    if (isset($lfdNummerObject["Bezeichnung"]))
    {
        $lfdNummer->setBezeichnung($lfdNummerObject["Bezeichnung"]);
    }
    else
    {
        $logger->error("Bezeichnung ist nicht gesetzt!");
        array_push($messages, "Bezeichnung ist nicht gesetzt!");
    }

    if (count($messages) >= 1)
    {
        http_response_code(500);
        echo json_encode($messages);
        $logger->info("LfdNummer-anhand-ID-aktualisieren beendet");
        return;
    }

    $saveLfdNummer = new SaveLfdNummer();
    $saveLfdNummer->setLfdNummer($lfdNummer);

    if ($saveLfdNummer->run())
    {
        echo json_encode($saveLfdNummer->getLfdNummer());
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveLfdNummer->getMessages());
    }

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
            echo json_encode($lfdNummer);
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
