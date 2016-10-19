<?php
include_once(__DIR__."/../config.php");
include_once("class.Kontext.php");

class Begehung extends Kontext
{
	// variables
	protected $_lfDErfassungsJahr = NULL;
	protected $_lfDErfassungsNr = NULL;
	protected $_datum = NULL;
	protected $_kommentar = NULL;
	
	// properties	
	// LfDErfassungsJahr
	public function GetLfDErfassungsJahr()
	{
		return $this->_lfDErfassungsJahr;
	}
	
	public function SetLfDErfassungsJahr($lfDErfassungsJahr)
	{
		$this->_lfDErfassungsJahr = $lfDErfassungsJahr;
	}
		
	// LfDErfassungsNr
	public function GetLfDErfassungsNr()
	{
		return $this->_lfDErfassungsNr;
	}
	
	public function SetLfDErfassungsNr($lfDErfassungsNr)
	{
		$this->_lfDErfassungsNr = $lfDErfassungsNr;
	}
		
	// Datum
	public function GetDatum()
	{
		return $this->_datum;
	}
	
	public function SetDatum($datum)
	{
		$this->_datum = $datum;
	}
		
	// Kommentar
	public function GetKommentar()
	{
		return $this->_kommentar;
	}
	
	public function SetKommentar($kommentar)
	{
		$this->_kommentar = $kommentar;
	}

	// constructors
		
	// methods
	protected function GetInstance()
	{
		return new Begehung();
	}
	
	protected function GetTypeInstance()
	{
		return new KontextTyp();
	}
	
	public function LoadById($id)
	{
		parent::LoadById($id);		
			
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Id, LfDErfassungsJahr, LfDErfassungsNr, Datum, Kommentar
										FROM Begehung
										WHERE Id = ".$id.";");	
			if (!$mysqli->errno)
			{
				$datensatz = $ergebnis->fetch_assoc();
				$this->SetLfDErfassungsJahr($datensatz["LfDErfassungsJahr"] == NULL ? NULL : intval($datensatz["LfDErfassungsJahr"]));
				$this->SetLfDErfassungsNr($datensatz["LfDErfassungsNr"] == NULL ? NULL : intval($datensatz["LfDErfassungsNr"]));
				$this->SetDatum($datensatz["Datum"]);
				$this->SetKommentar($datensatz["Kommentar"]);
			}		
		}
		
		$mysqli->close();
	}
	
	public function ConvertToAssocArrayWithProperties($withAblagen, $withFunden, $withOrten)
	{
		$assocArray = parent::ConvertToAssocArrayWithProperties($withAblagen, $withFunden, $withOrten);
		$assocArray["LfDErfassungsJahr"] = $this->GetLfDErfassungsJahr();
		$assocArray["LfDErfassungsNr"] = $this->GetLfDErfassungsNr();
		$assocArray["Datum"] = $this->GetDatum();
		$assocArray["Kommentar"] = $this->GetKommentar();
		
		return $assocArray;
	}	

	public function Save()
	{
		parent::Save();	
		
		$id = $this->GetId();
		$lfDErfassungsJahr = $this->GetLfDErfassungsJahr() == NULL ? "NULL" : $this->GetLfDErfassungsJahr();
		$lfDErfassungsNr = $this->GetLfDErfassungsNr() == NULL ? "NULL" : $this->GetLfDErfassungsNr();
		$datum = $this->GetDatum() == NULL ? "NULL" : "'".$this->GetDatum()."'";
		$kommentar = $this->GetKommentar() == NULL ? "NULL" : "'".$this->GetKommentar()."'";		
		
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			if ($this->IsInTableBegehung())
			{	
				$ergebnis = $mysqli->query("UPDATE Begehung
											SET LfDErfassungsJahr=".$lfDErfassungsJahr.",
												LfDErfassungsNr=".$lfDErfassungsNr.",
												Datum=".$datum.",
												Kommentar=".$kommentar."
											WHERE Id = ".$id.";");
			}
			else
			{
				$ergebnis = $mysqli->query("INSERT INTO Begehung(Id, LfDErfassungsJahr, LfDErfassungsNr, Datum, Kommentar)
											VALUES(".$id.", ".$lfDErfassungsJahr.", ".$lfDErfassungsNr.", ".$datum.", ".$kommentar.");");
			}
		}
		$mysqli->close();
	}
	

	protected function IsInTableBegehung()
	{
		$isInTable = false;
		$id = $this->GetId();
		
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT COUNT(Id) AS Anzahl
										FROM Begehung
										WHERE Id = ".$id.";");
			$datensatz = $ergebnis->fetch_assoc();
			$isInTable = intval($datensatz["Anzahl"]) == 0 ? false : true;
		}
		$mysqli->close();
		
		return $isInTable;
	}
	
	public function ConvertToSimpleAssocArray()
	{
		$assocArray = parent::ConvertToSimpleAssocArray();
		$assocArray["LfDErfassungsJahr"] = $this->GetLfDErfassungsJahr();
		$assocArray["LfDErfassungsNr"] = $this->GetLfDErfassungsNr();
		$assocArray["Datum"] = $this->GetDatum();
		$assocArray["Kommentar"] = $this->GetKommentar();
		
		return $assocArray;
	}
}
?>
