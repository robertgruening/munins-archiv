<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("../../Factory/AblageFactory.php");
require_once("../../UserStories/Ablage/SaveAblage.php");

$ablageObject = null;

if ($_GET != null)
{
    $ablageObject = json_decode($_GET["ablage"], true);
}

$ablageFactory = new AblageFactory();
$ablage = $ablageFactory->convertToInstance($ablageObject);

$saveAblage = new SaveAblage();
$saveAblage->setAblage($ablage);

if ($saveAblage->run())
{
    echo json_encode($ablage);
}
else
{
    echo json_encode($loadAblage->getMessages());
}
