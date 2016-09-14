<?php
include_once(__DIR__."/../config.php");
include_once(__DIR__."/../StdLib/class.TypedNode.php");
include_once(__DIR__."/class.OrtTyp.php");
include_once(__DIR__."/../Kontext/class.Kontext.php");

class Ort extends TypedNode
{
	// variables
	protected $_tableName = "Ort";
	
	// properties		
	// Teile
	public function GetTeile()
	{
		return $this->LoadTeile();
	}
	
	public function SetTeile($orte)
	{
		for ($i = 0; $i < count($orte); $i++)
		{
			$this->AddTeil($orte[$i]);
		}
	}
	
	public function AddTeil($ort)
	{
		$this->SaveAssociationWithTeil($ort);
	}
	
	public function RemoveTeil($ort)
	{
		$this->DeleteAssociationWithTeil($ort);
	}
	
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
	
	public function RemoveKontext($kontext)
	{
		$this->DeleteAssociationWithKontext($kontext);
	}

	// constructors

	// methods
		
	protected function GetInstance()
	{
		return new Ort();
	}
	
	protected function GetTypeInstance()
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

	protected function DeleteAssociationWithKontext($kontext)
	{
		if ($this->IsAssociatedWithKontext($kontext))
		{
			$id = $this->GetId();
			$kontext_Id = $kontext->GetId();
				
			$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
			
			if (!$mysqli->connect_errno)
			{
				$mysqli->set_charset("utf8");
				$ergebnis = $mysqli->query("DELETE FROM Kontext_Ort
											WHERE Ort_Id = ".$id." AND 
											Kontext_Id = ".$kontext_Id.";");
			}
			$mysqli->close();
		}
	}
	
	public function ConvertToAssocArrayWithProperties($withKontexten)
	{
		$assocArray = $this->ConvertToAssocArray($childrenDepth);
		
		if ($withKontexten)
		{
			$assocArray["Kontexte"] = array();
			$kontexte = $this->GetKontexte();			
			for ($i = 0; $i < count($kontexte); $i++)
			{
				array_push($assocArray["Kontexte"], $kontexte[$i]->ConvertToAssocArray());
			}
		}
		
		return $assocArray;
	}
	
	protected function LoadTeile()
	{
		$id = $this->GetId();
		$teile = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{			
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Ort_A_Id, Ort_B_Id
										FROM Ort_Ort
										WHERE Ort_A_Id = ".$id." 
										OR Ort_B_Id = ".$id.";");
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					$ortsTeil = new Ort();
					if (intval($datensatz["Ort_A_Id"]) == $id)
						$ortsTeil->LoadById(intval($datensatz["Ort_B_Id"]));
					else if (intval($datensatz["Ort_B_Id"]) == $id)
						$ortsTeil->LoadById(intval($datensatz["Ort_A_Id"]));
						
					array_push($teile, $ortsTeil);
				}
			}
		}
		
		$mysqli->close();
		return $teile;
	}

	protected function SaveAssociationWithTeil($teil)
	{
		if (!$this->IsAssociatedWithTeil($teil))
		{
			$id = $this->GetId();
			$teil_Id = $teil->GetId();
				
			$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
			
			if (!$mysqli->connect_errno)
			{
				$mysqli->set_charset("utf8");
				$ergebnis = $mysqli->query("INSERT INTO Ort_Ort(Ort_A_Id, Ort_B_Id)
											VALUES(".$id.", ".$teil_Id.");");
			}
			$mysqli->close();
		}
	}

	protected function IsAssociatedWithTeil($teil)
	{
		$isAssociatedWithTeil = false;
		$id = $this->GetId();
		$teil_Id = $teil->GetId();
		
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT COUNT(Ort_A_Id) AS Anzahl
										FROM Ort_Ort
										WHERE (Ort_A_Id = ".$id." AND
										Ort_B_Id = ".$teil_Id.") 
										OR (Ort_A_Id = ".$teil_Id." AND
										Ort_B_Id = ".$id.");");
			$datensatz = $ergebnis->fetch_assoc();
			$isAssociatedWithTeil = intval($datensatz["Anzahl"]) == 0 ? false : true;
		}
		$mysqli->close();
		
		return $isAssociatedWithTeil;
	}

	protected function DeleteAssociationWithTeil($teil)
	{
		if ($this->IsAssociatedWithTeil($teil))
		{
			$id = $this->GetId();
			$teil_Id = $teil->GetId();
				
			$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
			
			if (!$mysqli->connect_errno)
			{
				$mysqli->set_charset("utf8");
				$ergebnis = $mysqli->query("DELETE FROM Ort_Ort
											WHERE (Ort_A_Id = ".$id." AND
											Ort_B_Id = ".$teil_Id.") 
											OR (Ort_A_Id = ".$teil_Id." AND
											Ort_B_Id = ".$id.");");
			}
			$mysqli->close();
		}
	}
}
?>
