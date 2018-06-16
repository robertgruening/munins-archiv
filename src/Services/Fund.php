<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../UserStories/Fund/LoadFund.php");

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

		return;
	}
}