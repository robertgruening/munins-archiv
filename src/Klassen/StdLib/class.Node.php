<?php
include_once(__DIR__."/../config.php");

class Node
{
	// variables
	protected $_tableName = NULL;
	protected $_id = NULL;
	protected $_bezeichnung = NULL;
	protected $_ebene = NULL;
	
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
	
	// parent
	public function GetParent()
	{
		return $this->LoadParent();
	}
	
	public function SetParent($parent)
	{
		$this->SaveAssociationWithParent($parent);
		$this->SetEbene($parent->GetEbene() + 1);
	}
	
	// Ebene
	public function GetEbene()
	{
		return $this->_ebene ? $this->_ebene : 0;
	}
	
	public function SetEbene($ebene)
	{
		$this->_ebene = $ebene;
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

	// methods	
	
	protected function GetInstance()
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
				$this->FillThisInstance($ergebnis->fetch_assoc());
		}
		
		$mysqli->close();
	}
	
	protected function GetSQLStatementToLoadById($id)
	{
		return $this->GetSQLStatementToLoadByIds([$id]);
	}
	
	protected function FillThisInstance($datensatz)
	{
		$this->SetId(intval($datensatz["Id"]));
		$this->SetEbene(intval($datensatz["Ebene"]));
		$this->SetBezeichnung($datensatz["Bezeichnung"]);
	}
	
	protected function CreateAndFillNewInstance($datensatz)
	{
		$instance = $this->GetInstance();
		$instance->SetId(intval($datensatz["Id"]));
		$instance->SetEbene(intval($datensatz["Ebene"]));
		$instance->SetBezeichnung($datensatz["Bezeichnung"]);
		
		return $instance;
	}
	
	public function LoadByIds($ids)
	{
		$nodes = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->GetSQLStatementToLoadByIds($ids));	
			if (!$mysqli->errno)
			{				
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					array_push($nodes, $this->CreateAndFillNewInstance($datensatz));
				}
			}	
		}
		
		$mysqli->close();
		
		return $nodes;
	}
	
	protected function GetSQLStatementToLoadByIds($ids)
	{
		$sqlStatement = "SELECT Id, Bezeichnung, Ebene
						FROM ".$this->GetTableName()."
						WHERE ";
		
		for ($i = 0; $i < count($ids); $i++)
		{
			$sqlStatement .= "Id = ".$ids[$i]." ";
			
			if ($i < (count($ids) - 1))
				$sqlStatement .= "OR ";
		}
		
		$sqlStatement .= "ORDER BY ".$this->GetSQLOrderByStatement().";";
		
		return $sqlStatement;
	}
	
	protected function GetSQLOrderByStatement()
	{
		return "Bezeichnung ASC";
	}
	
	public function LoadRoots()
	{
		$rootNodes = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->GetSQLStatementToLoadRoots());
			if (!$mysqli->errno)
			{				
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					array_push($rootNodes, $this->CreateAndFillNewInstance($datensatz));
				}
			}		
		}
		
		$mysqli->close();
		
		return $rootNodes;
	}
	
	protected function GetSQLStatementToLoadRoots()
	{
		return "SELECT Id, Bezeichnung, Ebene
				FROM ".$this->GetTableName()."
				WHERE Parent_Id IS NULL
				ORDER BY ".$this->GetSQLOrderByStatement().";";
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
					array_push($children, $this->CreateAndFillNewInstance($datensatz));
				}
			}
		}
		
		$mysqli->close();
		return $children;
	}
	
	public function LoadSubtreeAsList()
	{
		$subtreeList = array();
		$children = $this->LoadChildren();
		
		for ($i = 0; $i < count($children); $i++)
		{
			array_push($subtreeList, $children[$i]);
			$subtreeList += $children[$i]->LoadSubtreeAsList();
		}
		
		return $subtreeList;
	}
	
	protected function GetSQLStatementToLoadChildren()
	{
		return "SELECT Id, Bezeichnung, Ebene
				FROM ".$this->GetTableName()."
				WHERE Parent_Id = ".$this->GetId()."
				ORDER BY ".$this->GetSQLOrderByStatement().";";
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
				if ($datensatz = $ergebnis->fetch_assoc())
					$parent = $this->CreateAndFillNewInstance($datensatz);
			}
		}
		
		$mysqli->close();
		return $parent;
	}
	
	protected function GetSQLStatementToLoadParent()
	{
		return "SELECT Id, Bezeichnung, Ebene
				FROM ".$this->GetTableName()."
				WHERE Id = (SELECT Parent_Id
							FROM ".$this->GetTableName()."
							WHERE Id = ".$this->GetId().");";
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
		return "INSERT INTO ".$this->GetTableName()."(Bezeichnung, Ebene)
				VALUES('".$this->GetBezeichnung()."', ".$this->GetEbene().");";
	}
	
	protected function GetSQLStatementToUpdate()
	{
		return "UPDATE ".$this->GetTableName()."
				SET Bezeichnung='".$this->GetBezeichnung()."',
					Ebene=".$this->GetEbene()."
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
	
	public function ConvertToSimpleAssocArray()
	{
		$assocArray = array();
		$assocArray["Id"] = $this->GetId();
		$assocArray["Bezeichnung"] = $this->GetBezeichnung();
		$assocArray["Ebene"] = $this->GetEbene();
		$assocArray["FullBezeichnung"] = $this->GetFullBezeichnung();
		
		return $assocArray;
	}
	
	public function ConvertToAssocArray()
	{
		$assocArray = $this->ConvertRootChainToSimpleAssocArray();		
		$children = $this->GetChildren();
		
		if ($children)
		{
			$assocArray["Children"] = array();
			
			for ($i = 0; $i < count($children); $i++)
			{
				 array_push($assocArray["Children"], $children[$i]->ConvertToSimpleAssocArray());
			}
		}		
		
		return $assocArray;
	}
	
	public function ConvertRootChainToSimpleAssocArray()
	{
		$assocArrayRoot = $this->ConvertToSimpleAssocArray();
		$parent = $this->GetParent();
		
		while ($parent)
		{
			$assocArrayParent = $parent->ConvertToSimpleAssocArray();
			$assocArrayParent["Children"] = array();
			array_push($assocArrayParent["Children"], $assocArrayRoot);
			$assocArrayRoot = $assocArrayParent;
			$parent = $parent->GetParent();
		}
		
		return $assocArrayRoot;
	}
	
	public function ConvertRootChainToSimpleAssocArrayList()
	{
		$assocArrayRoot = array();
		$parent = $this->GetParent();
		
		if ($parent)
			$assocArrayRoot = $parent->ConvertRootChainToSimpleAssocArrayList();
			
		array_push($assocArrayRoot, $this->ConvertToSimpleAssocArray());		
		
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
		$parent = $this->GetParent();
		
		if ($parent)
			$fullBezeichnung = $parent->GetFullBezeichnung();
			
		if ($parent &&
			$this->GetBezeichnung() != "")
			$fullBezeichnung .= "/";
			
		if ($this->GetBezeichnung() != "")
			$fullBezeichnung .= $this->GetBezeichnung();
		
		return $fullBezeichnung;
	}
}
?>
