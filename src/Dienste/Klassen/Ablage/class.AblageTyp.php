<?php
include_once(__DIR__."/../StdLib/class.ListElement.php");

class AblageTyp extends ListElement
{
	// variables
	protected $_tableName = "AblageTyp";

	// constructors
	
	// methods
	protected function GetInstance()
	{
		return new AblageTyp();
	}
}
?>
