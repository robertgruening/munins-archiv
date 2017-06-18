<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

$sitemapContent = file_get_contents("sitemap.json");

if (isset($_GET["PageName"]))
{
	$pageName = $_GET["PageName"];
	$sitemapJson = json_decode($sitemapContent, true);
	$node = null;

	if (isset($_GET["WithPath"]) &&
		$_GET["WithPath"] == true)
	{
		$node = GetNodePath($pageName, $sitemapJson);
	}
	else
	{
		$node = GetNode($pageName, $sitemapJson);
	}
	
	if ($node == null)
	{
		return;
	}

	echo json_encode($node);

	return;
}

echo $sitemapContent;

function GetNode($pageName, $nodes)
{
	foreach ($nodes as $node)
	{
		if (isset($node["PageName"]) &&
			$node["PageName"] == $pageName)	
		{
			return $node;
		}

		if (isset($node["Children"]))
		{
			$subNode = GetNode($pageName, $node["Children"]);

			if ($subNode != null)
			{
				return $subNode;
			}
		}
	}

	return null;
}

function GetNodePath($pageName, $nodes)
{
	foreach ($nodes as $node)
	{
		if (isset($node["PageName"]) &&
			$node["PageName"] == $pageName)	
		{
			return $node;
		}

		if (isset($node["Children"]))
		{
			$subNode = GetNodePath($pageName, $node["Children"]);

			if ($subNode != null)
			{
				$node["Children"] = $subNode;

				return $node;
			}
		}
	}

	return null;
}
