<?php
include_once(__DIR__."/../StdLib/class.ListType.php");

class FundAttributTyp extends ListType
{
	// variables
	protected $_tableName = "FundAttributTyp";
	
	// methods
	public function GetInstance()
	{
		return new FundAttributTyp();
	}
}
?>
