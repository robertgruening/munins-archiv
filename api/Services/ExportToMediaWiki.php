<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once("../Factory/KontextFactory.php");
require_once("../UserStories/LoadEntites.php");
require_once("../UserStories/Kontext/LoadKontext.php");
require_once("../Factory/OrtFactory.php");
require_once("../UserStories/Ort/LoadOrt.php");

/*
    edit.php

    MediaWiki API Demos
    Demo of `Edit` module: POST request to edit a page
    MIT license
*/

/* README
Es wird pro Fundstelle eine MediaWiki-Seite erzeugt.
Zur Bestimmung der zu exportierenden Fundstellen muss
in der URL mit dem Query-Argument "Fundstelle" deren
Bezeichnung angegeben werden.

Beispiel für den Export der Fundstelle "10":
./ExportToMediaWiki.php?Fundstelle=10
*/

/* BEGIN configuration */
$endPoint = "";
$bot_name = "";
$bot_password = "";
$fileSourceBaseUrl = "";
/* END */

$login_Token = getLoginToken(); // Step 1
loginRequest( $login_Token ); // Step 2
$csrf_Token = getCSRFToken(); // Step 3

$loadEntites = new LoadEntites(new KontextFactory());
$loadEntites->addSearchCondition("HasParent", false);

if (!$loadEntites->run())
{
	http_response_code(500);
	echo json_encode($loadEntites->getMessages());
}

$kontexte = $loadEntites->getEntites();

foreach ($kontexte as &$kontext) {
	if ($kontext->getBezeichnung() != $_GET["Fundstelle"]) {
		continue;
	}

	editRequest($csrf_Token, $kontext); // Step 4
}

// Step 1: GET request to fetch login token
function getLoginToken() {
	global $endPoint;

	$params1 = [
		"action" => "query",
		"meta" => "tokens",
		"type" => "login",
		"format" => "json"
	];

	$url = $endPoint . "?" . http_build_query( $params1 );

	$ch = curl_init( $url );
	curl_setopt( $ch, CURLOPT_SSL_VERIFYHOST, false );
	curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
	curl_setopt( $ch, CURLOPT_COOKIEJAR, "/tmp/cookie.txt" );
	curl_setopt( $ch, CURLOPT_COOKIEFILE, "/tmp/cookie.txt" );

	$output = curl_exec( $ch );
	curl_close( $ch );

	$result = json_decode( $output, true );
	return $result["query"]["tokens"]["logintoken"];
}

// Step 2: POST request to log in. Use of main account for login is not
// supported. Obtain credentials via Special:BotPasswords
// (https://www.mediawiki.org/wiki/Special:BotPasswords) for lgname & lgpassword
function loginRequest( $logintoken ) {
	global $endPoint;
	global $bot_name;
	global $bot_password;

	/*
	 * HINWEIS!
	 * Die Token der Botpasswörter laufen irgendwann aus und müssen erneuert werden!
	 */

	$params2 = [
		"action" => "login",
		"lgname" => $bot_name,
		"lgpassword" => $bot_password,
		"lgtoken" => $logintoken,
		"format" => "json"
	];
	$ch = curl_init();

	curl_setopt( $ch, CURLOPT_SSL_VERIFYHOST, false );
	curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
	curl_setopt( $ch, CURLOPT_URL, $endPoint );
	curl_setopt( $ch, CURLOPT_POST, true );
	curl_setopt( $ch, CURLOPT_POSTFIELDS, http_build_query( $params2 ) );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
	curl_setopt( $ch, CURLOPT_COOKIEJAR, "/tmp/cookie.txt" );
	curl_setopt( $ch, CURLOPT_COOKIEFILE, "/tmp/cookie.txt" );

	$output = curl_exec( $ch );

	curl_close( $ch );
}

// Step 3: GET request to fetch CSRF token
function getCSRFToken() {
	global $endPoint;

	$params3 = [
		"action" => "query",
		"meta" => "tokens",
		"format" => "json"
	];

	$url = $endPoint . "?" . http_build_query( $params3 );

	$ch = curl_init( $url );

	curl_setopt( $ch, CURLOPT_SSL_VERIFYHOST, false );
	curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
	curl_setopt( $ch, CURLOPT_COOKIEJAR, "/tmp/cookie.txt" );
	curl_setopt( $ch, CURLOPT_COOKIEFILE, "/tmp/cookie.txt" );

	$output = curl_exec( $ch );
	curl_close( $ch );

	$result = json_decode( $output, true );
	return $result["query"]["tokens"]["csrftoken"];
}

