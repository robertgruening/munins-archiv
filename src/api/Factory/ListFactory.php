<?php
include_once(__DIR__."/config.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/ISqlSearchConditionStringsProvider.php");

class ListFactory implements iListFactory, iSqlSearchConditionStringsProvider
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
		return $this->getModelFactory()->loadBySearchConditions();
	}

	/**
	* Returns the SQL statement search conditions as string by the given search conditions.
	* Search condition keys are: Id and Bezeichnung.
	*
	* @param $searchConditions Array of search conditions (key, value) to be translated into SQL WHERE conditions.
	*/
	public function getSqlSearchConditionStringsBySearchConditions($searchConditions)
	{
		if ($searchConditions == null ||
			count($searchConditions) == 0)
		{
			return array();
		}

		$sqlSearchConditionStrings = array();

		if (isset($searchConditions["Id"]))
		{
			array_push($sqlSearchConditionStrings, "Id = ".$searchConditions["Id"]);
		}

		if (isset($searchConditions["Bezeichnung"]))
		{
			array_push($sqlSearchConditionStrings, "Bezeichnung LIKE '%".$searchConditions["Bezeichnung"]."%'");
		}

		return $sqlSearchConditionStrings;
	}
	#endregion
	#endregion
}
