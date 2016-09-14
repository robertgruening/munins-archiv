<?php
include_once(__DIR__."/../StdLib/class.ListElement.php");

class FundAttributTyp extends ListElement
{
	// variables
	protected $_tableName = "FundAttributTyp";

	// constructors
	
	// methods
	public function GetInstance()
	{
		return new FundAttributTyp();
	}
}
?>
