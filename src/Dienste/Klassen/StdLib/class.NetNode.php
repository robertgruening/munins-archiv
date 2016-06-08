<?php
include_once(__DIR__."/../config.php");

class NetNode
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
	
	// parent
	public function GetParents()
	{
		return $this->LoadParents();
	}
	
	public function SetParents($parents)
	{
		for ($i = 0; $i < count($parents); $i++)
		{
			$this->AddParent($parents[$i]);
		}
	}
	
	public function AddParent($parent)
	{
		$this->SaveAssociationWithParent($parent);
	}
	
	// children
	public function GetChildren()
	{
		return $this->LoadChildren();
	}
	
	public function SetChildren($children)
	{
		for ($i = 0; $i < count($children); $i++)
		{
			$this->AddChild($children[$i]);
		}
	}
	
	public function AddChild($child)
	{
		$child->SetParent($this);
	}

	// constructors
	public function __constructor()
	{
	}

	// methods	
	public function GetInstance()
	{
		return new NetNode();
	}

	public function LoadById($id)
	{		
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->GetSQLStatementToLoadById($id));	
			if (!$mysqli->errno)
			{
				$datensatz = $ergebnis->fetch_assoc();
				$this->Fill($datensatz);
			}		
		}
		
		$mysqli->close();
	}
	
	protected function GetSQLStatementToLoadById($id)
	{
		return "SELECT Id, Bezeichnung
				FROM ".$this->GetTableName()."
				WHERE Id = ".$id.";";
	}
	
	protected function Fill($datensatz)
	{
		$this->SetId(intval($datensatz["Id"]));
		$this->SetBezeichnung($datensatz["Bezeichnung"]);
	}
	
	public function LoadRoots()
	{
		$elements = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->GetSQLStatementToLoadRoots());
			if (!$mysqli->errno)
			{				
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					$element = $this->GetInstance();
					$element->LoadById(intval($datensatz["Id"]));
					array_push($elements, $element);
				}
			}		
		}
		
		$mysqli->close();
		
		return $elements;
	}
	
	protected function GetSQLStatementToLoadRoots()
	{
		return "SELECT t.Id
				FROM ".$this->GetTableName()." AS t LEFT JOIN ".
					$this->GetTableName()."_".$this->GetTableName()." AS tt
					ON t.Id = tt.Id
				WHERE tt.Parent_Id IS NULL
				ORDER BY t.Bezeichnung ASC;";
	}
	
	public function LoadChildren()
	{
		$children = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{			
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->GetSQLStatementToLoadChildren());
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					$child = $this->GetInstance();
					$child->LoadById(intval($datensatz["Id"]));
					array_push($children, $child);
				}
			}
		}
		
		$mysqli->close();
		return $children;
	}
	
	protected function GetSQLStatementToLoadChildren()
	{
		return "SELECT t.Id
				FROM ".$this->GetTableName()." AS t LEFT JOIN ".
					$this->GetTableName()."_".$this->GetTableName()." AS tt
					ON t.Id = tt.Id
				WHERE tt.Parent_Id = ".$this->GetId()."
				ORDER BY t.Bezeichnung ASC;";
	}
	
	public function LoadParents()
	{
		$parents = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{			
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->GetSQLStatementToLoadParents());
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					$parent = $this->GetInstance();
					$parent->LoadById(intval($datensatz["Parent_Id"]));
					array_push($parents, $parent);
				}
			}
		}
		
		$mysqli->close();
		return $parents;
	}
	
	protected function GetSQLStatementToLoadParents()
	{
		return "SELECT Parent_Id
				FROM ".$this->GetTableName()."_".$this->GetTableName()."
				WHERE Id = ".$this->GetId().";";
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
				FROM ".$this->GetTableName()."_".$this->GetTableName()."
				WHERE Id = ".$this->GetId().";
				DELETE
				FROM ".$this->GetTableName()."
				WHERE Id = ".$this->GetId().";";
	}

	protected function SaveAssociationWithParent($parent)
	{			
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->GetSQLStatementToSaveAssociationWithParent($parent));
		}
		$mysqli->close();
	}
	
	protected function GetSQLStatementToSaveAssociationWithParent($parent)
	{
		return "INSERT INTO ".$this->GetTableName()."_".$this->GetTableName()."(Id, Parent_Id)
				VALUES(".$this->GetId().", ".$parent->GetId().";";
	}

	public function ConvertToAssocArray($childrenDepth)
	{
		$assocArray = $this->FillAssocArray();
		
		if ($childrenDepth > 0)
		{
			$children = $this->GetChildren();
			$assocArray["Children"] = array();		
			for ($i = 0; $i < count($children); $i++)
			{
				array_push($assocArray["Children"], $children[$i]->ConvertToAssocArray($childrenDepth - 1));
			}
		}
		
		return $assocArray;
	}
	
	protected function FillAssocArray()
	{
		$assocArray = array();
		$assocArray["Id"] = $this->GetId();
		$assocArray["Bezeichnung"] = $this->GetBezeichnung();
		
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
