<?php
include_once(__DIR__."/../config.php");
include_once(__DIR__."/class.ListType.php");

class ListElement
{
	// variables
	protected $_tableName = NULL;
	protected $_id = NULL;
	protected $_bezeichnung = NULL;
	protected $_typ = NULL;
	
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
	
	// Typ
	public function GetTyp()
	{
		return $this->_typ;
	}
	
	public function SetTyp($typ)
	{
		$this->_typ = $typ;
	}

	// constructors
	public function __constructor()
	{
	}

	// methods	
	public function GetInstance()
	{
		return new ListElement();
	}
	
	public function GetTypeInstance()
	{
		return new ListType();
	}

	public function LoadById($id)
	{		
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Id, Bezeichnung, Typ_Id
										FROM ".$this->GetTableName()."
										WHERE Id = ".$id.";");	
			if (!$mysqli->errno)
			{
				$datensatz = $ergebnis->fetch_assoc();
				$this->SetId(intval($datensatz["Id"]));
				$this->SetBezeichnung($datensatz["Bezeichnung"]);
				$typ = $this->GetTypeInstance();
				$typ->LoadById(intval($datensatz["Typ_Id"]));
				$this->SetTyp($typ);
			}		
		}
		
		$mysqli->close();
	}

	public function Save()
	{
		$id = $this->GetId();
		$bezeichnung = $this->GetBezeichnung();
		$typ_Id = $this->GetTyp()->GetId();
		
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			if ($id == NULL)
			{			
				$ergebnis = $mysqli->query("INSERT INTO ".$this->GetTableName()."(Bezeichnung, Typ_Id)
											VALUES('".$bezeichnung."', ".$typ_Id.");");
				if (!$mysqli->errno)
				{
					$id = intval($mysqli->insert_id);
					$this->SetId($id);
				}
			}
			else
			{
				$ergebnis = $mysqli->query("UPDATE ".$this->GetTableName()."
											SET Bezeichnung='".$bezeichnung."',
												Typ_Id=".$typ_Id."
											WHERE Id = ".$id.";");
			}
		}
		$mysqli->close();
	}

	public function Delete()
	{
		$id = $this->GetId();
		
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("DELETE
										FROM ".$this->GetTableName()."
										WHERE Id = ".$id.";");
		}
		$mysqli->close();
	}
	
	public function ConvertToAssocArray()
	{
		$assocArray = array();
		$assocArray["Id"] = $this->GetId();
		$assocArray["Bezeichnung"] = $this->GetBezeichnung();
		$assocArray["Typ"] = $this->GetTyp()->ConvertToAssocArray();		
		
		return $assocArray;
	}

	public function Count()
	{
		$count = 0;
			
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT COUNT(Id) AS Anzahl
										FROM ".$this->GetTableName().";");
			if (!$mysqli->errno)
			{
				$datensatz = $ergebnis->fetch_assoc();
				$count = intval($datensatz["Anzahl"]);
			}
		}
		$mysqli->close();
		
		return $count;
	}
}
?>
