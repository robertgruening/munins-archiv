<?php
include_once(__DIR__."/../config.php");
include_once(__DIR__."/class.Node.php");
include_once(__DIR__."/class.ListType.php");

class TypedNode extends Node
{
	// variables
	protected $_typ = NULL;
	
	// properties	
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
		return new TypedNode();
	}
	
	public function GetTypeInstance()
	{
		return new ListType();
	}
	
	protected function GetSQLStatementToLoadById($id)
	{
		return "SELECT Id, Bezeichnung, Typ_Id
				FROM ".$this->GetTableName()."
				WHERE Id = ".$id.";";
	}
	
	protected function Fill($datensatz)
	{
		$this->SetId(intval($datensatz["Id"]));
		$this->SetBezeichnung($datensatz["Bezeichnung"]);
		$typ = $this->GetTypeInstance();
		$typ->LoadById(intval($datensatz["Typ_Id"]));
		$this->SetTyp($typ);
	}
	
	protected function GetSQLStatementToInsert()
	{
		return "INSERT INTO ".$this->GetTableName()."(Bezeichnung, Typ_Id)
				VALUES('".$this->GetBezeichnung()."', ".$this->GetTyp()->GetId().");";
	}
	
	protected function GetSQLStatementToUpdate()
	{
		return "UPDATE ".$this->GetTableName()."
				SET Bezeichnung='".$this->GetBezeichnung()."',
					Typ_Id=".$this->GetTyp()->GetId()."
				WHERE Id = ".$this->GetId().";";
	}
	
	protected function FillAssocArray()
	{
		$assocArray = parent::FillAssocArray();
		$assocArray["Typ"] = $this->GetTyp()->ConvertToAssocArray();
		
		return $assocArray;
	}	
	
	public function LoadRootsByTypId($typId)
	{
		$elements = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->GetSQLStatementToLoadRootsByTypId($typId));
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
	
	protected function GetSQLStatementToLoadRootsByTypId($typId)
	{
		return "SELECT Id
				FROM ".$this->GetTableName()."
				WHERE Parent_Id IS NULL AND
				Typ_Id = ".$typId."
				ORDER BY Typ_Id ASC, Bezeichnung ASC;";
	}
	
	protected function GetSQLStatementToLoadRoots()
	{
		return "SELECT Id
				FROM ".$this->GetTableName()."
				WHERE Parent_Id IS NULL
				ORDER BY Typ_Id ASC, Bezeichnung ASC;";
	}	
}
?>
