<?php
require_once(__DIR__."/../UserStories/UserStory.php");

class LoadEntites extends UserStory
{
    #region variables
    private $_entites = array();
	private $_searchConditions = array();
    #endregion

    #endregion properties
	#region input properties
	private function getSearchConditions()
	{
		return $this->_searchConditions;
	}

	public function addSearchCondition($field, $value)
	{
		$this->_searchConditions[$field] = $value;
	}
	#endregion

	private $_repository = null;

    #region output properties
    public function getEntites()
    {
        return $this->_entites;
    }

    private function setEntites($entites)
    {
        $this->_entites = $entites;
    }
    #endregion
    #endregion

	#region constructor
	public function __construct($repository)
	{
		$this->_repository = $repository;
	}
	#endregion

    protected function areParametersValid()
    {
        return true;
    }

    protected function execute()
    {
        $entites = $this->_repository->loadBySearchConditions($this->getSearchConditions());
        $this->setEntites($entites);

        return true;
    }
}
