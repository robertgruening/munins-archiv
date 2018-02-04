<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../UserStories/FundAttribut/LoadFundAttribut.php");
require_once("../../UserStories/FundAttribut/LoadRootFundAttribute.php");

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
        echo json_encode($loadFundAttribut->getMessages());
	}

	return;
}

$loadRootFundAttribute = new LoadRootFundAttribute();

if ($loadRootFundAttribute->run())
{
	echo json_encode($loadRootFundAttribute->getRootFundAttribute());
}
else
{
	echo json_encode($loadRootFundAttribute->getMessages());
}