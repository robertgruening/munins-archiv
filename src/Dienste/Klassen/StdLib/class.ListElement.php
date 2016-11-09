<?php
include_once(__DIR__."/../config.php");

class ListElement
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
	
	public function SetId($id)
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

	// methods	
	protected function GetInstance()
	{
		return new ListElement();
	}
	
	public function LoadById($id)
	{
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->GetSQLStatementLoadById($id));	
			
			if (!$mysqli->errno)
				$this->FillThisInstance($ergebnis->fetch_assoc());
		}
		
		$mysqli->close();
	}
	
	protected function GetSQLStatementLoadById($id)
	{
		return $this->GetSQLStatementLoadByIds([$id]);
	}
	
	protected function FillThisInstance($datensatz)
	{
		$this->SetId(intval($datensatz["Id"]));
		$this->SetBezeichnung($datensatz["Bezeichnung"]);
	}
	
	protected function CreateAndFillNewInstance($datensatz)
	{
		$instance = $this->GetInstance();
		$instance->SetId(intval($datensatz["Id"]));
		$instance->SetBezeichnung($datensatz["Bezeichnung"]);
		
		return $instance;
	}
	
	public function LoadAll($offset, $limit, $bezeichnung)
	{		
		$rootElements = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->GetSQLStatementLoadAll($offset, $limit, $bezeichnung));	
			if (!$mysqli->errno)
			{				
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					array_push($rootElements, $this->CreateAndFillNewInstance($datensatz));
				}
			}		
		}
		
		$mysqli->close();
		
		return $rootElements;
	}
	
	protected function GetSQLStatementLoadAll($offset, $limit, $bezeichnung)
	{
		$query = "SELECT Id, Bezeichnung
				FROM ".$this->GetTableName();
				
		if ($bezeichnung != "")
			$query .= "WHERE Bezeichnung LIKE '%".$bezeichnung."%'";
		
		$query .= "ORDER BY Bezeichnung ASC
				".($offset >= 0 && $limit > 0 ? "LIMIT ".$offset.",".$limit : "").";";
				
		return $query;
	}
	
	public function LoadByIds($ids)
	{
		$treeElements = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->GetSQLStatementLoadByIds($ids));	
			if (!$mysqli->errno)
			{				
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					array_push($treeElements, $this->CreateAndFillNewInstance($datensatz));
				}
			}	
		}
		
		$mysqli->close();
		
		return $treeElements;
	}
	
	protected function GetSQLStatementLoadByIds($ids)
	{
		$sqlStatement = "SELECT Id, Bezeichnung
						FROM ".$this->GetTableName()."
						WHERE ";
		
		for ($i = 0; $i < count($ids); $i++)
		{
			$sqlStatement .= "Id = ".$ids[$i]." ";
			
			if ($i < (count($ids) - 1))
				$sqlStatement .= "OR ";
		}
		
		$sqlStatement .= "ORDER BY Bezeichnung;";
		
		return $sqlStatement;
	}

	public function Save()
	{		
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			if ($this->GetId() == NULL)
			{			
				$ergebnis = $mysqli->query($this->GetSQLStatementToInsert());
				if (!$mysqli->errno)
				{
					$id = intval($mysqli->insert_id);
					$this->SetId($id);
				}
			}
			else
			{
				$ergebnis = $mysqli->query($this->GetSQLStatementToUpdate());
			}
		}
		$mysqli->close();
	}
	
	protected function GetSQLStatementToInsert()
	{
		return "INSERT INTO ".$this->GetTableName()."(Bezeichnung)
				VALUES('".$this->GetBezeichnung()."');";
	}
	
	protected function GetSQLStatementToUpdate()
	{
		return "UPDATE ".$this->GetTableName()."
				SET Bezeichnung='".$this->GetBezeichnung()."'
				WHERE Id = ".$this->GetId().";";
	}

	public function Delete()
	{		
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->GetSQLStatementToDelete());
		}
		$mysqli->close();
	}
	
	protected function GetSQLStatementToDelete()
	{
		return "DELETE
				FROM ".$this->GetTableName()."
				WHERE Id = ".$this->GetId().";";
	}
	
	public function ConvertToAssocArray()
	{
		$assocArray = array();
		$assocArray["Id"] = $this->GetId();
		$assocArray["Bezeichnung"] = $this->GetBezeichnung();
		
		return $assocArray;
	}

	public function Count($bezeichnung)
	{
		$count = 0;
			
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->GetSQLStatementCount($bezeichnung));
			if (!$mysqli->errno)
			{
				$datensatz = $ergebnis->fetch_assoc();
				$count = intval($datensatz["Anzahl"]);
			}
		}
		$mysqli->close();
		
		return $count;
	}
	
	protected function GetSQLStatementCount($bezeichnung)
	{
		$query = "SELECT COUNT(Id) AS Anzahl
				FROM ".$this->GetTableName()." ";
				
		if ($bezeichnung != "")
			$query .= "WHERE Bezeichnung LIKE '%".$bezeichnung."%'";
		
		$query .= ";";
				
		return $query;
	}
}
?>
