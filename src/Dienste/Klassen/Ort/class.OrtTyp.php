<?php
include_once(__DIR__."/../StdLib/class.ListType.php");

class OrtTyp extends ListType
{
	// variables
	protected $_tableName = "OrtTyp";
	
	// methods
	public function GetInstance()
	{
		return new OrtTyp();
	}
}
?>
