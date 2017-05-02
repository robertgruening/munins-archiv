<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once("Klassen/Kontext/class.Kontext.php");
require_once("Klassen/Kontext/class.Begehungsflaeche.php");
require_once("Klassen/Kontext/class.Begehung.php");
require_once("Klassen/Ort/class.Ort.php");

$filename="Bericht.csv";
header("Content-disposition: attachment;filename=$filename");

if (isset($_GET["Top"]))
{
	$top = intval($_GET["Top"]);
	
	echo "Fundstelle;";
	echo "Begehungsfläche;";
	echo "LfD;";
	echo "Orte;";
	echo "Begehung;";
	echo "LfD-E;";
	echo "Datum;";
	echo "Kommentar\r";
	
	$kontext = new Kontext();
	$fundstellen = $kontext->LoadRoots();
	
	for ($i = 0; $i < count($fundstellen) && $i < $top; $i++)
	{
		$fundstelle = $fundstellen[$i];
		$begehungsflaechen = $fundstelle->GetChildren();
		
		for ($j = 0; $j < count($begehungsflaechen); $j++)
		{			
			if ($begehungsflaechen[$j]->GetTyp()->GetBezeichnung() == "Begehungsfläche")
			{
				$begehungsflaeche = new Begehungsflaeche();
				$begehungsflaeche->LoadById($begehungsflaechen[$j]->GetId());
				
				$orte = $begehungsflaeche->GetOrte();	
				$lfds = $begehungsflaeche->GetLfDs();			
				$begehungen = $begehungsflaeche->GetChildren();
				
				for ($k = 0; $k < count($begehungen); $k++)
				{
					if ($begehungen[$k]->GetTyp()->GetBezeichnung() == "Begehung")
					{
						$begehung = new Begehung();
						$begehung->LoadById($begehungen[$k]->GetId());
										
						echo $fundstelle->GetBezeichnung().";";
						echo $begehungsflaeche->GetBezeichnung().";";
						
						echo "\"";
						for ($l = 0; $l < count($lfds); $l++)
						{
							$lfd = $lfds[$l];
							echo $lfd->GetTK25Nr()."/".$lfd->GetNr();
							
							if ($l < count($lfds) - 1)
							{
								echo ", \r";
							}
						}						
						echo "\"";
						echo ";";
						
						echo "\"";
						for ($m = 0; $m < count($orte); $m++)
						{
							$ort = $orte[$m];
							$ortsPfad = $ort->ConvertRootChainToSimpleAssocArrayList();
							
							for ($n = 0; $n < count($ortsPfad); $n++)
							{
								echo $ortsPfad[$n]["Typ"]["Bezeichnung"].": ".$ortsPfad[$n]["Bezeichnung"];
								
								if ($n < count($ortsPfad) - 1)
								{
									echo "/";
								}
							}
							
							if ($m < count($orte) - 1)
							{
								echo ", \r";
							}
						}
						echo "\"";
						echo ";";
						
						echo $begehung->GetBezeichnung().";";
						if ($begehung->GetLfDErfassungsJahr() != "")
						{
							echo $begehung->GetLfDErfassungsJahr()."/".$begehung->GetLfDErfassungsNr();
						}
						echo ";";
						echo $begehung->GetDatum().";";
						echo "\"".$begehung->GetKommentar()."\""."\r";
					}
				}
			}
		}
	}
}
