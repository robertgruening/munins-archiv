<?php
include_once(__DIR__."/../config.php");
include_once("class.Kontext.php");
include_once("class.LfD.php");

class Begehungsflaeche extends Kontext
{
	// variables
	protected $_lfDs = array();
	
	// properties	
	// LfDs
	public function GetLfDs()
	{
		return $this->LoadLfDs();
	}
	
	public function SetLfDs($lfds)
	{
		for ($i = 0; $i < count($lfds); $i++)
		{
			$this->AddLfD($lfds[$i]);
		}
	}
	
	public function AddLfD($lfd)
	{
		$this->SaveAssociationWithLfD($lfd);
	}	
	
	// constructor
	public function __constructor()
	{
	}
		
	// methods
	public function GetInstance()
	{
		return new Begehungsflaeche();
	}
	
	public function GetTypeInstance()
	{
		return new KontextTyp();
	}
	
	protected function LoadLfDs()
	{
		$id = $this->GetId();
		$lfds = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{			
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT LfD_Id
							FROM Kontext_LfD
							WHERE Kontext_Id = ".$id.";");
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					$lfd = new LfD();
					$lfd->LoadById(intval($datensatz["LfD_Id"]));
					array_push($lfds, $lfd);
				}
			}
		}
		
		$mysqli->close();
		return $lfds;
	}
	
	public function ConvertToAssocArray($childrenDepth)
	{
		$assocArray = parent::ConvertToAssocArray($childrenDepth);
		
		// LfDs
		$assocArrayLfDs = array();
		$lfds = $this->GetLfDs();			
		for ($i = 0; $i < count($lfds); $i++)
		{
			array_push($assocArrayLfDs, $lfds[$i]->ConvertToAssocArray());
			$assocArray["LfDs"] =  $assocArrayLfDs;
		}
		
		return $assocArray;
	}

	protected function SaveAssociationWithLfD($lfd)
	{
		if (!$this->IsAssociatedWithLfD($lfd))
		{
			$id = $this->GetId();
			$lfd_Id = $lfd->GetId();
				
			$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
			
			if (!$mysqli->connect_errno)
			{
				$mysqli->set_charset("utf8");
				$ergebnis = $mysqli->query("INSERT INTO Kontext_LfD(Kontext_Id, LfD_Id)
											VALUES(".$id.", ".$lfd_Id.");");
			}
			$mysqli->close();
		}
	}

	protected function IsAssociatedWithLfD($lfd)
	{
		$isAssociated = false;
		$id = $this->GetId();
		$lfd_Id = $lfd->GetId();
		
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT COUNT(Kontext_Id) AS Anzahl
										FROM Kontext_LfD
										WHERE Kontext_Id = ".$id." AND
										LfD_Id = ".$lfd_Id.";");
			$datensatz = $ergebnis->fetch_assoc();
			$isAssociated = intval($datensatz["Anzahl"]) == 0 ? false : true;
		}
		$mysqli->close();
		
		return $isAssociated;
	}
}
?>
