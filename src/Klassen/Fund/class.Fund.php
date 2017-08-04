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
	protected $_dimension1 = NULL;
	protected $_dimension2 = NULL;
	protected $_dimension3 = NULL;
	protected $_masse = NULL;
	
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
	
	// Dimension1
	public function GetDimension1()
	{
		return $this->_dimension1;
	}
	
	public function SetDimension1($dimension1)
	{
		$this->_dimension1 = $dimension1;
	}
	
	// Dimension2
	public function GetDimension2()
	{
		return $this->_dimension2;
	}
	
	public function SetDimension2($dimension2)
	{
		$this->_dimension2 = $dimension2;
	}
	
	// Dimension3
	public function GetDimension3()
	{
		return $this->_dimension3;
	}
	
	public function SetDimension3($dimension3)
	{
		$this->_dimension3 = $dimension3;
	}
	
	// Masse
	public function GetMasse()
	{
		return $this->_masse;
	}
	
	public function SetMasse($masse)
	{
		$this->_masse = $masse;
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
	
	protected function GetSQLStatementLoadByIds($offset, $limit, $filter)
	{
		$query = "SELECT Id, Bezeichnung, Anzahl, Dimension1, Dimension2, Dimension3, Masse
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
						{
							$query .= "OR ";
						}
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
	
	protected function GetSQLStatementLoadAll($offset, $limit, $bezeichnung)
	{
		$query = "SELECT Id, Bezeichnung, Anzahl, Dimension1, Dimension2, Dimension3, Masse
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
	
	protected function FillThisInstance($datensatz)
	{
		parent::FillThisInstance($datensatz);
		$this->SetAnzahl($datensatz["Anzahl"]);
		$this->SetDimension1($datensatz["Dimension1"]);
		$this->SetDimension2($datensatz["Dimension2"]);
		$this->SetDimension3($datensatz["Dimension3"]);
		$this->SetMasse($datensatz["Masse"]);
	}
	
	protected function CreateAndFillNewInstance($datensatz)
	{
		$instance = parent::CreateAndFillNewInstance($datensatz);
		$instance->SetAnzahl(intval($datensatz["Anzahl"]));
		$instance->SetDimension1($datensatz["Dimension1"]);
		$instance->SetDimension2($datensatz["Dimension2"]);
		$instance->SetDimension3($datensatz["Dimension3"]);
		$instance->SetMasse($datensatz["Masse"]);
		
		return $instance;
	}
	
	protected function GetSQLStatementToInsert()
	{
		return "INSERT INTO ".$this->GetTableName()."(Bezeichnung, Anzahl, Dimension1, Dimension2, Dimension3, Masse)
				VALUES('".
					$this->GetBezeichnung()."', ".
					$this->GetAnzahl().",".
					($this->GetDimension1() == NULL ? "NULL" : $this->GetDimension1()).",".
					($this->GetDimension2() == NULL ? "NULL" : $this->GetDimension2()).",".
					($this->GetDimension3() == NULL ? "NULL" : $this->GetDimension3()).",".
					($this->GetMasse() == NULL ? "NULL" : $this->GetMasse()).");";
	}
	
	protected function GetSQLStatementToUpdate()
	{
		return "UPDATE ".$this->GetTableName()." 
				SET Bezeichnung='".$this->GetBezeichnung()."', 
					Anzahl=".$this->GetAnzahl().", 
					Dimension1=".($this->GetDimension1() == NULL ? "NULL" : $this->GetDimension1()).", 
					Dimension2=".($this->GetDimension2() == NULL ? "NULL" : $this->GetDimension2()).", 
					Dimension3=".($this->GetDimension3() == NULL ? "NULL" : $this->GetDimension3()).", 
					Masse=".($this->GetMasse() == NULL ? "NULL" : $this->GetMasse())." 
				WHERE Id = ".$this->GetId().";";
	}	
	
	protected function LoadAblage()
	{
		$id = $this->GetId();
		$ablage = NULL;
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
		$kontext = NULL;
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
		$assocArray["Dimension1"] = $this->GetDimension1();	
		$assocArray["Dimension2"] = $this->GetDimension2();	
		$assocArray["Dimension3"] = $this->GetDimension3();	
		$assocArray["Masse"] = $this->GetMasse();	
		
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
