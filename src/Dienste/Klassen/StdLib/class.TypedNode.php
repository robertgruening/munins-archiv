<?php
include_once(__DIR__."/../config.php");
include_once(__DIR__."/class.Node.php");
include_once(__DIR__."/class.ListElement.php");

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

	// methods	
	
	protected function GetInstance()
	{
		return new TypedNode();
	}
	
	protected function GetTypeInstance()
	{
		return new ListElement();
	}
	
	protected function FillThisInstance($datensatz)
	{
		parent::FillThisInstance($datensatz);
		$typ = $this->GetTypeInstance();
		$typ->LoadById(intval($datensatz["Typ_Id"]));
		$this->SetTyp($typ);
	}
	
	protected function CreateAndFillNewInstance($datensatz)
	{
		$instance = parent::CreateAndFillNewInstance($datensatz);
		$typ = $this->GetTypeInstance();
		$typ->LoadById(intval($datensatz["Typ_Id"]));
		$instance->SetTyp($typ);
		
		return $instance;
	}
	
	protected function GetSQLStatementToLoadByIds($ids)
	{
		$sqlStatement = "SELECT Id, Bezeichnung, Ebene, Typ_Id
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
		return "Typ_Id ASC, ".parent::GetSQLOrderByStatement();
	}
	
	protected function GetSQLStatementToLoadRoots()
	{
		return "SELECT Id, Bezeichnung, Ebene, Typ_Id
				FROM ".$this->GetTableName()."
				WHERE Parent_Id IS NULL
				ORDER BY ".$this->GetSQLOrderByStatement().";";
	}
	
	protected function GetSQLStatementToLoadChildren()
	{
		return "SELECT Id, Bezeichnung, Ebene, Typ_Id
				FROM ".$this->GetTableName()."
				WHERE Parent_Id = ".$this->GetId()."
				ORDER BY ".$this->GetSQLOrderByStatement().";";
	}
	
	protected function GetSQLStatementToLoadParent()
	{
		return "SELECT Id, Bezeichnung, Ebene, Typ_Id
				FROM ".$this->GetTableName()."
				WHERE Id = (SELECT Parent_Id
							FROM ".$this->GetTableName()."
							WHERE Id = ".$this->GetId().");";
	}
	
	protected function GetSQLStatementToInsert()
	{
		return "INSERT INTO ".$this->GetTableName()."(Bezeichnung, Ebene, Typ_Id)
				VALUES('".$this->GetBezeichnung()."', ".$this->GetEbene().", ".$this->GetTyp()->GetId().");";
	}
	
	protected function GetSQLStatementToUpdate()
	{
		return "UPDATE ".$this->GetTableName()."
				SET Bezeichnung='".$this->GetBezeichnung()."',
				Ebene=".$this->GetEbene().",
				Typ_Id=".$this->GetTyp()->GetId()."
				WHERE Id = ".$this->GetId().";";
	}
	
	public function ConvertToSimpleAssocArray()
	{
		$assocArray = parent::ConvertToSimpleAssocArray();
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
					array_push($elements, CreateAndFillNewInstance($datensatz));
				}
			}		
		}
		
		$mysqli->close();
		
		return $elements;
	}
	
	protected function GetSQLStatementToLoadRootsByTypId($typId)
	{
		return "SELECT Id, Bezeichnung, Ebene, Typ_Id
				FROM ".$this->GetTableName()."
				WHERE Parent_Id IS NULL AND
				Typ_Id = ".$typId."
				ORDER BY Typ_Id ASC, Bezeichnung ASC;";
	}
}
?>
