<?php
include_once(__DIR__."/../StdLib/class.ListElement.php");

class KontextTyp extends ListElement
{
	// variables
	protected $_tableName = "KontextTyp";

	// constructors
	
	// methods
	public function GetInstance()
	{
		return new KontextTyp();
	}
}
?>
