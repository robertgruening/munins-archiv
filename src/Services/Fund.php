<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../UserStories/Fund/LoadFund.php");
require_once("../UserStories/Fund/SaveFund.php");
require_once("../UserStories/Fund/DeleteFund.php");

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
    $logger->info("Fund-anlegen gestartet");

    $fund = new Fund();

    if (isset($_POST["Bezeichnung"]))
    {
        $fund->setBezeichnung($_POST["Bezeichnung"]);
    }

    if (isset($_POST["Anzahl"]))
    {
        $fund->setAnzahl($_POST["Anzahl"]);
    }
    
    $saveFund = new SaveFund();
    $saveFund->setFunde($fund);
    
    if ($saveFund->run())
    {
        echo json_encode($saveFund->getFunde());    
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveFund->getMessages());
    }

    $logger->info("Fund-anlegen beendet");
}

function Update()
{
    global $logger;
    $logger->info("Fund-anhand-ID-aktualisieren gestartet");

    parse_str(file_get_contents("php://input"),$_PUT);

    $fund = new Fund();

    if (isset($_GET["Id"]))
    {
        $fund->setId(intval($_GET["Id"]));    
    }

    if (isset($_PUT["Bezeichnung"]))
    {
        $fund->setBezeichnung($_PUT["Bezeichnung"]);
    }

    if (isset($_POST["Anzahl"]))
    {
        $fund->setAnzahl($_POST["Anzahl"]);
    }
    
    $saveFund = new SaveFund();
    $saveFund->setFund($fund);
    
    if ($saveFund->run())
    {
        echo json_encode($saveFund->getFund());    
    }
    else
    {
        http_response_code(500);
        echo json_encode($saveFund->getMessages());
    }
    $logger->info("Fund-anhand-ID-aktualisieren beendet");
}

function Delete()
{
    global $logger;
    $logger->info("Fund-anhand-ID-löschen gestartet");

    $loadFund = new LoadFund();
    
    if (isset($_GET["Id"]))
    {
        $loadFund->setId(intval($_GET["Id"])); 
    }
    
    if ($loadFund->run())
    {
        $fund = $loadFund->getFund();
        
        $deleteFund = new DeleteFund();
        $deleteFund->setFund($fund);

        if ($deleteFund->run())
        {
            echo json_encode("Fund (".$fund->getId().") ist gelöscht.");
        }
        else
        {
            http_response_code(500);
            echo json_encode($deleteFund->getMessages());
        }
    }
    else
    {
        http_response_code(500);
        echo json_encode($loadFund->getMessages());
    }

    $logger->info("Fund-anhand-ID-löschen beendet");
}

function Get()
{
	global $logger;
	$logger->info("Fund-laden gestartet");
	
	if (isset($_GET["Id"]))
	{		
		$loadFund = new LoadFund();
		$loadFund->setId(intval($_GET["Id"]));

		if ($loadFund->run())
		{
			echo json_encode($loadFund->getFund());
		}
		else
		{
			http_response_code(500);
			echo json_encode($loadFund->getMessages());
		}		
	}
	else
	{
		http_response_code(500);
		echo json_encode(array("Es wurde keine ID übergeben!"));
		$logger->warn("Es wurde keine ID übergeben!");
	}
	
	$logger->info("Fund-laden beendet");
}
