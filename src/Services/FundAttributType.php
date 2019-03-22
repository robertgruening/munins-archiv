<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../Factory/FundAttributTypeFactory.php");
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

    $fundAttributType = new FundAttributType();

    if (isset($_POST["Bezeichnung"]))
    {
        $fundAttributType->setBezeichnung($_POST["Bezeichnung"]);
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

    parse_str(file_get_contents("php://input"),$_PUT);

    $fundAttributType = new FundAttributType();

    if (isset($_GET["Id"]))
    {
        $fundAttributType->setId(intval($_GET["Id"]));    
    }

    if (isset($_PUT["Bezeichnung"]))
    {
        $fundAttributType->setBezeichnung($_PUT["Bezeichnung"]);
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
            echo json_encode("Fundattributtyp (".$fundAttributType->getId().") ist gelöscht.");
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