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
		return $this->GetSQLStatementLoadByIds(NULL, NULL, array( "Ids" => array($id) ));
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
				FROM ".$this->GetTableName()." ";
				
		if ($bezeichnung != "")
			$query .= "WHERE Bezeichnung LIKE '%".$bezeichnung."%' ";
		
		$query .= "ORDER BY Bezeichnung ASC ";
		
		if (!is_null($offset) &&
			!is_null($limit))
		{
			$query .= ($offset >= 0 && $limit > 0 ? "LIMIT ".$offset.",".$limit." " : " ");
		}
		
		$query .= ";";
				
		return $query;
	}
	
	public function LoadByIds($offset, $limit, $filter)
	{
		$treeElements = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->GetSQLStatementLoadByIds($offset, $limit, $filter));	
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
	
	protected function GetSQLStatementLoadByIds($offset, $limit, $filter)
	{
		$query = "SELECT Id, Bezeichnung
				FROM ".$this->GetTableName()." ";
								
		if (count(array_keys($filter)) > 0)
		{
			$query .= "WHERE ";
			
			for ($i = 0; $i < count(array_keys($filter)); $i++)
			{
				if ($i > 0)
				{
					$query .= "AND ";
				}
				
				$query .= "(";
					
				if (array_keys($filter)[$i] == "Beschriftung")
				{
					$query .= "Bezeichnung LIKE '%".$filter[array_keys($filter)[$i]]."%' ";
				}
				else if (array_keys($filter)[$i] == "Ids")
				{
					for ($j = 0; $j < count($filter[array_keys($filter)[$i]]); $j++)
					{
						$query .= "Id = ".$filter[array_keys($filter)[$i]][$j]." ";
						
						if ($j < (count($filter[array_keys($filter)[$i]]) - 1))
							$query .= "OR ";
					}
				}
				
				$query .= ") ";
			}
		}						
		
		$query .= "ORDER BY Bezeichnung ASC ";
		
		if (!is_null($offset) &&
			!is_null($limit))
		{
			$query .= ($offset >= 0 && $limit > 0 ? "LIMIT ".$offset.",".$limit." " : " ");
		}
		
		$query .= ";";
				
		return $query;
	}

	public function Save()
	{		
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			
			if (is_null($this->GetId()))
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

	public function Count($filter)
	{
		$count = 0;
			
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->GetSQLStatementCount($filter));
			if (!$mysqli->errno)
			{
				$datensatz = $ergebnis->fetch_assoc();
				$count = intval($datensatz["Anzahl"]);
			}
		}
		$mysqli->close();
		
		return $count;
	}
	
	protected function GetSQLStatementCount($filter)
	{
		$query = "SELECT COUNT(Id) AS Anzahl
				FROM ".$this->GetTableName()." ";
								
		if (count(array_keys($filter)) > 0)
		{
			$query .= "WHERE ";
			
			for ($i = 0; $i < count(array_keys($filter)); $i++)
			{
				if ($i > 0)
				{
					$query .= "AND ";
				}
				
				$query .= "(";
					
				if (array_keys($filter)[$i] == "Beschriftung")
				{
					$query .= "Bezeichnung LIKE '%".$filter[array_keys($filter)[$i]]."%' ";
				}
				else if (array_keys($filter)[$i] == "Ids")
				{
					for ($j = 0; $j < count($filter[array_keys($filter)[$i]]); $j++)
					{
						$query .= "Id = ".$filter[array_keys($filter)[$i]][$j]." ";
						
						if ($j < (count($filter[array_keys($filter)[$i]]) - 1))
							$query .= "OR ";
					}
				}
				
				$query .= ") ";
			}
		}
		
		$query .= ";";
				
		return $query;
	}
}
?>
