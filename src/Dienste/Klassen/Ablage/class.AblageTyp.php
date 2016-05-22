<?php
include_once(__DIR__."/../StdLib/class.ListType.php");

class AblageTyp extends ListType
{
	// variables
	protected $_tableName = "AblageTyp";
	
	// methods
	public function GetInstance()
	{
		return new AblageTyp();
	}
}
?>
