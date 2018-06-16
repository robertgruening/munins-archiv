<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../Factory/FundAttributTypFactory.php");
require_once("../UserStories/FundAttribut/Type/LoadFundAttributType.php");
require_once("../UserStories/FundAttribut/Type/SaveFundAttributType.php");
require_once("../UserStories/FundAttribut/Type/DeleteFundAttributType.php");

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
    $fundAttributTyp = new FundAttributTyp();

    if (isset($_GET["Id"]))
    {
        $fundAttributTyp->setId($_GET["Id"]);
    }
    
    $fundAttributTyp->setBezeichnung($_POST["Bezeichnung"]);
    
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
}

function Delete()
{
    if (isset($_GET["Id"]))
    {
        $loadFundAttributType = new LoadFundAttributType();
        $loadFundAttributType->setId(intval($_GET["Id"]));
        
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
    }
}

function Get()
{
    if (isset($_GET["Id"]))
    {
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
    }
    else
    {
        $fundAttributTypFactory = new FundAttributTypFactory();
        $fundAttributTypen = $fundAttributTypFactory->loadAll();
        echo json_encode($fundAttributTypen);
    }    
}