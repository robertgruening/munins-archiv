<?php
include_once(__DIR__."/../config.php");

class Node
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
	public function GetParent()
	{
		return $this->LoadParent();
	}
	
	public function SetParent($parent)
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
		return new Node();
	}
	
	public function GetKennung()
	{
		$parent = $this->GetParent();
		if ($parent)
		{
			return $parent->GetKennung()."-".$this->GetBezeichnung();
		}
		
		return $this->GetBezeichnung();
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
		return "SELECT Id
				FROM ".$this->GetTableName()."
				WHERE Parent_Id IS NULL
				ORDER BY Typ_Id ASC, Bezeichnung ASC;";
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
		return "SELECT Id
				FROM ".$this->GetTableName()."
				WHERE Parent_Id = ".$this->GetId()."
				ORDER BY Bezeichnung ASC;";
	}
	
	public function LoadParent()
	{
		$parent = NULL;
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{			
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->GetSQLStatementToLoadParent());
			if (!$mysqli->errno)
			{
				$datensatz = $ergebnis->fetch_assoc();
				if ($datensatz["Parent_Id"] != NULL)
				{
					$parent = $this->GetInstance();
					$parent->LoadById(intval($datensatz["Parent_Id"]));
				}
			}
		}
		
		$mysqli->close();
		return $parent;
	}
	
	protected function GetSQLStatementToLoadParent()
	{
		return "SELECT Parent_Id
				FROM ".$this->GetTableName()."
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
		return "Update ".$this->GetTableName()."
				SET Parent_Id = ".$parent->GetId()."
				WHERE Id = ".$this->GetId().";";
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
		$assocArray["FullBezeichnung"] = $this->GetFullBezeichnung();
		
		return $assocArray;
	}
	
	public function ConvertRootChainToAssocArray()
	{
		$root = $this;
		$assocArrayRoot = $root->ConvertToAssocArray(0, false);
		
		while ($root->GetParent() != NULL)
		{
			$root = $root->GetParent();
			$tmp = $root->ConvertToAssocArray(0, false);
			$tmp["Children"] = array();
			array_push($tmp["Children"], $assocArrayRoot);
			$assocArrayRoot = $tmp;
		}
		
		return $assocArrayRoot;
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
