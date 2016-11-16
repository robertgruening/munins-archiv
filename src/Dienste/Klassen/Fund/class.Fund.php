<?php
include_once(__DIR__."/../config.php");
include_once(__DIR__."/../StdLib/class.ListElement.php");
include_once(__DIR__."/../Ablage/class.Ablage.php");
include_once(__DIR__."/../Kontext/class.Kontext.php");
include_once(__DIR__."/class.FundAttribut.php");

class Fund extends ListElement
{
	// variables
	protected $_tableName = "Fund";
	protected $_anzahl = NULL;
	
	// properties	
	// Anzahl
	public function GetAnzahl()
	{
		return $this->_anzahl;
	}
	
	public function SetAnzahl($anzahl)
	{
		$this->_anzahl = $anzahl;
	}
	
	// Ablage
	public function GetAblage()
	{
		return $this->LoadAblage();
	}
	
	public function SetAblage($ablage)
	{
		$this->SaveAssociationWithAblage($ablage);
	}
	
	// Kontext
	public function GetKontext()
	{
		return $this->LoadKontext();
	}
	
	public function SetKontexte($kontext)
	{
		$this->SaveAssociationWithKontext($kontext);
	}
	
	// Attribute
	public function GetAttribute()
	{
		return $this->LoadAttribute();
	}
	
	public function SetAttribute($attribute)
	{
		for ($i = 0; $i < count($attribute); $i++)
		{
			$this->AddAttribut($attribute[$i]);
		}
	}
	
	public function AddAttribut($attribut)
	{
		$this->SaveAssociationWithAttribut($attribut);
	}
	
	public function RemoveAttribut($attribut)
	{
		$this->DeleteAssociationWithAttribut($attribut);
	}

	// constructors
	
	// methods
	protected function GetInstance()
	{
		return new Fund();
	}
	
	protected function GetSQLStatementLoadById($id)
	{
		return "SELECT Id, Bezeichnung, Anzahl
				FROM ".$this->GetTableName()."
				WHERE Id = ".$id.";";
	}
	
	protected function GetSQLStatementLoadAll($offset, $limit, $bezeichnung)
	{
		$query = "SELECT Id, Bezeichnung, Anzahl
				FROM ".$this->GetTableName()." ";
				
		if ($bezeichnung != "")
			$query .= "WHERE Bezeichnung LIKE '%".$bezeichnung."%' ";
		
		$query .= "ORDER BY Bezeichnung ASC ";		
		
		if ($offset != null &&
			$limit != null)
		{
			$query .= ($offset >= 0 && $limit > 0 ? "LIMIT ".$offset.",".$limit." " : " ");
		}
		
		$query .= ";";
			
		return $query;
	}
	
	protected function FillThisInstance($datensatz)
	{
		parent::FillThisInstance($datensatz);
		$this->SetAnzahl($datensatz["Anzahl"]);
	}
	
	protected function CreateAndFillNewInstance($datensatz)
	{
		$instance = parent::CreateAndFillNewInstance($datensatz);
		$instance->SetAnzahl(intval($datensatz["Anzahl"]));
		
		return $instance;
	}
	
	protected function GetSQLStatementToInsert()
	{
		return "INSERT INTO ".$this->GetTableName()."(Bezeichnung, Anzahl)
				VALUES('".$this->GetBezeichnung()."', ".$this->GetAnzahl().");";
	}
	
	protected function GetSQLStatementToUpdate()
	{
		return "UPDATE ".$this->GetTableName()." 
				SET Bezeichnung='".$this->GetBezeichnung()."',				
					Anzahl=".$this->GetAnzahl()." 
				WHERE Id = ".$this->GetId().";";
	}	
	
	protected function LoadAblage()
	{
		$id = $this->GetId();
		$ablage = null;
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{			
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Ablage_Id
										FROM ".$this->GetTableName()."
										WHERE Id = ".$id.";");
			if (!$mysqli->errno)
			{
				$datensatz = $ergebnis->fetch_assoc();
				$ablage = new Ablage();
				$ablage->LoadById(intval($datensatz["Ablage_Id"]));
			}
		}
		
		$mysqli->close();
		return $ablage;
	}

