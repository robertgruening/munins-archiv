<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../UserStories/FundAttribut/LoadFundAttribut.php");
require_once("../UserStories/FundAttribut/LoadRootFundAttribute.php");

if ($_SERVER["REQUEST_METHOD"] == "PUT" ||
    $_SERVER["REQUEST_METHOD"] == "POST")
{
    //Save();
}
else if ($_SERVER["REQUEST_METHOD"] == "DELETE")
{
    //Delete();
}
else
{
    Get();
}

function Get()
{
	if (isset($_GET["Id"]))
	{
		$loadFundAttribut = new LoadFundAttribut();
		$loadFundAttribut->setId(intval($_GET["Id"]));

		if ($loadFundAttribut->run())
		{
			echo json_encode($loadFundAttribut->getFundAttribut());
		}
		else
		{
            http_response_code(500);
			echo json_encode($loadFundAttribut->getMessages());
		}
	}
	else
	{
		$loadRootFundAttribute = new LoadRootFundAttribute();

		if ($loadRootFundAttribute->run())
		{
			echo json_encode($loadRootFundAttribute->getRootFundAttribute());
		}
		else
		{
			http_response_code(500);
			echo json_encode($loadRootFundAttribute->getMessages());
		}
	}
}