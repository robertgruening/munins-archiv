<?php
include_once(__DIR__."/../config.php");
include_once(__DIR__."/class.ListType.php");

class TreeElement
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
		return new TreeElement();
	}
	
	public function GetTypeInstance()
	{
		return new ListType();
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
	
	public function LoadRoots()
	{
		$elements = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Id
										FROM ".$this->GetTableName()."
										WHERE Parent_Id IS NULL
										ORDER BY Bezeichnung ASC;");
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
	
	public function LoadChildren()
	{
		$id = $this->GetId();
		$children = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{			
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Id
							FROM ".$this->GetTableName()."
							WHERE Parent_Id = ".$id.";");
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
	
	public function LoadParent()
	{
		$id = $this->GetId();
		$parent = NULL;
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{			
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Parent_Id
							FROM ".$this->GetTableName()."
							WHERE Id = ".$id.";");
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

	protected function SaveAssociationWithParent($parent)
	{
		$id = $this->GetId();
		$parent_Id = $parent->GetId();
			
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("Update ".$this->GetTableName()."
										SET Parent_Id = ".$parent_Id."
										WHERE Id = ".$id.";");
		}
		$mysqli->close();
	}
	
	public function ConvertToAssocArray($childrenDepth)
	{
		$assocArray = array();
		$assocArray["Id"] = $this->GetId();
		$assocArray["Bezeichnung"] = $this->GetBezeichnung();
		$assocArray["FullBezeichnung"] = $this->GetFullBezeichnung();
		$assocArray["Typ"] = $this->GetTyp()->ConvertToAssocArray();
		
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
}
?>
