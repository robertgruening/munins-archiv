<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../UserStories/Kontext/LoadKontext.php");
require_once("../UserStories/Kontext/LoadRootKontexte.php");
require_once("../UserStories/Kontext/DeleteKontext.php");

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
    $logger->error("PUT wird nicht unterstützt!");
    http_response_code(500);
    echo json_encode(array("PUT wird nicht unterstützt!"));
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
    $logger->info("Kontext-anhand-ID-löschen gestartet");

    $loadKontext = new LoadKontext();

    if (isset($_GET["Id"]))
    {
        $loadKontext->setId(intval($_GET["Id"]));
    }

    if ($loadKontext->run())
    {
        $kontext = $loadKontext->getKontext();
        
        $deleteKontext = new DeleteKontext();
        $deleteKontext->setKontext($kontext);

        if ($deleteKontext->run())
        {
            echo json_encode("Kontext (".$kontext->getId().") ist gelöscht.");
        }
        else
        {
            http_response_code(500);
            echo json_encode($deleteKontext->getMessages());
        }
    }
    else
    {
        http_response_code(500);
        echo json_encode($loadKontext->getMessages());
    }

    $logger->info("Kontext-anhand-ID-löschen beendet");
}

function Get()
{
	global $logger;

	if (isset($_GET["Id"]))
	{
		$logger->info("Kontext-anhand-ID-laden gestartet");		
		$loadKontext = new LoadKontext();
		$loadKontext->setId(intval($_GET["Id"]));

		if ($loadKontext->run())
		{
			echo json_encode($loadKontext->getKontext());
		}
		else
		{
            http_response_code(500);
			echo json_encode($loadKontext->getMessages());
		}

		$logger->info("Kontext-anhand-ID-laden beendet");
	}
	else
	{
        $logger->info("Root-Kontexte-laden gestartet");
		$loadRootKontexte = new LoadRootKontexte();

		if ($loadRootKontexte->run())
		{
			echo json_encode($loadRootKontexte->getRootKontexte());
		}
		else
		{
            http_response_code(500);
			echo json_encode($loadRootKontexte->getMessages());
		}

        $logger->info("Root-Kontexte-laden beendet");
	}
}