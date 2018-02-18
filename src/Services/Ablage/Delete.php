<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../UserStories/Ablage/LoadAblage.php");
require_once("../../UserStories/Ablage/DeleteAblage.php");

if (isset($_GET["Id"]))
{
	$loadAblage = new LoadAblage();
	$loadAblage->setId(intval($_GET["Id"]));

	if ($loadAblage->run())
	{
        $ablage = $loadAblage->getAblage();
        
        $deleteAblage = new DeleteAblage();
        $deleteAblage->setAblage($ablage);

        if ($deleteAblage->run())
        {
            echo json_encode("Ablage (".$ablage->getId().") ist gelöscht.");
        }
        else
        {
            echo json_encode($deleteAblage->getMessages());
        }
    }
    else
    {
        echo json_encode($loadAblage->getMessages());
    }
}