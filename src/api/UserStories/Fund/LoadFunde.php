<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/FundFactory.php");

class LoadFunde extends UserStory
{
    #region variables
    private $_funde = array();
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
        return true;
    }

    protected function execute()
    {
        $fundFactory = new FundFactory();
        $funde = $fundFactory->loadBySearchConditions($this->getSearchConditions());
        $this->setFunde($funde);

        return true;
    }
}
