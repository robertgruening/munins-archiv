<?php
include_once(__DIR__."/../config.php");
include_once(__DIR__."/../StdLib/class.TreeElement.php");
include_once(__DIR__."/class.KontextTyp.php");
include_once(__DIR__."/../Ablage/class.Ablage.php");
include_once(__DIR__."/../Ort/class.Ort.php");

class Kontext extends TreeElement
{
	// variables
	protected $_tableName = "Kontext";
	
	// properties	
	// Ablagen
	public function GetAblagen()
	{
		return $this->LoadAblagen();
	}
	
	public function SetAblagen($ablagen)
	{
		for ($i = 0; $i < count($ablagen); $i++)
		{
			$this->AddAblage($ablagen[$i]);
		}
	}
	
	public function AddAblage($ablage)
	{
		$this->SaveAssociationWithAblage($ablage);
	}
			
	// Orte
	public function GetOrte()
	{
		return $this->LoadOrte();
	}
	
	public function SetOrte($orte)
	{
		for ($i = 0; $i < count($orte); $i++)
		{
			$this->AddOrt($orte[$i]);
		}
	}
	
	public function AddOrt($ort)
	{
		$this->SaveAssociationWithOrt($ort);
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
	public function GetInstance()
	{
		return new Kontext();
	}
	
	public function GetTypeInstance()
	{
		return new KontextTyp();
	}
	
	protected function LoadAblagen()
	{
		$id = $this->GetId();
		$ablagen = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{			
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Ablage_Id
							FROM Ablage_Kontext
							WHERE Kontext_Id = ".$id.";");
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					$ablage = new Ablage();
					$ablage->LoadById(intval($datensatz["Ablage_Id"]));
					array_push($ablagen, $ablage);
				}
			}
		}
		
		$mysqli->close();
		return $ablagen;
	}

	protected function SaveAssociationWithAblage($ablage)
	{
		if (!$this->IsAssociatedWithAblage($ablage))
		{
			$id = $this->GetId();
			$ablage_Id = $ablage->GetId();
				
			$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
			
			if (!$mysqli->connect_errno)
			{
				$mysqli->set_charset("utf8");
				$ergebnis = $mysqli->query("INSERT INTO Ablage_Kontext(Kontext_Id, Ablage_Id)
											VALUES(".$id.", ".$ablage_Id.");");
			}
			$mysqli->close();
		}
	}

	protected function IsAssociatedWithAblage($ablage)
	{
		$isAssociatedWithAblage = false;
		$id = $this->GetId();
		$ablage_Id = $ablage->GetId();
		
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT COUNT(Kontext_Id) AS Anzahl
										FROM Ablage_Kontext
										WHERE Kontext_Id = ".$id." AND
										Ablage_Id = ".$ablage_Id.";");
			$datensatz = $ergebnis->fetch_assoc();
			$isAssociatedWithAblage = intval($datensatz["Anzahl"]) == 0 ? false : true;
		}
		$mysqli->close();
		
		return $isAssociatedWithAblage;
	}
	
	public function ConvertToAssocArrayWithAblagen($childrenDepth)
	{
		$assocArray = $this->ConvertToAssocArray($childrenDepth);
		
		// Ablagen
		$assocArrayAblagen = array();
		$ablagen = $this->GetAblagen();			
		for ($i = 0; $i < count($ablagen); $i++)
		{
			array_push($assocArrayAblagen, $ablagen[$i]->ConvertRootChainToAssocArray());
			$assocArray["Ablagen"] =  $assocArrayAblagen;
		}
		
		// Funde
		$assocArrayFunde = array();
		$funde = $this->GetFunde();			
		for ($i = 0; $i < count($funde); $i++)
		{
			array_push($assocArrayFunde, $funde[$i]->ConvertToAssocArray());
			$assocArray["Funde"] =  $assocArrayFunde;
		}
		
		return $assocArray;
	}
	
	protected function LoadOrte()
	{
		$id = $this->GetId();
		$orte = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{			
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Ort_Id
										FROM Kontext_Ort
										WHERE Kontext_Id = ".$id.";");
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					$ort = new Ort();
					$ort->LoadById(intval($datensatz["Ort_Id"]));
					array_push($orte, $ort);
				}
			}
		}
		
		$mysqli->close();
		return $orte;
	}

	protected function SaveAssociationWithOrt($ort)
	{
		if (!$this->IsAssociatedWithOrt($ort))
		{
			$id = $this->GetId();
			$ort_Id = $ort->GetId();
				
			$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
			
			if (!$mysqli->connect_errno)
			{
				$mysqli->set_charset("utf8");
				$ergebnis = $mysqli->query("INSERT INTO Kontext_Ort(Kontext_Id, Ort_Id)
											VALUES(".$id.", ".$ort_Id.");");
			}
			$mysqli->close();
		}
	}

	protected function IsAssociatedWithOrt($ort)
	{
		$isAssociatedWithAblage = false;
		$id = $this->GetId();
		$ort_Id = $ort->GetId();
		
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT COUNT(Kontext_Id) AS Anzahl
										FROM Kontext_Ort
										WHERE Kontext_Id = ".$id." AND
										Ort_Id = ".$ort_Id.";");
			$datensatz = $ergebnis->fetch_assoc();
			$isAssociatedWithOrt = intval($datensatz["Anzahl"]) == 0 ? false : true;
		}
		$mysqli->close();
		
		return $isAssociatedWithAblage;
	}
	
	public function ConvertToAssocArrayWithOrten($childrenDepth)
	{
		$assocArray = $this->ConvertToAssocArray($childrenDepth);
		
		// Orte
		$assocArrayOrte = array();
		$orte = $this->GetOrte();			
		for ($i = 0; $i < count($orte); $i++)
		{
			array_push($assocArrayOrte, $orte[$i]->ConvertToAssocArray(0));
			$assocArray["Orte"] =  $assocArrayOrte;
		}
		
		// Funde
		$assocArrayFunde = array();
		$funde = $this->GetFunde();			
		for ($i = 0; $i < count($funde); $i++)
		{
			array_push($assocArrayFunde, $funde[$i]->ConvertToAssocArray());
			$assocArray["Funde"] =  $assocArrayFunde;
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
							WHERE Kontext_Id = ".$id.";");
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
			$ergebnis = $mysqli->query("SELECT COUNT(Kontext_Id) AS Anzahl
										FROM Fund
										WHERE Kontext_Id = ".$id." AND
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
											SET Kontext_Id=".$id."
											WHERE Id=".$fund_Id.";");
			}
			$mysqli->close();
		}
	}
	
	public function GetFullBezeichnung()
	{
		$fullBezeichnung = "";
		
		if ($this->GetParent() != NULL)
			$fullBezeichnung = $this->GetParent()->GetFullBezeichnung();
			
		if ($this->GetParent() != NULL &&
			$this->GetBezeichnung() != "")
			$fullBezeichnung .= "-";
			
		if ($this->GetBezeichnung() != "")
			$fullBezeichnung .= $this->GetBezeichnung();
		
		return $fullBezeichnung;
	}
}
?>
