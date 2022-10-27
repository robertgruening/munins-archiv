<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/FundFactory.php");

class LoadFunde extends UserStory
{
    #region variables
	private $_funde = array();
	private $_count = 0;
	private $_searchConditions = array();
	private $_pagingConditions = null;
	private $_sortingConditions = null;
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

	private function getSortingConditions()
	{
		return $this->_sortingConditions;
	}

	public function setSortingConditions($sortingConditions)
	{
		$this->_sortingConditions = $sortingConditions;
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
	
    public function getCount()
    {
        return $this->_count;
    }

    private function setCount($count)
    {
        $this->_count = $count;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
		if ($this->getPagingConditions() == null)
		{
			$this->setPagingConditions(array());
		}

		if (!isset($this->getPagingConditions()["PageSize"]) ||
			!is_numeric($this->getPagingConditions()["PageSize"]))
		{
			$pagingConditions = $this->getPagingConditions();
			$pagingConditions["PageSize"] = 11;
			$this->setPagingConditions($pagingConditions);
		}

		if (!isset($this->getPagingConditions()["PagingDirection"]) ||
			($this->getPagingConditions()["PagingDirection"] != "forward" &&
			 $this->getPagingConditions()["PagingDirection"] != "backward"))
		{
			$pagingConditions = $this->getPagingConditions();
			$pagingConditions["PagingDirection"] = "forward";
			$this->setPagingConditions($pagingConditions);
		}

		if ($this->getSortingConditions() == null)
		{
			$this->setSortingConditions(array());
		}

		if (!isset($this->getSortingConditions()["SortingOrder"]) ||
			(strtoupper($this->getSortingConditions()["SortingOrder"]) != "ASC" &&
			 strtoupper($this->getSortingConditions()["SortingOrder"]) != "DESC"))
		{
			$sortingConditions = $this->getSortingConditions();
			$sortingConditions["SortingOrder"] = "ASC";
			$this->setSortingConditions($sortingConditions);
		}

        return true;
    }

    protected function execute()
    {
        $fundFactory = new FundFactory();
        $funde = $fundFactory->loadBySearchConditions($this->getSearchConditions(), $this->getPagingConditions(), $this->getSortingConditions());
		$this->setFunde($funde);
		$this->setCount($fundFactory->countBySearchConditions($this->getSearchConditions()));

        return true;
    }
}
