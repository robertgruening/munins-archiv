<?php
include_once(__DIR__."/config.php");
include_once(__DIR__."/IListFactory.php");

class ListFactory implements iListFactory
{
	#region variables
	private $_modelFactory = null;
	#endregion

	#region properties
	protected function getModelFactory()
	{
		return $this->_modelFactory;
	}
	#endregion

	#region constructors
	function __construct($modelFactory)
	{
		$this->_modelFactory = $modelFactory;
	}
	#endregion

	#region methods
	#region load
	public function loadAll()
	{
		$searchConditions = array();
		$elements = $this->getModelFactory()->loadBySearchConditions($searchConditions);

		if ($elements == null)
		{
			return array();
		}

		return $elements;
	}
	#endregion
	#endregion
}
