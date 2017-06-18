<?php
include_once(__DIR__."/../StdLib/class.ListElement.php");

class OrtTyp extends ListElement
{
	// variables
	protected $_tableName = "OrtTyp";

	// constructors
	
	// methods
	public function GetInstance()
	{
		return new OrtTyp();
	}
}
?>
