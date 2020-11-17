<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once("../UserStories/Fund/ConvertFund.php");
require_once("../UserStories/Fund/LoadFund.php");
require_once("../UserStories/Fund/LoadFunde.php");
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

    $fundObject = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() != JSON_ERROR_NONE)
    {
        $logger->error(json_last_error().json_last_error_msg().PHP_EOL.PHP_EOL);
        return;
    }

    $convertFund = new ConvertFund();
    $convertFund->setMultidimensionalArray($fundObject);

    if ($convertFund->run())
    {
        $fund = $convertFund->getFund();
    }
    else
    {
        http_response_code(500);
        echo json_encode($convertFund->getMessages());
        return;
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

    $logger->info("Fund-anlegen beendet");
}

function Update()
{
    global $logger;
    $logger->info("Fund-anhand-ID-aktualisieren gestartet");

    $fundObject = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() != JSON_ERROR_NONE)
    {
        $logger->error(json_last_error().json_last_error_msg().PHP_EOL.PHP_EOL);
        return;
    }

    if (isset($_GET["Id"]))
    {
        $fundObject["Id"] = $_GET["Id"];
    }

    $convertFund = new ConvertFund();
    $convertFund->setMultidimensionalArray($fundObject);

    if ($convertFund->run())
    {
        $fund = $convertFund->getFund();
    }
    else
    {
        http_response_code(500);
        echo json_encode($convertFund->getMessages());
        return;
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
            echo json_encode($fund);
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
		$logger->info("Funde-suchen gestartet");

		$loadFunde = new LoadFunde();

		if (isset($_GET["containsBezeichnung"]))
		{
			$loadFunde->addSearchCondition("ContainsBezeichnung", $_GET["containsBezeichnung"]);
		}

		if (isset($_GET["bezeichnung"]))
		{
			$loadFunde->addSearchCondition("Bezeichnung", $_GET["bezeichnung"]);
		}

		if (isset($_GET["hasAblage"]))
		{
			$loadFunde->addSearchCondition("HasAblage", $_GET["hasAblage"] === "true");
		}

		if (isset($_GET["ablage_Id"]))
		{
			$loadFunde->addSearchCondition("Ablage_Id", $_GET["ablage_Id"]);
		}

		if (isset($_GET["hasKontext"]))
		{
			$loadFunde->addSearchCondition("HasKontext", $_GET["hasKontext"] === "true");
		}

		if (isset($_GET["kontext_Id"]))
		{
			$loadFunde->addSearchCondition("Kontext_Id", $_GET["kontext_Id"]);
		}

		if (isset($_GET["hasFundAttribute"]))
		{
			$loadFunde->addSearchCondition("HasFundAttribute", $_GET["hasFundAttribute"] === "true");
		}

		if (isset($_GET["fundAttribut_Ids"]))
		{
			$loadFunde->addSearchCondition("FundAttribut_Ids", $_GET["fundAttribut_Ids"]);
		}

		if (isset($_GET["rating"]))
		{
			$loadFunde->addSearchCondition("Rating", $_GET["rating"]);
		}

		$pagingConditions = array();

		if (isset($_GET["pagingDirection"]))
		{
			$pagingConditions["PagingDirection"] = $_GET["pagingDirection"];
		}

		if (isset($_GET["pageSize"]))
		{
			$pagingConditions["PageSize"] = $_GET["pageSize"];
		}

		if (isset($_GET["pageIndexElementId"]))
		{
			$pagingConditions["PageIndexElementId"] = $_GET["pageIndexElementId"];
		}

		$loadFunde->setPagingConditions($pagingConditions);

		if (isset($_GET["sortingOrder"]))
		{
			$sortingConditions = array();
			$sortingConditions["SortingOrder"] = $_GET["sortingOrder"];
			$loadFunde->setSortingConditions($sortingConditions);
		}

        if ($loadFunde->run())
        {
			$data = array();
			$data["data"] = $loadFunde->getFunde();
			$data["count"] = $loadFunde->getCount();

            echo json_encode($data);
        }
        else
        {
            http_response_code(500);
            echo json_encode($loadFunde->getMessages());
        }

        $logger->info("Funde-suchen beendet");
    }

	$logger->info("Fund-laden beendet");
}
