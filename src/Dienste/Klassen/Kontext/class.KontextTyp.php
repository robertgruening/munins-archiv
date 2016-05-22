<?php
include_once(__DIR__."/../StdLib/class.ListType.php");

class KontextTyp extends ListType
{
	// variables
	protected $_tableName = "KontextTyp";
	
	// methods
	public function GetInstance()
	{
		return new KontextTyp();
	}
}
?>
