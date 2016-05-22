<?php
include_once(__DIR__."/../config.php");
include_once(__DIR__."/../StdLib/class.TypedNode.php");
include_once(__DIR__."/class.FundAttributTyp.php");

class FundAttribut extends TypedNode
{
	// variables
	protected $_tableName = "FundAttribut";
	
	// properties

	// methods		
	public function GetInstance()
	{
		return new FundAttribut();
	}
	
	public function GetTypeInstance()
	{
		return new FundAttributTyp();
	}
}
?>
