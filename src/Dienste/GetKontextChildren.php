<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 

require_once("Klassen/Kontext/class.Kontext.php");

if (isset($_POST["Id"]) &&
	$_POST["Id"] != NULL)
{
	$kontext = new Kontext();
	$kontext->LoadById(intval($_POST["Id"]));
	
	$children = $kontext->GetChildren();
	$assocArrayChildren = array();
	
	for ($i = 0; $i < count($children); $i++)
	{
		array_push($assocArrayChildren, $children[$i]->ConvertToAssocArray(0));
	}
	echo json_encode($assocArrayChildren);
}
else
{
	$assocArrayKontexte = array();
	$kontext = new Kontext();
	$kontexte = $kontext->LoadRoots();
	for ($i = 0; $i < count($kontexte); $i++)
	{
		array_push($assocArrayKontexte, $kontexte[$i]->ConvertToAssocArrayWithAblagen(0));
	}
	echo json_encode($assocArrayKontexte);
}
