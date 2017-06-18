<?php
include_once(__DIR__."/../config.php");

class LfD
{
	// variables
	protected $_tableName = "LfD";
	protected $_id = NULL;
	protected $_tk25Nr = NULL;
	protected $_nr = NULL;
	
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
	
	// TK25Nr
	public function GetTK25Nr()
	{
		return $this->_tk25Nr;
	}
	
	public function SetTK25Nr($tk25Nr)
	{
		$this->_tk25Nr = $tk25Nr;
	}
	
	// Nr
	public function GetNr()
	{
		return $this->_nr;
	}
	
	public function SetNr($nr)
	{
		$this->_nr = $nr;
	}

	// constructors
	public function __constructor()
	{
	}

	// methods	
	public function LoadById($id)
	{
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Id, TK25Nr, Nr
										FROM ".$this->GetTableName()."
										WHERE Id = ".$id.";");
			if (!$mysqli->errno)
			{
				$datensatz = $ergebnis->fetch_assoc();
				$this->SetId(intval($datensatz["Id"]));
				$this->SetTK25Nr(intval($datensatz["TK25Nr"]));
				$this->SetNr(intval($datensatz["Nr"]));
			}		
		}
		
		$mysqli->close();
	}
	
	public function LoadByTK25NrAndNr($tk25Nr, $nr)
	{
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Id
										FROM ".$this->GetTableName()."
										WHERE TK25Nr = ".$tk25Nr." AND 
											Nr = ".$nr.";");	
			if (!$mysqli->errno)
			{
				$datensatz = $ergebnis->fetch_assoc();
				$this->LoadById(intval($datensatz["Id"]));
			}		
		}
		
		$mysqli->close();
	}
	
	public function LoadAll()
	{		
		$lfds = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Id
										FROM ".$this->GetTableName()."
										ORDER BY TK25Nr, Nr ASC;");	
			if (!$mysqli->errno)
			{				
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					$lfd = new LfD();
					$lfd->LoadById(intval($datensatz["Id"]));
					array_push($lfds, $lfd);
				}
			}		
		}
		
		$mysqli->close();
		
		return $lfds;
	}

	public function Save()
	{
		$id = $this->GetId();
		$tk25Nr = $this->GetTK25Nr();
		$nr = $this->GetNr();
		
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			if ($id == NULL)
			{			
				$ergebnis = $mysqli->query("INSERT INTO ".$this->GetTableName()."(TK25Nr, Nr)
											VALUES(".$tk25Nr.", ".$nr.");");
				if (!$mysqli->errno)
				{
					$id = intval($mysqli->insert_id);
					$this->SetId($id);
				}
			}
			else
			{
				$ergebnis = $mysqli->query("UPDATE ".$this->GetTableName()."
											SET TK25Nr=".$tk25Nr.",
												Nr=".$nr."
											WHERE Id = ".$id.";");
			}
		}
		$mysqli->close();
	}
	
	public function ConvertToAssocArray()
	{
		$assocArray = array();
		$assocArray["Id"] = $this->GetId();
		$assocArray["TK25Nr"] = $this->GetTK25Nr();
		$assocArray["Nr"] = $this->GetNr();
		
		return $assocArray;
	}
}
?>
