<?php
include_once(__DIR__."/../config.php");

class ListType
{
	// variables
	protected $_tableName = NULL;
	protected $_id = NULL;
	protected $_bezeichnung = NULL;
	
	// properties
	// table name
	protected function GetTableName()
	{
		return $this->_tableName;
	}
	
	// id
	public function GetId()
	{
		return $this->_id;
	}
	
	protected function SetId($id)
	{
		$this->_id = $id;
	}
	
	// Bezeichnung
	public function GetBezeichnung()
	{
		return $this->_bezeichnung;
	}
	
	public function SetBezeichnung($bezeichnung)
	{
		$this->_bezeichnung = $bezeichnung;
	}

	// constructors
	public function __constructor()
	{
	}

	// methods	
	public function GetInstance()
	{
		return new ListType();
	}
	
	public function LoadById($id)
	{
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Id, Bezeichnung
										FROM ".$this->GetTableName()."
										WHERE Id = ".$id.";");	
			if (!$mysqli->errno)
			{
				$datensatz = $ergebnis->fetch_assoc();
				$this->SetId(intval($datensatz["Id"]));
				$this->SetBezeichnung($datensatz["Bezeichnung"]);
			}		
		}
		
		$mysqli->close();
	}
	
	public function LoadAll()
	{		
		$treeTypes = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Id, Bezeichnung
										FROM ".$this->GetTableName()."
										ORDER BY Bezeichnung ASC;");	
			if (!$mysqli->errno)
			{				
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					$treeType = $this->GetInstance();
					$treeType->LoadById(intval($datensatz["Id"]));
					array_push($treeTypes, $treeType);
				}
			}		
		}
		
		$mysqli->close();
		
		return $treeTypes;
	}
	
	public function ConvertToAssocArray()
	{
		$assocArray = array();
		$assocArray["Id"] = $this->GetId();
		$assocArray["Bezeichnung"] = $this->GetBezeichnung();
		
		return $assocArray;
	}
}
?>