// Step 4: POST request to edit a page
function editRequest( $csrftoken, $kontext ) {
	global $endPoint;
	global $fileSourceBaseUrl;

	$title = $kontext->getType()->getBezeichnung()." ".$kontext->getBezeichnung();
	$content = "";
	$tableFunde = "";

	$loadKontext = new LoadKontext();
	$loadKontext->setId($kontext->getId());

	if (!$loadKontext->run()) {
		http_response_code(500);
		echo json_encode($loadKontext->getMessages());
		return;
	}

	$kontext = $loadKontext->getKontext();

	$lfdNummern = "";
	$lfdNummernBezeichnungen = array();

	foreach ($kontext->getLfdNummern() as &$lfdNummer) {
		array_push($lfdNummernBezeichnungen, $lfdNummer->getBezeichnung());
	}

	$lfdNummern = join("\n", $lfdNummernBezeichnungen);

	if ($lfdNummern == "") {
		$lfdNummern = "''nicht vorhanden''";
	}

	$content .= "{| class=\"wikitable sortable\" \n".
		"|- \n".
		"! LfD-Nummern \n".
		"| ".$lfdNummern." \n".
		"|- \n".
		"|} \n";

	$content .= "__TOC__\n";

	foreach ($kontext->getChildren() as &$child) {
		$loadKontext = new LoadKontext();
		$loadKontext->setId($child->getId());

		if (!$loadKontext->run()) {
			http_response_code(500);
			echo json_encode($loadKontext->getMessages());
			continue;
		}

		$child = $loadKontext->getKontext();

		$lfdNummern = "";
		$lfdNummernBezeichnungen = array();

		foreach ($child->getLfdNummern() as &$lfdNummer) {
			array_push($lfdNummernBezeichnungen, $lfdNummer->getBezeichnung());
		}

		$lfdNummern = join("\n", $lfdNummernBezeichnungen);

		if ($lfdNummern == "") {
			$lfdNummern = "''nicht vorhanden''";
		}
			
			$ortsangabe = "";
			foreach ($child->getOrte() as &$ort) {
			
				if ($ort->getCategory()->getBezeichnung() != "Gebietskörperschaft") {
					continue;
				}
			
				while ($ort != null) {
					echo $ort->getBezeichnung()." (".$ort->getType()->getBezeichnung().") - ".$ort->getId()."</br>";
					
					if ($ort->getType()->getBezeichnung() == "Landkreis" ||
			    			$ort->getType()->getBezeichnung() == "Gemeinde" ||
			    			$ort->getType()->getBezeichnung() == "Gemarkung" ||
			    			$ort->getType()->getBezeichnung() == "Stadt" ||
			    			$ort->getType()->getBezeichnung() == "Markt") {
					
						$ortsangabe = "! ".$ort->getType()->getBezeichnung()." \n".
							"| ".$ort->getBezeichnung()." \n".
							"|- \n".$ortsangabe;
					}
					
					$ortEntities = getOrtParent($ort->getId());
				
					if ($ortEntities == null) {
						$ort = null;
					}
					else {
						$ort = $ortEntities[0];
					}
				}
			}
			
			if ($ortsangabe == "") {
				$ortsangabe = "! Ortsangaben \n".
					"| ''nicht vorhanden'' \n";
			}

		$content .= "== ".$child->getType()->getBezeichnung()." ".$child->getBezeichnung()." ==\n";
		$content .= "{| class=\"wikitable sortable\" \n".
			"|- \n".
			"! LfD-Nummern \n".
			"| ".$lfdNummern." \n".
			"|- \n".
			$ortsangabe.
			"|- \n".
			"|} \n";

		foreach ($child->getChildren() as &$grandChild) {
			$loadKontext = new LoadKontext();
			$loadKontext->setId($grandChild->getId());

			if (!$loadKontext->run()) {
				http_response_code(500);
				echo json_encode($loadKontext->getMessages());
				continue;
			}

			$grandChild = $loadKontext->getKontext();

			$lfdNummern = "";
			$lfdNummernBezeichnungen = array();

			foreach ($grandChild->getLfdNummern() as &$lfdNummer) {
				array_push($lfdNummernBezeichnungen, $lfdNummer->getBezeichnung());
			}

			$lfdNummern = join("\n", $lfdNummernBezeichnungen);

			if ($lfdNummern == "") {
				$lfdNummern = "''nicht vorhanden''";
			}

			$content .= "=== ".$grandChild->getType()->getBezeichnung()." ".$grandChild->getBezeichnung()." ===\n";

            if ($grandChild->getKommentar() != "") {
                $content .= $grandChild->getKommentar()."\n\n";
            }

            if ($lfdNummern == "") {
                $lfdNummern = "''nicht vorhanden''";
            }

            $content .= "{| class=\"wikitable sortable\" \n".
			"|- \n".
			"! LfD-Nummern \n".
			"| ".$lfdNummern." \n".
			"|- \n".
			"! Datum \n".
			"| ".($grandChild->getDatum() == "" ? "''nicht vorhanden''" : $grandChild->getDatum())." \n".
			"|} \n";

			foreach ($grandChild->getFunde() as &$fund) {
				$fundAttribute = "";

				foreach ($fund->getFundAttribute() as &$fundAttribut) {
					$fundAttribute .= "\n* ".$fundAttribut->getPath();
				}

				$fundFile = "";

				if ($fund->getFileName() != "") {
					$newFileName = str_replace("/", "_", $fund->getKontext()->getPath())."_".$fund->getFileName();
					$newFileName = substr($newFileName, 1);
					$filePath=$fileSourceBaseUrl.$fund->getKontext()->getPath()."/".$fund->getFileName();
					
					echo $newFileName."<br/>";
					echo $filePath."<br/>";
					upload(getCSRFToken(), $newFileName, $filePath);
					$fundFile = "[[File:".$newFileName."|border|300px]]";
				}

				$ratingText = "";

				for ($i = 1; $i <= 5; $i++) {
					if ($i <= $fund->getRating()) {
						$ratingText .= "&<nowiki/>#9733;";
					}
					else {
						$ratingText .= "&<nowiki/>#9734;";
					}
				}

				$tableFunde .= "|- \n".
					"| ".$fundFile." \n".
					"| ".$fund->getBezeichnung()." \n".
					"| ".$fund->getAnzahl()." \n".
					"| ".$fund->getKontext()->getPath()." \n".
					"| ".$fund->getAblage()->getPath()." \n".
					"| ".$fundAttribute." \n".
					"| ".$ratingText." \n";
			}
            $content .= "{| class=\"wikitable sortable\" ".
                "style=\"vertical-align:top\" ".
	            "|- \n".
	            "! Abbildung \n".
	            "! Beschriftung \n".
	            "! Anzahl \n".
	            "! Kontext \n".
	            "! Ablage \n".
	            "! Attribute \n".
	            "! Bewertung \n".
	            $tableFunde." \n".
	            "|} \n";
            $tableFunde = "";
		}
	}

    $content .= "[[Category:Fundstelle]] \n".
        "[[Category:software-generated-content]] \n";

	$params4 = [
		"action" => "edit",
		"title" => $title,
		"text" => $content,
		"token" => $csrftoken,
		"format" => "json"
	];

	$ch = curl_init();

	curl_setopt( $ch, CURLOPT_SSL_VERIFYHOST, false );
	curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
	curl_setopt( $ch, CURLOPT_URL, $endPoint );
	curl_setopt( $ch, CURLOPT_POST, true );
	curl_setopt( $ch, CURLOPT_POSTFIELDS, http_build_query( $params4 ) );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
	curl_setopt( $ch, CURLOPT_COOKIEJAR, "/tmp/cookie.txt" );
	curl_setopt( $ch, CURLOPT_COOKIEFILE, "/tmp/cookie.txt" );

	$output = curl_exec( $ch );
	curl_close( $ch );

	echo ( $output );
}

function upload( $csrftoken, $fileName, $filePath ) {
	global $endPoint;

	$params5 = [
		"action" => "upload",
		"filename" => $fileName,
		"file" => curl_file_create($filePath, "image/jpeg", $fileName),
		/*"url" => $filePath,*/
		"ignorewarnings" => "1",
		"token" => $csrftoken,
		"format" => "json"
	];

	$ch = curl_init();

	curl_setopt( $ch, CURLOPT_SSL_VERIFYHOST, false );
	curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
	curl_setopt( $ch, CURLOPT_URL, $endPoint );
	curl_setopt( $ch, CURLOPT_POST, true );
	curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-type: multipart/form-data'));
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $params5 );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
	curl_setopt( $ch, CURLOPT_COOKIEJAR, "/tmp/cookie.txt" );
	curl_setopt( $ch, CURLOPT_COOKIEFILE, "/tmp/cookie.txt" );

	$output = curl_exec( $ch );
	curl_close( $ch );

	echo ( $output )."<br/>";
}

function getOrtParent( $ortId ) {
	$loadOrte = new LoadEntites(new OrtFactory());
	$loadOrte->addSearchCondition("Child_Id", $ortId );
	$loadOrte->run();

	return $loadOrte->getEntites();
}
