<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/FundFactory.php");

class LoadFunde extends UserStory
{
    #region variables
    private $_funde = array();
	private $_searchConditions = array();
	private $_pagingConditions = null;
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

	private function getPagingConditions()
	{
		return $this->_pagingConditions;
	}

	public function setPagingConditions($pagingConditions)
	{
		$this->_pagingConditions = $pagingConditions;
	}
	#endregion

    #region output properties
    public function getFunde()
    {
        return $this->_funde;
    }

    private function setFunde($funde)
    {
        $this->_funde = $funde;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
		if ($this->getPagingConditions() == null)
		{
			$pagingConditions = array();
			$pagingConditions["PageSize"] = 11;
			$this->setPagingConditions($pagingConditions);
		}

		if (!is_numeric($this->getPagingConditions()["PageSize"]))
		{
			$this->addMessage("PagingConditions' attribute PageSize is not a number!");
			return false;
		}

        return true;
    }

    protected function execute()
    {
        $fundFactory = new FundFactory();
        $funde = $fundFactory->loadBySearchConditions($this->getSearchConditions(), $this->getPagingConditions());
        $this->setFunde($funde);

        return true;
    }
}
