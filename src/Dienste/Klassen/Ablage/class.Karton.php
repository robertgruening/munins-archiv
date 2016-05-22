<?php
include_once(__DIR__."/../config.php");
include_once("class.Ablage.php");

class Karton extends Ablage
{
	// variables
	
	// properties
	
	// constructor
	public function __constructor()
	{
	}
		
	// methods
	public function GetInstance()
	{
		return new Karton();
	}
	
	public function GetTypeInstance()
	{
		return new AblageTyp();
	}
	
	/*protected function GetFullBezeichnung()
	{
		$fullBezeichnung = $this->GetBezeichnung();
		
		$kontexte = $this->GetKontexte();			
		
		if (count($kontexte) > 0)
		{
			$fullBezeichnung .= "{";
			
			for ($i = 0; $i < count($kontexte); $i++)
			{
				$fullBezeichnung .= $kontexte[$i]->GetFullBezeichnung();
			}
			
			$fullBezeichnung .= "}";
		}	
		
		if ($this->GetParent() != NULL)
			$fullBezeichnung = $this->GetParent()->GetFullBezeichnung()."-".$fullBezeichnung;
		
		return $fullBezeichnung;
	}*/
}
?>
