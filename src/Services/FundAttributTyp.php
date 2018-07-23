<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../Factory/FundAttributTypFactory.php");
require_once("../UserStories/FundAttribut/Type/LoadFundAttributType.php");
require_once("../UserStories/FundAttribut/Type/SaveFundAttributType.php");
require_once("../UserStories/FundAttribut/Type/DeleteFundAttributType.php");

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
    $logger->error("PUT wird nicht unterstützt!");
    http_response_code(500);
    echo json_encode(array("PUT wird nicht unterstützt!"));
}

function Update()
{
    global $logger;
    $logger->info("Fundattributtyp-anhand-ID-aktualisieren gestartet");

    $fundAttributTyp = new FundAttributTyp();

    if (isset($_GET["Id"]))
    {
        $fundAttributTyp->setId(inval($_GET["Id"]));    
    }

    if (isset($_POST["Bezeichnung"]))
    {
        $fundAttributTyp->setBezeichnung($_POST["Bezeichnung"]);
    }
    
    $saveFundAttributType = new SaveFundAttributType();
    $saveFundAttributType->setFundAttributType($fundAttributTyp);
    
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
        $fundAttributTypFactory = new FundAttributTypFactory();
        $fundAttributTypen = $fundAttributTypFactory->loadAll();
        echo json_encode($fundAttributTypen);
        $logger->info("Fundattributtypen-laden beendet");
    }    
}