	protected function SaveAssociationWithAblage($ablage)
	{
		$id = $this->GetId();
		$ablage_Id = $ablage->GetId();
			
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("UPDATE ".$this->GetTableName()."
										SET Ablage_Id=".$ablage_Id."
										WHERE Id=".$id.";");
		}
		$mysqli->close();
	}
	
	protected function LoadKontext()
	{
		$id = $this->GetId();
		$kontext = null;
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{			
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Kontext_Id
										FROM ".$this->GetTableName()."
										WHERE Id = ".$id.";");
			if (!$mysqli->errno)
			{
				$datensatz = $ergebnis->fetch_assoc();
				$kontext = new Kontext();
				$kontext->LoadById(intval($datensatz["Kontext_Id"]));
			}
		}
		
		$mysqli->close();
		return $kontext;
	}

	protected function SaveAssociationWithKontext($kontext)
	{
		$id = $this->GetId();
		$kontext_Id = $kontext->GetId();
			
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("UPDATE ".$this->GetTableName()."
										SET Kontext_Id=".$kontext_Id."
										WHERE Id=".$id.";");
		}
		$mysqli->close();
	}
	
	protected function LoadAttribute()
	{
		$id = $this->GetId();
		$attribute = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{			
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT FundAttribut_Id
										FROM Fund_FundAttribut
										WHERE Fund_Id = ".$id.";");
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					$attribut = new FundAttribut();
					$attribut->LoadById(intval($datensatz["FundAttribut_Id"]));
					array_push($attribute, $attribut);
				}
			}
		}
		
		$mysqli->close();
		return $attribute;
	}

	protected function SaveAssociationWithAttribut($attribut)
	{
		if (!$this->IsAssociatedWithAttribut($attribut))
		{
			$id = $this->GetId();
			$attribut_Id = $attribut->GetId();
				
			$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
			
			if (!$mysqli->connect_errno)
			{
				$mysqli->set_charset("utf8");
				$ergebnis = $mysqli->query("INSERT INTO Fund_FundAttribut(Fund_Id, FundAttribut_Id)
											VALUES(".$id.", ".$attribut_Id.");");
			}
			$mysqli->close();
		}
	}

	protected function DeleteAssociationWithAttribut($attribut)
	{
		if ($this->IsAssociatedWithAttribut($attribut))
		{
			$id = $this->GetId();
			$attribut_Id = $attribut->GetId();
				
			$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
			
			if (!$mysqli->connect_errno)
			{
				$mysqli->set_charset("utf8");
				$ergebnis = $mysqli->query("DELETE FROM Fund_FundAttribut
											WHERE Fund_Id = ".$id." AND 
											FundAttribut_Id = ".$attribut_Id.";");
			}
			$mysqli->close();
		}
	}

	protected function IsAssociatedWithAttribut($attribut)
	{
		$isAssociatedWithAttribut = false;
		$id = $this->GetId();
		$attribut_Id = $attribut->GetId();
		
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT COUNT(Fund_Id) AS Anzahl
										FROM Fund_FundAttribut
										WHERE Fund_Id = ".$id." AND
										FundAttribut_Id = ".$attribut_Id.";");
			$datensatz = $ergebnis->fetch_assoc();
			$isAssociatedWithAttribut = intval($datensatz["Anzahl"]) == 0 ? false : true;
		}
		$mysqli->close();
		
		return $isAssociatedWithAttribut;
	}
	
	public function ConvertToAssocArray()
	{
		$assocArray = parent::ConvertToAssocArray();
		$assocArray["Anzahl"] = $this->GetAnzahl();
		
		// Ablage
		$ablage = $this->GetAblage();
		$assocArray["Ablage"] = $ablage->ConvertToSimpleAssocArray();
		
		// Kontext
		$kontext = $this->GetKontext();	
		$assocArray["Kontext"] = $kontext->ConvertToSimpleAssocArray();		
		
		// Fundattribute
		$assocArrayAttribute = array();
		$attribute = $this->GetAttribute();			
		for ($i = 0; $i < count($attribute); $i++)
		{
			array_push($assocArrayAttribute, $attribute[$i]->ConvertToSimpleAssocArray());
		}
		$assocArray["Attribute"] =  $assocArrayAttribute;
		
		return $assocArray;
	}
}
?>
