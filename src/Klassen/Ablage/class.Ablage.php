<?php
include_once(__DIR__."/../config.php");
include_once(__DIR__."/../StdLib/class.TypedNode.php");
include_once(__DIR__."/class.AblageTyp.php");
include_once(__DIR__."/../Kontext/class.Kontext.php");

class Ablage extends TypedNode
{
	// variables
	protected $_tableName = "Ablage";

	// constructors
	
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
	
	// Funde
	public function GetFunde()
	{
		return $this->LoadFunde();
	}
	
	public function SetFunde($funde)
	{
		for ($i = 0; $i < count($funde); $i++)
		{
			$this->AddFund($funde[$i]);
		}
	}
	
	public function AddFund($fund)
	{
		$this->SaveAssociationWithFund($fund);
	}

	// methods		
	protected function GetInstance()
	{
		return new Ablage();
	}
	
	protected function GetTypeInstance()
	{
		return new AblageTyp();
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
										FROM Ablage_Kontext
										WHERE Ablage_Id = ".$id.";");
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
				$ergebnis = $mysqli->query("INSERT INTO Ablage_Kontext(Ablage_Id, Kontext_Id)
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
			$ergebnis = $mysqli->query("SELECT COUNT(Ablage_Id) AS Anzahl
										FROM Ablage_Kontext
										WHERE Ablage_Id = ".$id." AND
										Kontext_Id = ".$kontext_Id.";");
			$datensatz = $ergebnis->fetch_assoc();
			$isAssociatedWithKontext = intval($datensatz["Anzahl"]) == 0 ? false : true;
		}
		$mysqli->close();
		
		return $isAssociatedWithKontext;
	}
	
	public function ConvertToAssocArrayWithProperties($withKontexten, $withFunden)
	{
		$assocArray = parent::ConvertToAssocArray();
		
		if ($withKontexten)
		{
			$assocArray["Kontexte"] = array();
			$kontexte = $this->GetKontexte();	
					
			for ($i = 0; $i < count($kontexte); $i++)
			{
				array_push($assocArray["Kontexte"], $kontexte[$i]->ConvertToAssocArray());
			}
		}
		
		if ($withFunden)
		{
			$assocArray["Funde"] = array();
			$funde = $this->GetFunde();		
				
			for ($i = 0; $i < count($funde); $i++)
			{
				array_push($assocArray["Funde"], $funde[$i]->ConvertToAssocArray());
			}
		}
		
		return $assocArray;
	}
	
	protected function LoadFunde()
	{
		$id = $this->GetId();
		$funde = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{			
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Id
							FROM Fund
							WHERE Ablage_Id = ".$id.";");
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					$fund = new Fund();
					$fund->LoadById(intval($datensatz["Id"]));
					array_push($funde, $fund);
				}
			}
		}
		
		$mysqli->close();
		return $funde;
	}

	protected function IsAssociatedWithFund($fund)
	{
		$isAssociated = false;
		$id = $this->GetId();
		$fund_Id = $fund->GetId();
		
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT COUNT(Ablage_Id) AS Anzahl
										FROM Fund
										WHERE Ablage_Id = ".$id." AND
										Id = ".$fund_Id.";");
			$datensatz = $ergebnis->fetch_assoc();
			$isAssociated = intval($datensatz["Anzahl"]) == 0 ? false : true;
		}
		$mysqli->close();
		
		return $isAssociated;
	}

	protected function SaveAssociationWithFund($fund)
	{
		if (!$this->IsAssociatedWithFund($fund))
		{
			$id = $this->GetId();
			$fund_Id = $fund->GetId();
				
			$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
			
			if (!$mysqli->connect_errno)
			{
				$mysqli->set_charset("utf8");
				$ergebnis = $mysqli->query("UPDATE Fund
											SET Ablage_Id=".$id."
											WHERE Id=".$fund_Id.";");
			}
			$mysqli->close();
		}
	}
	
	public function GetFullBezeichnung()
	{
		$fullBezeichnung = "";
		$kontexte = $this->GetKontexte();			
		
		if (count($kontexte) > 0)
			$fullBezeichnung .= $kontexte[0]->GetFullBezeichnung()."-".$this->GetBezeichnung();
		
		return $fullBezeichnung;
	}
}
?>
