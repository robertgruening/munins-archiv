<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once("../Factory/FundAttributTypeFactory.php");
require_once("../UserStories/FundAttribut/Type/ConvertFundAttributType.php");
require_once("../UserStories/FundAttribut/Type/LoadFundAttributType.php");
require_once("../UserStories/FundAttribut/Type/LoadFundAttributTypes.php");
require_once("../UserStories/FundAttribut/Type/SaveFundAttributType.php");
require_once("../UserStories/FundAttribut/Type/DeleteFundAttributType.php");

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
    $logger->info("Fundattributtyp-anlegen gestartet");

    $fundAttributTypeObject = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() != JSON_ERROR_NONE)
    {
        $logger->error(json_last_error().json_last_error_msg().PHP_EOL.PHP_EOL);
        return;
    }

    $convertFundAttributType = new ConvertFundAttributType();
    $convertFundAttributType->setMultidimensionalArray($fundAttributTypeObject);

    if ($convertFundAttributType->run())
    {
        $fundAttributType = $convertFundAttributType->getFundAttributType();
    }
    else
    {
        http_response_code(500);
        echo json_encode($convertFundAttributType->getMessages());
        return;
    }

    $saveFundAttributType = new SaveFundAttributType();
    $saveFundAttributType->setFundAttributType($fundAttributType);

    if ($saveFundAttributType->run())
    {
        echo json_encode($saveFundAttributType->getFundAttributType());
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveFundAttributType->getMessages());
    }

    $logger->info("Fundattributtyp-anlegen beendet");
}

function Update()
{
    global $logger;
    $logger->info("Fundattributtyp-anhand-ID-aktualisieren gestartet");

    $fundAttributTypeObject = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() != JSON_ERROR_NONE)
    {
        $logger->error(json_last_error().json_last_error_msg().PHP_EOL.PHP_EOL);
        return;
    }

    if (isset($_GET["Id"]))
    {
        $fundAttributTypeObject["Id"] = $_GET["Id"];
    }

    $convertFundAttributType = new ConvertFundAttributType();
    $convertFundAttributType->setMultidimensionalArray($fundAttributTypeObject);

    if ($convertFundAttributType->run())
    {
        $fundAttributType = $convertFundAttributType->getFundAttributType();
    }
    else
    {
        http_response_code(500);
        echo json_encode($convertFundAttributType->getMessages());
        return;
    }

    $saveFundAttributType = new SaveFundAttributType();
    $saveFundAttributType->setFundAttributType($fundAttributType);

    if ($saveFundAttributType->run())
    {
        echo json_encode($saveFundAttributType->getFundAttributType());
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveFundAttributType->getMessages());
    }

    $logger->info("Fundattributtyp-anhand-ID-aktualisieren beendet");
}

function Delete()
{
    global $logger;
    $logger->info("Fundattributtyp-anhand-ID-löschen gestartet");

    $loadFundAttributType = new LoadFundAttributType();

    if (isset($_GET["Id"]))
    {
        $loadFundAttributType->setId(intval($_GET["Id"]));
    }

    if ($loadFundAttributType->run())
    {
        $fundAttributType = $loadFundAttributType->getFundAttributType();

        $deleteFundAttributType = new DeleteFundAttributType();
        $deleteFundAttributType->setFundAttributType($fundAttributType);

        if ($deleteFundAttributType->run())
        {
            echo json_encode($fundAttributType);
        }
        else
        {
            http_response_code(500);
            echo json_encode($deleteFundAttributType->getMessages());
        }
    }
    else
    {
        http_response_code(500);
        echo json_encode($loadFundAttributType->getMessages());
    }

    $logger->info("Fundattributtyp-anhand-ID-löschen beendet");
}

function Get()
{
    global $logger;

    if (isset($_GET["Id"]))
    {
        $logger->info("Fundattributtyp-anhand-ID-laden gestartet");
        $loadFundAttributType = new LoadFundAttributType();
        $loadFundAttributType->setId(intval($_GET["Id"]));

        if ($loadFundAttributType->run())
        {
            echo json_encode($loadFundAttributType->getFundAttributType());
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadFundAttributType->getMessages());
        }

        $logger->info("Fundattributtyp-anhand-ID-laden beendet");
    }
    else
    {
        $logger->info("Fundattributtypen-laden gestartet");
        $loadFundAttributTypes = new LoadFundAttributTypes();

        if ($loadFundAttributTypes->run())
        {
            echo json_encode($loadFundAttributTypes->getFundAttributTypes());
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadFundAttributTypes->getMessages());
        }

        $logger->info("Fundattributtypen-laden beendet");
    }
}
