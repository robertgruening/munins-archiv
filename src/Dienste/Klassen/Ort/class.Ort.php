<?php
include_once(__DIR__."/../config.php");
include_once(__DIR__."/../StdLib/class.TypedNetNode.php");
include_once(__DIR__."/class.OrtTyp.php");
include_once(__DIR__."/../Kontext/class.Kontext.php");

class Ort extends TypedNetNode
{
	// variables
	protected $_tableName = "Ort";
	
	// properties	
	// Kontexte
	public function GetKontexte()
	{
		return $this->LoadKontexte();
	}
	
	public function SetKontexte($kontexte)
	{
		for ($i = 0; $i < count($kontexte); $i++)
		{
			$this->AddKontext($kontexte[$i]);
		}
	}
	
	public function AddKontext($kontext)
	{
		$this->SaveAssociationWithKontext($kontext);
	}

	// methods		
	public function GetInstance()
	{
		return new Ort();
	}
	
	public function GetTypeInstance()
	{
		return new OrtTyp();
	}
	
	protected function LoadKontexte()
	{
		$id = $this->GetId();
		$kontexte = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{			
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Kontext_Id
										FROM Kontext_Ort
										WHERE Ort_Id = ".$id.";");
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					$kontext = new Kontext();
					$kontext->LoadById(intval($datensatz["Kontext_Id"]));
					array_push($kontexte, $kontext);
				}
			}
		}
		
		$mysqli->close();
		return $kontexte;
	}

	protected function SaveAssociationWithKontext($kontext)
	{
		if (!$this->IsAssociatedWithKontext($kontext))
		{
			$id = $this->GetId();
			$kontext_Id = $kontext->GetId();
				
			$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
			
			if (!$mysqli->connect_errno)
			{
				$mysqli->set_charset("utf8");
				$ergebnis = $mysqli->query("INSERT INTO Kontext_Ort(Ort_Id, Kontext_Id)
											VALUES(".$id.", ".$kontext_Id.");");
			}
			$mysqli->close();
		}
	}

	protected function IsAssociatedWithKontext($kontext)
	{
		$isAssociatedWithKontext = false;
		$id = $this->GetId();
		$kontext_Id = $kontext->GetId();
		
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT COUNT(Ort_Id) AS Anzahl
										FROM Kontext_Ort
										WHERE Ort_Id = ".$id." AND
										Kontext_Id = ".$kontext_Id.";");
			$datensatz = $ergebnis->fetch_assoc();
			$isAssociatedWithKontext = intval($datensatz["Anzahl"]) == 0 ? false : true;
		}
		$mysqli->close();
		
		return $isAssociatedWithKontext;
	}
	
	public function ConvertToAssocArrayWithKontexten($childrenDepth)
	{
		$assocArray = $this->ConvertToAssocArray($childrenDepth);
		
		// Kontexte
		$assocArrayKontexte = array();
		$kontexte = $this->GetKontexte();			
		for ($i = 0; $i < count($kontexte); $i++)
		{
			array_push($assocArrayKontexte, $kontexte[$i]->ConvertRootChainToAssocArray());
			$assocArray["Kontexte"] =  $assocArrayKontexte;
		}
		
		return $assocArray;
	}
}
?>
