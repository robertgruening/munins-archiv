<?php
include_once(__DIR__."/../config.php");
include_once(__DIR__."/../StdLib/class.TypedNode.php");
include_once(__DIR__."/class.FundAttributTyp.php");

class FundAttribut extends TypedNode
{
	// variables
	protected $_tableName = "FundAttribut";
	
	// properties

	// constructors

	// methods		
	
	protected function GetInstance()
	{
		return new FundAttribut();
	}
	
	protected function GetTypeInstance()
	{
		return new FundAttributTyp();
	}
	
	public function GetFunde()
	{
		return $this->LoadFunde();
	}
	
	protected function LoadFunde()
	{
		$id = $this->GetId();
		$funde = array();
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{			
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query("SELECT Fund_Id
							FROM Fund_FundAttribut
							WHERE FundAttribut_Id = ".$id.";");
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					$fund = new Fund();
					$fund->LoadById(intval($datensatz["Fund_Id"]));
					array_push($funde, $fund);
				}
			}
		}
		
		$mysqli->close();
		return $funde;
	}
}
?>
