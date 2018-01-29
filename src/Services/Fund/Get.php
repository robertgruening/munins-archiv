<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../UserStories/Fund/LoadFund.php");

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
        echo json_encode($loadFund->getMessages());
	}

	return;
}